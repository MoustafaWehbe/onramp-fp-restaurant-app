interface BranchMapProps {
    latitude: number;
    longitude: number;
}

const BranchMap = ({ latitude, longitude }: BranchMapProps) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        <div className="space-y-4 rounded-3xl border p-6">
            <h3 className="text-xl font-semibold">
                Location
            </h3>

            <p className="text-sm text-muted-foreground">
                Coordinates: {latitude}, {longitude}
            </p>

            <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border px-5 py-3 font-medium transition hover:bg-muted"
            >
                Open in Google Maps
            </a>
        </div>
    );
};

export default BranchMap;