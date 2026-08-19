import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { RestaurantClaimCard } from "@/components/admin/RestaurantClaimCard";

import { restaurantClaimsApi } from "@/services/admin/restaurantClaimsApi";

export function RestaurantClaimsPage() {
  const queryClient = useQueryClient();

  const { data: claims, isLoading } = useQuery({
    queryKey: ["admin-restaurant-claims"],

    queryFn: restaurantClaimsApi.getAll,
  });

  const updateClaimMutation = useMutation({
    mutationFn: ({
      claimId,
      action,
    }: {
      claimId: string;
      action: "approve" | "reject";
    }) => {
      switch (action) {
        case "approve":
          return restaurantClaimsApi.approveClaim(claimId);

        case "reject":
          return restaurantClaimsApi.rejectClaim(claimId);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-restaurant-claims"],
      });
    },
  });

  const handleApprove = (claimId: string) => {
    updateClaimMutation.mutate({
      claimId,

      action: "approve",
    });
  };

  const handleReject = (claimId: string) => {
    updateClaimMutation.mutate({
      claimId,

      action: "reject",
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      <header className="mb-10">
        <p
          className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.28em]
                        text-[#A8A29E]
                    "
        >
          Admin
        </p>

        <h1
          className="
                        mt-3
                        font-serif
                        text-4xl
                        font-medium
                        tracking-[-0.04em]
                        text-[#292524]
                    "
        >
          Restaurant Claims
        </h1>

        <p
          className="
                        mt-3
                        text-sm
                        text-[#78716C]
                    "
        >
          Review ownership requests submitted by users.
        </p>
      </header>

      {claims?.length === 0 && (
        <div
          className="
                        rounded-2xl
                        border
                        border-[#EAE4DC]
                        bg-white
                        p-8
                        text-center
                        text-sm
                        text-[#78716C]
                    "
        >
          No pending restaurant claims.
        </div>
      )}

      <div className="grid gap-5">
        {claims?.map((claim) => (
          <RestaurantClaimCard
            key={claim.id}

            claim={claim}

            onApprove={handleApprove}

            onReject={handleReject}

            isUpdating={updateClaimMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
