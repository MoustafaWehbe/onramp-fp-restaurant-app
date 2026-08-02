import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, Settings } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      aria-hidden={!open}
      tabIndex={open ? 0 : -1}
      className={`
    fixed left-0 top-0 z-50 h-full w-64 bg-background border-r
    transition-transform
    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
    >
      <button
        onClick={onClose}
        className="p-4"
      >
        Close
      </button>

      <nav className="mt-6 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-md px-3 py-2 text-sm
                ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                }
                `
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}