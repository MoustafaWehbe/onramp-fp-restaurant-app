import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { RestaurantClaimCard } from "@/components/admin/RestaurantClaimCard";

import { restaurantClaimsApi } from "@/services/admin/restaurantClaimsApi";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { AlertMessageDialog } from "@/components/shared/AlertMessageDialog";

export function RestaurantClaimsPage() {
  const queryClient = useQueryClient();

  const [updatingClaimIds, setUpdatingClaimIds] = useState<Set<string>>(
    new Set(),
  );

  const [claimAction, setClaimAction] = useState<{
  claimId: string;
  action: "approve" | "reject";
} | null>(null);

const [alertMessage, setAlertMessage] = useState<{
  title: string;
  description: string;
} | null>(null);

const confirmClaimAction = () => {
  if (!claimAction) return;

  updateClaimMutation.mutate(claimAction);

  setClaimAction(null);
};

  const {
    data: claims,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-restaurant-claims"],
    queryFn: restaurantClaimsApi.getAll,
  });

  const updateClaimMutation = useMutation({
    mutationFn: async ({
      claimId,
      action,
    }: {
      claimId: string;
      action: "approve" | "reject";
    }) => {
      if (action === "approve") {
        return restaurantClaimsApi.approveClaim(claimId);
      }

      return restaurantClaimsApi.rejectClaim(claimId);
    },

    onMutate: ({ claimId }) => {
      setUpdatingClaimIds((current) => {
        const next = new Set(current);
        next.add(claimId);
        return next;
      });
    },

    onSuccess: () => {
      setAlertMessage({
        title: "Success",
        description: "Restaurant claim updated successfully.",
      });

      return queryClient.invalidateQueries({
        queryKey: ["admin-restaurant-claims"],
      });
    },

    onError: (error) => {
      setAlertMessage({
        title: "Error",
        description: "Failed to update restaurant claim.",
      });
    },

    onSettled: (_data, _error, { claimId }) => {
      setUpdatingClaimIds((current) => {
        const next = new Set(current);
        next.delete(claimId);
        return next;
      });
    },
  });

  const handleApprove = (claimId: string) => {
    setClaimAction({
      claimId,
      action: "approve",
    })
  };

  const handleReject = (claimId: string) => {
    setClaimAction({
      claimId,
      action: "reject",
    })
  };

  const pendingClaims =
    claims?.filter((claim) => claim.status === "pending") ?? [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2
            className="
              font-serif
              text-2xl
              text-[#292524]
            "
          >
            Something went wrong
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-[#78716C]
            "
          >
            Failed to load restaurant claims.
          </p>
        </div>
      </div>
    );
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

      {pendingClaims.length === 0 && (
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

      {pendingClaims.length > 0 && (
        <div className="grid gap-5">
          {pendingClaims.map((claim) => (
            <RestaurantClaimCard
              key={claim.id}
              claim={claim}
              onApprove={handleApprove}
              onReject={handleReject}
              isUpdating={updatingClaimIds.has(claim.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!claimAction}
        title={
          claimAction?.action === "approve"
            ? "Approve restaurant claim?"
            : "Reject restaurant claim?"
        }
        description={
          claimAction?.action === "approve"
            ? "This will approve the ownership request."
            : "This will reject the ownership request."
        }
        confirmText={
          claimAction?.action === "approve"
            ? "Approve"
            : "Reject"
        }
        variant={
          claimAction?.action === "reject"
            ? "destructive"
            : "default"
        }
        onConfirm={confirmClaimAction}
        onCancel={() => setClaimAction(null)}
      />

      <AlertMessageDialog
        open={!!alertMessage}
        title={alertMessage?.title ?? ""}
        description={alertMessage?.description ?? ""}
        onClose={() => setAlertMessage(null)}
      />
    </div>
  );
}