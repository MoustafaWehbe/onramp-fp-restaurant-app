import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Store, FileCheck } from "lucide-react";

export function AdminLayout() {
  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Restaurant Claims",
      path: "/admin/restaurant-claims",
      icon: FileCheck,
    },
    {
      label: "Restaurants",
      path: "/admin/restaurants",
      icon: Store,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FCFAF7]">
      {/* Sidebar */}

      <aside className="w-64 border-r border-[#EAE4DC] bg-white p-6">
        <h1 className="mb-8 font-serif text-2xl font-semibold text-[#292524]">
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
                                    ${
                                      isActive ? "bg-[#FCFAF7] text-[#292524]" : "text-[#78716C]"
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
      </aside>

      {/* Content */}

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
