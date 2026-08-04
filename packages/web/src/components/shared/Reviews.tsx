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
}

const Reviews = ({ reviews }: ReviewsProps) => {
  if (!reviews.length) {
    return (
      <p className="text-muted-foreground">
        No reviews yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
        />
      ))}
    </div>
  );
};

export default Reviews;