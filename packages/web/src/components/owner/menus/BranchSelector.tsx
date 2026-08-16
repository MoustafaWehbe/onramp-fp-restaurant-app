import type { Branch } from "@/types/restaurant";

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchSlug: string | null;
  onSelect: (branchSlug: string) => void;
}

export function BranchSelector({
  branches,
  selectedBranchSlug,
  onSelect,
}: BranchSelectorProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {branches.map((branch) => (
        <button
          key={branch.id}
          type="button"
          onClick={() => onSelect(branch.slug)}
          className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
            branch.slug === selectedBranchSlug
              ? "border-[#292524] bg-[#292524] text-white"
              : "border-[#EAE4DC] bg-white text-[#57534E] hover:border-[#D6D3D1]"
          }`}
        >
          {branch.name}
        </button>
      ))}
    </div>
  );
}
