import { Outlet } from "react-router-dom";

import { OwnerSidebar } from "@/components/shared/OwnerSideBar";

export function OwnerLayout() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#292524]">
      <OwnerSidebar />
        <main className="min-h-[calc(100vh-72px)] p-8">
          <Outlet />
        </main>
      </div>
  );
}