import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { useAuth } from "@/hooks/useAuth";
import { AiChef } from "@/components/ai-agent/AiChef";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user?.name ?? ""}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <ScrollToTop />
          <Outlet />
          <Footer />
        </main>
      </div>

      <AiChef />
    </div>
  );
}