import { Store } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/ui/card";
import type { BranchMenu, BranchMenuItemOverridePayload } from "@/types/menu";
import type { Branch } from "@/types/restaurant";

import { BranchMenuItemRow } from "./BranchMenuItemRow";
import { BranchSelector } from "./BranchSelector";

interface BranchMenuSectionProps {
  branches?: Branch[];
  selectedBranchSlug: string | null;
  onSelectBranch: (slug: string) => void;
  isLoadingBranches: boolean;
  branchMenus?: BranchMenu[];
  isLoadingMenus: boolean;
  onOverrideItem: (
    menuItemId: string,
    payload: BranchMenuItemOverridePayload,
  ) => void;
}

export function BranchMenuSection({
  branches,
  selectedBranchSlug,
  onSelectBranch,
  isLoadingBranches,
  branchMenus,
  isLoadingMenus,
  onOverrideItem,
}: BranchMenuSectionProps) {
  return (
    <section>
      <div className="mb-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
          Branch Overrides
        </p>
        <h2 className="font-serif text-2xl font-medium text-[#292524]">
          Manage by Branch
        </h2>
        <p className="mt-1 text-sm text-[#78716C]">
          Branches inherit the restaurant&apos;s menus. Override an item&apos;s
          price or availability for this branch.
        </p>
      </div>

      {isLoadingBranches ? (
        <LoadingSpinner />
      ) : !branches?.length ? (
        <Card className="rounded-2xl border-[#EAE4DC] bg-white p-8 text-center text-sm text-[#78716C]">
          <Store className="mx-auto mb-3 h-6 w-6 text-[#A8A29E]" />
          No branches yet.
        </Card>
      ) : (
        <>
          <BranchSelector
            branches={branches}
            selectedBranchSlug={selectedBranchSlug}
            onSelect={onSelectBranch}
          />

          {isLoadingMenus ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-8">
              {branchMenus?.map((menu) => (
                <div key={menu.id}>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#292524]">
                      {menu.name}
                    </h3>
                    {menu.description && (
                      <p className="mt-1 text-sm text-[#78716C]">
                        {menu.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3">
                    {menu.menuItems.map((item) => (
                      <BranchMenuItemRow
                        key={item.id}
                        item={item}
                        onSave={(payload) => onOverrideItem(item.id, payload)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
