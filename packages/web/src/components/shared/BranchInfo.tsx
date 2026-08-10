import {
    MapPin,
    Phone,
    Clock,
    Star,
    ChevronRight,
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

    const [openHour, openMinute] =
        openTime.split(":").map(Number);

    const [closeHour, closeMinute] =
        closeTime.split(":").map(Number);

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

const BranchInfo = ({
    branch,
    reviewSummary,
}: BranchInfoProps) => {
    const openNow = isOpenNow(branch.opening_hours);

    return (
        <section className="w-full py-10">

            {/* Main Header */}
            <div className="relative overflow-hidden rounded-[30px] border border-orange-100/80 bg-gradient-to-br from-white via-white to-orange-50/60 p-7 shadow-[0_12px_45px_rgba(0,0,0,0.05)] sm:p-9">

                {/* Decorative elements */}
                <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-100/40 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-48 w-48 rounded-full bg-amber-100/30 blur-3xl" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                    {/* Branch information */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-px w-7 bg-orange-400" />

                            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-500">
                                Restaurant Branch
                            </span>
                        </div>

                        <h1 className="text-4xl font-semibold tracking-[-0.03em] text-gray-900 sm:text-5xl">
                            {branch.name}
                        </h1>

                        {/* Status */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <div
                                className={`flex items-center gap-2 rounded-full border px-3.5 py-2 shadow-sm ${openNow
                                    ? "border-emerald-100 bg-emerald-50/70"
                                    : "border-red-100 bg-red-50/70"
                                    }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${openNow
                                        ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]"
                                        : "bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                                        }`}
                                />

                                <span
                                    className={`text-xs font-semibold ${openNow
                                        ? "text-emerald-700"
                                        : "text-red-600"
                                        }`}
                                >
                                    {openNow ? "Open now" : "Closed now"}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* Rating Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-orange-100/80 bg-white px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.045)]">

                        {/* Subtle glow */}
                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl" />

                        <div className="relative flex items-center gap-5">

                            {/* Rating score */}
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50">
                                <span className="text-xl font-semibold tracking-tight text-gray-900">
                                    {reviewSummary.averageRating}
                                </span>
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    Guest Rating
                                </p>

                                {/* Stars */}
                                {/* Stars */}
                                <div className="mt-2 flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((value) => {
                                        const rating = Number(reviewSummary.averageRating);
                                        const fraction = rating % 1;

                                        const isFull = value <= Math.floor(rating);
                                        const isPartial =
                                            value === Math.ceil(rating) && fraction > 0;

                                        return (
                                            <div
                                                key={value}
                                                className="relative h-5 w-5"
                                            >
                                                {/* Empty star */}
                                                <Star
                                                    className="absolute h-5 w-5 text-amber-200"
                                                    strokeWidth={1.5}
                                                />

                                                {/* Full star */}
                                                {isFull && (
                                                    <Star
                                                        className="absolute h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)]"
                                                        strokeWidth={1.5}
                                                    />
                                                )}

                                                {/* Partial star */}
                                                {isPartial && (
                                                    <div
                                                        className="absolute left-0 top-0 h-5 overflow-hidden"
                                                        style={{
                                                            width: `${fraction * 100}%`,
                                                        }}
                                                    >
                                                        <Star
                                                            className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)]"
                                                            strokeWidth={1.5}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <p className="mt-1.5 text-xs text-gray-400">
                                    Based on {reviewSummary.totalReviews}{" "}
                                    {reviewSummary.totalReviews === 1
                                        ? "review"
                                        : "reviews"}
                                </p>
                            </div>

                        </div>
                        <ChevronRight className="hidden h-4 w-4 text-gray-300 sm:block" />
                    </div>
                </div>
            </div>


            {/* Information */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">

                {/* Opening Hours */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_5px_25px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-orange-50/70 blur-2xl transition-all group-hover:bg-orange-100/70" />

                    <div className="relative flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                            <Clock
                                className="h-5 w-5 text-orange-500"
                                strokeWidth={1.7}
                            />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                Opening Hours
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-900">
                                {branch.opening_hours}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                {openNow
                                    ? "Currently serving guests"
                                    : "Currently closed"}
                            </p>
                        </div>
                    </div>
                </div>


                {/* Contact */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_5px_25px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-orange-50/70 blur-2xl transition-all group-hover:bg-orange-100/70" />

                    <div className="relative flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                            <Phone
                                className="h-5 w-5 text-orange-500"
                                strokeWidth={1.7}
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                Contact
                            </p>

                            <p className="mt-2 truncate text-sm font-semibold text-gray-900">
                                {branch.phone}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Call the branch
                            </p>
                        </div>
                    </div>
                </div>


                {/* Location */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_5px_25px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-orange-50/70 blur-2xl transition-all group-hover:bg-orange-100/70" />

                    <div className="relative flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                            <MapPin
                                className="h-5 w-5 text-orange-500"
                                strokeWidth={1.7}
                            />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                Location
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-900">
                                {branch.city}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Restaurant location
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default BranchInfo;
