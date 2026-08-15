import { createError } from "src/middleware/error-handler";
import { Restaurant } from "@starter-kit/shared";
import { GOOGLE_MAPS_HOSTS } from "src/schemas/owner/location.schema";

interface ResolveGoogleMapsLocationData {
    restaurantSlug: string;
    url: string;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT = 5000;
const MAX_RESPONSE_SIZE = 1024 * 1024; // 1 MB

export const locationService = {
    resolveGoogleMaps: async ({
        restaurantSlug,
        url,
    }: ResolveGoogleMapsLocationData) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug: restaurantSlug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const coordinates =
            await extractCoordinatesFromGoogleMapsUrl(
                url,
            );

        if (!coordinates) {
            throw createError(
                "We couldn't find a location in this Google Maps link. Please copy the location link from Google Maps and try again.",
                400,
            );
        }

        return coordinates;
    },
};

async function extractCoordinatesFromGoogleMapsUrl(
    url: string,
): Promise<Coordinates | null> {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
        return null;
    }

    // First try extracting coordinates directly.
    const directCoordinates =
        extractCoordinates(cleanUrl);

    if (directCoordinates) {
        return directCoordinates;
    }

    if (!isGoogleMapsShortUrl(cleanUrl)) {
        return extractCoordinates(cleanUrl);
    }

    let currentUrl = cleanUrl;

    for (
        let redirectCount = 0;
        redirectCount <= MAX_REDIRECTS;
        redirectCount++
    ) {
        try {
            const controller =
                new AbortController();

            const timeout = setTimeout(
                () => controller.abort(),
                REQUEST_TIMEOUT,
            );

            let response: Response;

            try {
                response = await fetch(
                    currentUrl,
                    {
                        method: "GET",
                        redirect: "manual",
                        signal: controller.signal,
                        headers: {
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
                        },
                    },
                );
            } finally {
                clearTimeout(timeout);
            }

            /*
             * Handle redirects manually so every
             * redirect destination can be validated.
             */
            if (
                response.status >= 300 &&
                response.status < 400
            ) {
                if (
                    redirectCount >=
                    MAX_REDIRECTS
                ) {
                    return null;
                }

                const location =
                    response.headers.get(
                        "location",
                    );

                if (!location) {
                    return null;
                }

                const redirectUrl =
                    new URL(
                        location,
                        currentUrl,
                    );

                if (
                    !isAllowedRedirectUrl(
                        redirectUrl,
                    )
                ) {
                    return null;
                }

                currentUrl =
                    redirectUrl.toString();

                const redirectedCoordinates =
                    extractCoordinates(
                        currentUrl,
                    );

                if (redirectedCoordinates) {
                    return redirectedCoordinates;
                }

                continue;
            }

            /*
             * Check the final response URL too.
             */
            const finalUrl = new URL(
                response.url || currentUrl,
            );

            if (
                !isAllowedRedirectUrl(finalUrl)
            ) {
                return null;
            }

            const finalUrlCoordinates =
                extractCoordinates(
                    finalUrl.toString(),
                );

            if (finalUrlCoordinates) {
                return finalUrlCoordinates;
            }

            /*
             * Read only a limited amount of the
             * response body.
             */
            const html =
                await readLimitedResponse(
                    response,
                    MAX_RESPONSE_SIZE,
                );

            if (!html) {
                return null;
            }

            return extractCoordinates(html);
        } catch (error) {
            console.error(
                "Failed to resolve Google Maps short URL:",
                error,
            );

            return null;
        }
    }

    return null;
}

function isGoogleMapsShortUrl(
    url: string,
): boolean {
    try {
        const parsedUrl = new URL(url);

        return (
            parsedUrl.hostname ===
                "maps.app.goo.gl" ||
            parsedUrl.hostname === "goo.gl"
        );
    } catch {
        return false;
    }
}

/**
 * Validates redirect destinations.
 *
 * The initial URL is already validated by Zod.
 * This check is only needed because redirect URLs
 * never pass through the request schema.
 */
function isAllowedRedirectUrl(
    url: URL,
): boolean {
    const hostname =
        url.hostname.toLowerCase();

    if (!GOOGLE_MAPS_HOSTS.has(hostname)) {
        return false;
    }

    /*
     * Reject IP literals.
     */
    if (
        url.hostname ===
            url.hostname.match(
                /^\d{1,3}(?:\.\d{1,3}){3}$/,
            )?.[0] ||
        url.hostname.includes(":")
    ) {
        return false;
    }

    return true;
}

async function readLimitedResponse(
    response: Response,
    maxBytes: number,
): Promise<string | null> {
    if (!response.body) {
        return null;
    }

    const reader =
        response.body.getReader();

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { done, value } =
                await reader.read();

            if (done) {
                break;
            }

            if (!value) {
                continue;
            }

            totalBytes += value.byteLength;

            if (totalBytes > maxBytes) {
                await reader.cancel();
                return null;
            }

            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }

    const combined =
        new Uint8Array(totalBytes);

    let offset = 0;

    for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.byteLength;
    }

    return new TextDecoder().decode(
        combined,
    );
}

function extractCoordinates(
    value: string,
): Coordinates | null {
    const atPattern =
        /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

    const atMatch = value.match(atPattern);

    if (atMatch) {
        return createCoordinates(
            atMatch[1],
            atMatch[2],
        );
    }

    const queryPattern =
        /[?&](?:q|ll)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

    const queryMatch =
        value.match(queryPattern);

    if (queryMatch) {
        return createCoordinates(
            queryMatch[1],
            queryMatch[2],
        );
    }

    try {
        const decoded =
            decodeURIComponent(value);

        if (decoded !== value) {
            const decodedCoordinates =
                extractCoordinates(decoded);

            if (decodedCoordinates) {
                return decodedCoordinates;
            }
        }
    } catch {
        // Ignore malformed encoded URLs.
    }

    return null;
}

function createCoordinates(
    latitude: string,
    longitude: string,
): Coordinates | null {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return null;
    }

    if (lat < -90 || lat > 90) {
        return null;
    }

    if (lng < -180 || lng > 180) {
        return null;
    }

    return {
        latitude: lat,
        longitude: lng,
    };
}