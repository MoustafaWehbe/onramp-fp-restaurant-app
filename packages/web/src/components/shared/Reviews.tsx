import ReviewCard from "./ReviewCard";

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

interface ReviewsProps {
    reviews: Review[];
    currentUserId?: string;
    type?: "restaurant" | "branch";
    onUpdate: (review: Review) => void;
    onDelete: (reviewId: string) => void;
}

const Reviews = ({
    reviews,
    currentUserId,
    type,
    onUpdate,
    onDelete,
}: ReviewsProps) => {

    return (
        <div className="space-y-6">
            {reviews.length === 0 ? (
                <p className="text-center text-gray-500">
                    {
                        type == "branch"
                        ? "Be the first to leave a review!"
                        : "There are no reviews for this restaurant yet."
                    }
                </p>
            ) : (
                reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        canEdit={
                            Boolean(
                                currentUserId &&
                                review.user.id === currentUserId
                            )
                        }
                        onUpdate={onUpdate}
                        onDelete={() => onDelete(review.id)}
                    />
                ))
            )}
        </div>
    );
};
export default Reviews;