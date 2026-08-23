import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Star } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ReviewFormProps {
    restaurantSlug: string;
    branchSlug: string;
    review?: {
        id: string;
        rating: number;
        comment: string;
    };
    onCreated?: (review: any) => void;
    onUpdated?: (review: any) => void;
    onCancel?: () => void;
}

const ReviewForm = ({
    restaurantSlug,
    branchSlug,
    review,
    onCreated,
    onUpdated,
    onCancel,
}: ReviewFormProps) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [rating, setRating] = useState(review?.rating ?? 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(review?.comment ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = Boolean(review);

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
        } else {
            setRating(0);
            setComment("");
        }
    }, [review]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            let response;

            if (isEditing) {
                response = await apiClient.patch(`/reviews/${review?.id}`, {
                    rating,
                    comment,
                });

                onUpdated?.(response.data.data);
            } else {
                response = await apiClient.post(
                    `/restaurants/${restaurantSlug}/branches/${branchSlug}/reviews`,
                    {
                        rating,
                        comment,
                    }
                );

                onCreated?.(response.data.data);

                setComment("");
                setRating(0);
            }
        } catch (error: any) {
            setError(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to save review"
            );
        } finally {
            setLoading(false);
        }
    };

    const displayedRating = hoverRating || rating;
    
    if (!user) {
        const redirectTo = `${location.pathname}${location.search}`;

        return (
            <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-orange-100/40 blur-3xl" />

                <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                        Share Your Experience
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                        Sign in to write a review
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Sign in to share your experience and help other people
                        discover great restaurants.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/login?redirect=${encodeURIComponent(redirectTo)}`
                            )
                        }
                        className="mt-5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Sign in to review
                    </button>
                </div>
            </div>
        );
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
        >
            {/* Subtle decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-orange-100/40 blur-3xl" />

            <div className="relative space-y-5">
                {/* Header */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                        {isEditing ? "Your Review" : "Share Your Experience"}
                    </p>

                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                        {isEditing
                            ? "Update your review"
                            : "How was your experience?"}
                    </h3>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                        {error === "You have already reviewed this branch"
                            ? "You already created a review for this branch."
                            : error}
                    </div>
                )}

                {/* Rating */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
                    <div>
                        <label className="text-sm font-semibold text-gray-900">
                            Your rating
                        </label>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Tap a star to rate
                        </p>
                    </div>

                    <div
                        className="mt-3 flex items-center gap-1"
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        {[1, 2, 3, 4, 5].map((value) => {
                            const isFilled = value <= displayedRating;

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHoverRating(value)}
                                    aria-label={`Rate ${value} out of 5`}
                                    className="rounded-full p-0.5 transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    <Star
                                        size={25}
                                        strokeWidth={1.7}
                                        className={
                                            isFilled
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                        }
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500">
                            {displayedRating === 0 && "Select a rating"}
                            {displayedRating === 5 && "Excellent — loved it! ✨"}
                            {displayedRating === 4 && "Great experience!"}
                            {displayedRating === 3 && "It was good."}
                            {displayedRating === 2 && "Could be better."}
                            {displayedRating === 1 && "Not a great experience."}
                        </p>

                        {displayedRating > 0 && (
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
                                {displayedRating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label
                            htmlFor="review-comment"
                            className="text-sm font-semibold text-gray-900"
                        >
                            Your thoughts
                        </label>

                        <span className="text-[11px] text-gray-400">
                            {comment.length}/500
                        </span>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 transition-all focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-50">
                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) => {
                                if (e.target.value.length <= 500) {
                                    setComment(e.target.value);
                                }
                            }}
                            placeholder="Share what you loved about your experience..."
                            rows={3}
                            required
                            className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-5 text-gray-800 outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading || rating === 0}
                        className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {loading
                            ? "Saving..."
                            : isEditing
                                ? "Update Review"
                                : "Publish Review"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ReviewForm;