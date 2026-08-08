import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BranchGallery from "@/components/shared/BranchGallery";
import BranchInfo from "@/components/shared/BranchInfo";
import Reviews from "@/components/shared/Reviews";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import BranchMap from "@/components/shared/BranchMap";
import { apiClient } from "@/lib/api-client";
import MenusSection from "@/components/shared/MenuSection";
import ReviewForm from "@/components/shared/ReviewForm";
import { useAuth } from "@/hooks/useAuth";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
    };
}

interface BranchDetailsResponse {
    branch: {
        id: string;
        restaurantId: string;
        name: string;
        slug: string;
        city: string;
        address: string;
        latitude: number;
        longitude: number;
        phone: string;
        opening_hours: string;
        images: {
            url: string;
            type: string;
        }[];
        menus: {
            id: string;
            name: string;
        }[];
        reviews: Review[];
    };
    reviewSummary: {
        averageRating: string;
        totalReviews: number;
    };
}

const BranchDetailsPage = () => {
    const { restaurantSlug, branchSlug } = useParams();
    const { user } = useAuth();

    const [hasError, setHasError] = useState(false);
    const [data, setData] = useState<BranchDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [reviews, setReviews] = useState<Review[]>([]);


    useEffect(() => {
        const fetchBranch = async () => {
            try {
                setIsLoading(true);
                setHasError(false);

                const response = await apiClient.get(
                    `/restaurants/${restaurantSlug}/branches/${branchSlug}`
                );

                const branchData = response.data.data;

                setData(branchData);
                setReviews(branchData.branch.reviews);

            } catch {
                setData(null);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (restaurantSlug && branchSlug) {
            fetchBranch();
        }

    }, [restaurantSlug, branchSlug]);


    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (hasError) {
        return (
            <p className="text-destructive">
                Failed to load branch details.
            </p>
        );
    }

    if (!data) {
        return (
            <p className="text-destructive">
                Branch not found.
            </p>
        );
    }

    const refreshBranch = async () => {
        const response = await apiClient.get(
            `/restaurants/${restaurantSlug}/branches/${branchSlug}`
        );

        const branchData = response.data.data;

        setData(branchData);
        setReviews(branchData.branch.reviews);
    };
    const { branch, reviewSummary } = data;


    const handleCreateReview = async () => {
        await refreshBranch();
    };

    const handleUpdateReview = async () => {
        await refreshBranch();
    };


    const handleDeleteReview = async (reviewId: string) => {
        try {
            await apiClient.delete(`/reviews/${reviewId}`);

            await refreshBranch();

        } catch (error) {
            console.error("Failed to delete review", error);
        }
    }; 

    return (
        <div className="space-y-10">

            <BranchGallery images={branch.images} />


            <div className="grid gap-10 lg:grid-cols-3">

                <div className="lg:col-span-2">
                    <BranchInfo
                        branch={branch}
                        reviewSummary={reviewSummary}
                    />
                </div>


                <aside className="space-y-6">
                    <BranchMap
                        latitude={Number(branch.latitude)}
                        longitude={Number(branch.longitude)}
                    />
                </aside>

            </div>


            <MenusSection
                menus={branch.menus}
                title={`${branch.name} Menus`}
                description="Browse all available menus from this restaurant."
            />


            <section className="space-y-6">

                <div>
                    <h2 className="text-3xl font-bold">
                        Reviews
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        See what visitors think about this branch
                    </p>
                </div>


                <ReviewForm
                    restaurantSlug={restaurantSlug!}
                    branchSlug={branch.slug}
                    onCreated={handleCreateReview}
                />

                <Reviews
                    reviews={reviews}
                    currentUserId={user?.id}
                    onUpdate={handleUpdateReview}
                    onDelete={handleDeleteReview}
                />
            </section>

        </div>
    );
};

export default BranchDetailsPage;