import { useState } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface ReviewUser {
    id: string;
    name: string;
}


interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: ReviewUser;
}


interface ReviewCardProps {
    review: Review;
    canEdit: boolean;
    onUpdate: (review: Review) => void;
    onDelete: () => void;
}


const ReviewCard = ({
    review,
    canEdit,
    onUpdate,
    onDelete,
}: ReviewCardProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment);
    const [loading, setLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const response = await apiClient.patch(
                `/reviews/${review.id}`,
                {
                    rating,
                    comment,
                }
            );
            console.log("Update response:", response.data);
            onUpdate(response.data.data.review);
            setIsEditing(false);

        } catch (error) {
            console.error(
                "Failed to update review",
                error
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="rounded-3xl border p-6">

            {/* Header */}
            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                        {review.user.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {review.user.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {new Date(
                                review.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>

                </div>


                <div className="flex items-center gap-3">

                    {canEdit && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="rounded-md p-2 text-orange-600 hover:bg-orange-100"
                                aria-label="Edit review"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="rounded-md p-2 text-red-600 hover:bg-red-100"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}


                    <div className="flex items-center gap-1 rounded-full bg-orange-50/70 px-3.5 py-2 shadow-sm">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <Star
                                key={value}
                                className={`h-5 w-5 ${value <= review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-orange-200"
                                    }`}
                                strokeWidth={1.6}
                            />
                        ))}
                    </div>



                </div>


            </div>


            {/* Content */}
            {isEditing ? (

                <div className="mt-6 space-y-4">

                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(
                                Number(e.target.value)
                            )
                        }
                        className="rounded-lg border p-2"
                    >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <option
                                key={value}
                                value={value}
                            >
                                {value} ⭐
                            </option>
                        ))}
                    </select>


                    <textarea
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                        rows={4}
                    />


                    <div className="flex gap-3">

                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="rounded-lg bg-orange-500 px-5 py-2 text-white"
                        >
                            {loading
                                ? "Saving..."
                                : "Save"}
                        </button>


                        <button
                            onClick={() => {
                                setComment(review.comment);
                                setRating(review.rating);
                                setIsEditing(false);
                            }}
                            className="rounded-lg border px-5 py-2"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            ) : (

                <p className="mt-6 text-gray-700">
                    "{review.comment}"
                </p>

            )}

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete review?"
                description="Are you sure you want to delete this review? This action cannot be undone."
                onCancel={() => setShowDeleteDialog(false)}
                onConfirm={() => {
                    console.log("delete clicked", review.id);
                    onDelete();
                    setShowDeleteDialog(false);
                }}
            />
        </div>
    );
};


export default ReviewCard;