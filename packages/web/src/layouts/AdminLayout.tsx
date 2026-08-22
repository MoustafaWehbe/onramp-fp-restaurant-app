import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FileCheck, LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    {
      label: "Restaurant Claims",
      path: "/admin/restaurant-claims",
      icon: FileCheck,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFAF7]">
      <aside
        className="
                    flex
                    w-64
                    flex-col
                    border-r
                    border-[#EAE4DC]
                    bg-white
                    p-6
                "
      >
        <h1
          className="
                        mb-8
                        font-serif
                        text-2xl
                        font-semibold
                        text-[#292524]
                    "
        >
          Admin
        </h1>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
                                    flex items-center gap-3
                                    rounded-xl
                                    px-4 py-3
                                    text-sm
                                    transition
                                    ${
                                      isActive
                                        ? "bg-[#FCFAF7] text-[#292524]"
                                        : "text-[#78716C] hover:bg-[#FCFAF7]"
                                    }
                                    `
                }
              >
                <Icon className="h-4 w-4" />

                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
                        mt-auto
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        text-[#78716C]
                        transition
                        hover:bg-[#FCFAF7]
                        hover:text-[#292524]
                    "
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
