import { MapPin, ExternalLink } from "lucide-react";

interface BranchMapProps {
    latitude: number;
    longitude: number;
}

const BranchMap = ({
    latitude,
    longitude,
}: BranchMapProps) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        <section className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-7">

            {/* Subtle decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-100/40 blur-3xl" />

            <div className="relative">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                            <MapPin
                                className="h-5 w-5 text-orange-500"
                                strokeWidth={1.7}
                            />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                                Location
                            </p>

                            <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                                Find us
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                View the branch location on the map.
                            </p>
                        </div>

                    </div>

                </div>


                {/* Coordinates */}
                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
                    <iframe
                        title="Restaurant location"
                        src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                        className="h-64 w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>


                {/* Google Maps Button */}
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200/60"
                >
                    <MapPin
                        className="h-4 w-4"
                        strokeWidth={1.8}
                    />

                    Open in Google Maps

                    <ExternalLink
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                    />
                </a>

            </div>
        </section>
    );
};

export default BranchMap;