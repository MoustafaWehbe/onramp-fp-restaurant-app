import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

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
    const [rating, setRating] = useState(review?.rating ?? 5);
    const [comment, setComment] = useState(review?.comment ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = Boolean(review);


    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
        } else {
            setRating(5);
            setComment("");
        }
    }, [review]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            let response;

            if (isEditing) {
                response = await apiClient.patch(
                    `/reviews/${review?.id}`,
                    {
                        rating,
                        comment,
                    }
                );

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
                setRating(5);
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


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-3xl border p-6"
        >

            {error && (
                <p className="text-sm text-red-500">
                    {error === "You have already reviewed this branch"
                        ? "You already created a review for this branch."
                        : error}
                </p>
            )}


            <div>
                <label className="block font-medium">
                    Rating
                </label>

                <select
                    value={rating}
                    onChange={(e) =>
                        setRating(Number(e.target.value))
                    }
                    className="mt-2 rounded-lg border p-2"
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                            {value} ⭐
                        </option>
                    ))}
                </select>
            </div>


            <div>
                <label className="block font-medium">
                    Comment
                </label>

                <textarea
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                    placeholder="Share your experience..."
                    className="mt-2 w-full rounded-lg border p-3"
                    rows={4}
                    required
                />
            </div>


            <div className="flex gap-3">

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-orange-500 px-5 py-2 text-white"
                >
                    {loading
                        ? "Saving..."
                        : isEditing
                            ? "Update Review"
                            : "Add Review"}
                </button>


                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border px-5 py-2"
                    >
                        Cancel
                    </button>
                )}

            </div>

        </form>
    );
};

export default ReviewForm;