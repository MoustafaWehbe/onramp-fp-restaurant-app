import { createError } from "src/middleware/error-handler";
import { Restaurant } from "@starter-kit/shared";

interface ResolveGoogleMapsLocationData {
    restaurantSlug: string;
    url: string;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

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

    /*
     * First try to extract coordinates directly
     * from the URL.
     */
    const directCoordinates =
        extractCoordinates(cleanUrl);

    if (directCoordinates) {
        return directCoordinates;
    }

    /*
     * If this is a shortened Google Maps URL
     * such as:
     *
     * https://maps.app.goo.gl/xxxxxxxx
     *
     * follow the redirect and inspect the final URL.
     */
    if (isGoogleMapsShortUrl(cleanUrl)) {
        try {
            const response = await fetch(cleanUrl, {
                method: "GET",
                redirect: "follow",
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
                },
            });

            /*
             * fetch follows redirects automatically.
             * response.url contains the final URL.
             */
            const finalUrl = response.url;

            const redirectedCoordinates =
                extractCoordinates(finalUrl);

            if (redirectedCoordinates) {
                return redirectedCoordinates;
            }

            /*
             * Sometimes Google returns an HTML page
             * instead of putting the coordinates in
             * response.url.
             *
             * Try extracting coordinates from the
             * response body as a fallback.
             */
            const html = await response.text();

            const htmlCoordinates =
                extractCoordinates(html);

            if (htmlCoordinates) {
                return htmlCoordinates;
            }
        } catch (error) {
            console.error(
                "Failed to resolve Google Maps short URL:",
                error,
            );
        }
    }

    /*
     * Last attempt:
     * try extracting coordinates from the URL
     * even if it isn't recognized as a short URL.
     */
    return extractCoordinates(cleanUrl);
}

function isGoogleMapsShortUrl(
    url: string,
): boolean {
    try {
        const parsedUrl = new URL(url);

        return (
            parsedUrl.hostname ===
                "maps.app.goo.gl" ||
            parsedUrl.hostname ===
                "goo.gl"
        );
    } catch {
        return false;
    }
}

function extractCoordinates(
    value: string,
): Coordinates | null {
    /*
     * Format:
     *
     * https://www.google.com/maps/@33.8938,35.5018,17z
     *
     * Also handles:
     *
     * /place/Restaurant/@33.8938,35.5018,17z
     */
    const atPattern =
        /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

    const atMatch = value.match(atPattern);

    if (atMatch) {
        return createCoordinates(
            atMatch[1],
            atMatch[2],
        );
    }

    /*
     * Format:
     *
     * https://www.google.com/maps?q=33.8938,35.5018
     *
     * or:
     *
     * https://www.google.com/maps?ll=33.8938,35.5018
     */
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

    /*
     * Google sometimes uses encoded URLs.
     * Decode the value and try again.
     */
    try {
        const decoded = decodeURIComponent(value);

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

    /*
     * Validate geographic ranges.
     */
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