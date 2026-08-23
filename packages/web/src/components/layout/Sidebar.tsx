import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogIn, LogOut, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userName: string;
}

const links = [
  {
    label: "Home",
    path: "/home",
    icon: Home,
  },
];

export function Sidebar({
  open,
  onClose,
  userName,
}: SidebarProps) {
  const navigate = useNavigate();

  const isAuthenticated = Boolean(userName);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      navigate("/login");
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    const target =
      window.location.pathname + window.location.search;

    navigate(`/login?redirect=${encodeURIComponent(target)}`);
    onClose();
  };

  return (
    <aside
      aria-hidden={!open}
      {...({ inert: !open } as React.HTMLAttributes<HTMLElement>)}
      tabIndex={open ? 0 : -1}
      className={`
        fixed left-0 top-0 z-50 flex h-full w-64 flex-col
        border-r bg-background
        transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Close button */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col gap-2 px-4">
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
                ${
                  isActive
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

      {/* Bottom section */}
      <div className="mt-auto border-t p-4">
        {isAuthenticated ? (
          <>
            {/* User account */}
            <div className="mb-3 rounded-xl border bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                {/* Initial */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {userName}
                  </p>

                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Account
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3 rounded-md
                px-3 py-2 text-sm
                transition-colors
                hover:bg-red-50 hover:text-red-600
              "
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </>
        ) : (
          /* Login */
          <button
            type="button"
            onClick={handleLogin}
            className="
              flex w-full items-center gap-3 rounded-md
              px-3 py-2 text-sm
              font-medium
              text-foreground
              transition-colors
              hover:bg-primary/10
              hover:text-primary
            "
          >
            <LogIn className="h-5 w-5" />
            Sign in
          </button>
        )}
      </div>
    </aside>
  );
}