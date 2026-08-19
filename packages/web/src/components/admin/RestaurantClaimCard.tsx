import {
    Check,
    X,
    Mail,
    Phone,
    Store,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


interface RestaurantClaim {
    id: string;

    restaurant: {
        id: string;
        name: string;
        slug: string;
    };

    user: {
        id: string;
        name: string;
        email: string;
        phone?: string | null;
    };

    message?: string | null;

    status: "pending" | "approved" | "rejected" | "completed";

    createdAt: string;
}


interface RestaurantClaimCardProps {
    claim: RestaurantClaim;

    onApprove: (
        claimId: string
    ) => void;

    onReject: (
        claimId: string
    ) => void;

    isUpdating?: boolean;
}


export function RestaurantClaimCard({
    claim,
    onApprove,
    onReject,
    isUpdating = false,
}: RestaurantClaimCardProps) {

    return (
        <Card
            className="
                rounded-2xl
                border-[#EAE4DC]
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(41,37,36,0.04)]
            "
        >

            {/* Header */}

            <div className="flex justify-between gap-4">

                <div>
                    <div className="flex items-center gap-3">

                        <h2
                            className="
                                font-serif
                                text-2xl
                                font-semibold
                                tracking-[-0.025em]
                                text-[#292524]
                            "
                        >
                            {claim.restaurant.name}
                        </h2>


                        <Badge
                            className="
                                rounded-full
                                bg-[#FCFAF7]
                                text-[#78716C]
                                border-[#EAE4DC]
                            "
                        >
                            {claim.status}
                        </Badge>

                    </div>


                    <p className="mt-2 text-sm text-[#78716C]">
                        Submitted on{" "}
                        {new Date(
                            claim.createdAt
                        ).toLocaleDateString()}
                    </p>

                </div>


                <Store
                    className="
                        h-6
                        w-6
                        text-[#A8A29E]
                    "
                />

            </div>



            {/* User information */}

            <div
                className="
                    mt-6
                    grid
                    gap-3
                    border-t
                    border-[#EEE9E2]
                    pt-5
                    sm:grid-cols-2
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-[#57534E]
                    "
                >
                    <Mail
                        className="h-4 w-4 text-[#A8A29E]"
                    />

                    {claim.user.email}

                </div>


                {claim.user.phone && (

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-[#57534E]
                        "
                    >

                        <Phone
                            className="h-4 w-4 text-[#A8A29E]"
                        />

                        {claim.user.phone}

                    </div>

                )}

            </div>



            {/* Claim message */}

            {claim.message && (

                <div
                    className="
                        mt-5
                        rounded-xl
                        bg-[#FCFAF7]
                        p-4
                        text-sm
                        leading-6
                        text-[#57534E]
                    "
                >
                    {claim.message}
                </div>

            )}



            {/* Actions */}

            {claim.status === "pending" && (

                <div
                    className="
                        mt-6
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-[#EEE9E2]
                        pt-5
                    "
                >

                    <Button
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() =>
                            onReject(claim.id)
                        }
                        className="
                            gap-2
                            rounded-xl
                            border-red-200
                            text-red-600
                            hover:bg-red-50
                        "
                    >

                        <X className="h-4 w-4" />

                        Reject

                    </Button>


                    <Button
                        disabled={isUpdating}
                        onClick={() =>
                            onApprove(claim.id)
                        }
                        className="
                            gap-2
                            rounded-xl
                        "
                    >

                        <Check className="h-4 w-4" />

                        Approve

                    </Button>


                </div>

            )}

        </Card>
    );
}