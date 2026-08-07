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
    onUpdate: (review: Review) => void;
    onDelete: (reviewId: string) => void;
}

const Reviews = ({
    reviews,
    currentUserId,
    onUpdate,
    onDelete,
}: ReviewsProps) => {

    return (
        <div className="space-y-6">
            {reviews.map((review) => {
                return (
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
                );
            })}
        </div>
    );
};

export default Reviews;