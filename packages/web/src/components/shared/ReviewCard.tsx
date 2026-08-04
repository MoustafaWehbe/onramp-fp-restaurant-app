import { Star } from "lucide-react";

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
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="group rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-semibold text-white">
            {review.user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {review.user.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>


        {/* Rating */}
        <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

          <span className="font-semibold text-gray-900">
            {review.rating}
          </span>
        </div>
      </div>


      {/* Comment */}
      <p className="mt-6 text-[15px] leading-relaxed text-gray-700">
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;