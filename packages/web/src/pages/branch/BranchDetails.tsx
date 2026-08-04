import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BranchGallery from "@/components/shared/BranchGallery";
import BranchInfo from "@/components/shared/BranchInfo";
import Reviews from "@/components/shared/Reviews";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import BranchMap from "@/components/shared/BranchMap";
import { apiClient } from "@/lib/api-client";
import MenusSection from "@/components/shared/MenuSection";
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
        reviews: {
            id: string;
            rating: number;
            comment: string;
            createdAt: string;
            user: {
                id: string;
                name: string;
            };
        }[];
    };
    reviewSummary: {
        averageRating: string;
        totalReviews: number;
    };
}

const BranchDetailsPage = () => {
    const { restaurantSlug, branchSlug } = useParams();
    const [hasError, setHasError] = useState(false);
    const [data, setData] = useState<BranchDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                setIsLoading(true);
                setHasError(false);
                const response = await apiClient.get(
                    `/restaurants/${restaurantSlug}/branches/${branchSlug}`
                );

                setData(response.data.data);
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

    const { branch, reviewSummary } = data;



    return (
        <div className="space-y-10">

            {/* Hero image */}
            <BranchGallery
                images={branch.images}
            />

            {/* Info + Sidebar */}
            <div className="grid gap-10 lg:grid-cols-3">

                {/* Main information */}
                <div className="lg:col-span-2">
                    <BranchInfo
                        branch={branch}
                        reviewSummary={reviewSummary}
                    />
                </div>


                {/* Right sidebar */}
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

            {/* Reviews Section */}
            <section className="space-y-6">

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div>
                        <h2 className="text-3xl font-bold">
                            Reviews
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            See what visitors think about this branch
                        </p>
                    </div>

                </div>

                <Reviews
                    reviews={branch.reviews}
                />

            </section>

        </div>
    );
};

export default BranchDetailsPage;