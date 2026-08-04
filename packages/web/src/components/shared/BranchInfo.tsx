import {
    MapPin,
    Phone,
    Clock,
    Star,
} from "lucide-react";

interface BranchInfoProps {
    branch: any;
    reviewSummary: {
        averageRating: string;
        totalReviews: number;
    };
}

const isOpenNow = (hours: string) => {
    const [openTime, closeTime] = hours.split(" - ");

    if (!openTime || !closeTime) return false;

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    const openingMinutes =
        openHour * 60 + openMinute;

    const closingMinutes =
        closeHour * 60 + closeMinute;

    if (closingMinutes < openingMinutes) {
        return (
            currentMinutes >= openingMinutes ||
            currentMinutes <= closingMinutes
        );
    }

    return (
        currentMinutes >= openingMinutes &&
        currentMinutes <= closingMinutes
    );
};

const BranchInfo = ({ branch, reviewSummary }: BranchInfoProps) => {
    const openNow = isOpenNow(branch.opening_hours);

    return (
        <section className="w-full py-8">

            {/* Header */}
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">

                <div>
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                        {branch.name}
                    </h1>
                    {/* Open status */}
                    <div className="mt-5 flex items-center gap-3">

                        <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${openNow
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {openNow ? "● Open Now" : "● Closed Now"}
                        </span>

                    </div>

                </div>


                {/* Rating */}
                <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 px-6 py-5 text-white shadow-lg">

                    <div className="rounded-full bg-white/20 p-3">
                        <Star className="h-8 w-8 fill-white text-white" />
                    </div>

                    <div>
                        <p className="text-3xl font-bold">
                            {reviewSummary.averageRating}
                        </p>

                        <p className="text-sm text-white/90">
                            {reviewSummary.totalReviews} reviews
                        </p>
                    </div>

                </div>

            </div>


            {/* Details */}
            <div className="mt-12 grid gap-5 md:grid-cols-3">

                <div className="rounded-2xl bg-orange-50 p-6 transition hover:shadow-md">
                    <Clock className="mb-4 h-7 w-7 text-orange-500" />

                    <p className="text-sm text-muted-foreground">
                        Opening Hours
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                        {branch.opening_hours}
                    </p>
                </div>


                <div className="rounded-2xl bg-amber-50 p-6 transition hover:shadow-md">
                    <Phone className="mb-4 h-7 w-7 text-amber-500" />

                    <p className="text-sm text-muted-foreground">
                        Contact
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                        {branch.phone}
                    </p>
                </div>


                <div className="rounded-2xl bg-yellow-50 p-6 transition hover:shadow-md">
                    <MapPin className="mb-4 h-7 w-7 text-yellow-600" />

                    <p className="text-sm text-muted-foreground">
                        Location
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                        {branch.city}
                    </p>
                </div>

            </div>

        </section>
    );
};

export default BranchInfo;