import { Check, X, Mail, Phone, User, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RestaurantClaim {
  id: string;

  restaurantName: string;

  email: string;

  phone: string | null;

  status: "pending" | "approved" | "rejected" | "completed";

  user: {
    id: string;
    name: string;
    email: string;
  };

  createdAt: string;
}

interface RestaurantClaimCardProps {
  claim: RestaurantClaim;

  onApprove: (claimId: string) => void;

  onReject: (claimId: string) => void;

  isUpdating: boolean;
}

export function RestaurantClaimCard({
  claim,
  onApprove,
  onReject,
  isUpdating,
}: RestaurantClaimCardProps) {
  return (
    <Card
      className="
                rounded-2xl
                border-[#EAE4DC]
                bg-white
                p-6
            "
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Store
              className="
                                h-5
                                w-5
                                text-[#A8A29E]
                            "
            />

            <h2
              className="
                                font-serif
                                text-2xl
                                text-[#292524]
                            "
            >
              {claim.restaurantName}
            </h2>
          </div>

          <p
            className="
                            mt-3
                            text-sm
                            text-[#78716C]
                        "
          >
            Submitted by: {claim.user.name}
          </p>
        </div>

        <div
          className="
                        grid
                        gap-3
                        text-sm
                        text-[#78716C]
                    "
        >
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />

            {claim.user.email}
          </div>

          {claim.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />

              {claim.phone}
            </div>
          )}
        </div>

        <div
          className="
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
            onClick={() => onReject(claim.id)}
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>

          <Button disabled={isUpdating} onClick={() => onApprove(claim.id)}>
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </Card>
  );
}
