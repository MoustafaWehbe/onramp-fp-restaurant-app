import {
  BarChart3,
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Store,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const mainNavigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/owner",
    end: true,
  },
];

const managementNavigation = [
  {
    label: "Restaurants",
    icon: Store,
    path: "/owner/restaurants",
  },
  {
    label: "Branches",
    icon: Building2,
    path: "/owner/branches",
  },
  {
    label: "Menus",
    icon: Menu,
    path: "/owner/menus",
  },
];

const analyticsNavigation = [
  {
    label: "Statistics",
    icon: BarChart3,
    path: "/owner/statistics",
  },
];

export function OwnerSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[400px] flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="px-7 pb-9 pt-7">
        <div className="flex items-center gap-3">
          {/* Platera Logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-serif text-xl font-bold text-primary-foreground shadow-sm">
            P
          </div>

          <div>
            <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground">
              Platera
            </h1>

            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Owner Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5">
        <NavigationGroup
          title="Main"
          items={mainNavigation}
        />

        <NavigationGroup
          title="Management"
          items={managementNavigation}
        />

        <NavigationGroup
          title="Analytics"
          items={analyticsNavigation}
        />
      </nav>

      {/* Bottom section */}
      <div className="px-5 pb-6">
        {/* Profile */}
        <div className="mb-4 rounded-2xl bg-muted/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground">
              F
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                Fatima
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Bella Italia
              </p>
            </div>
          </div>
        </div>

        {/* Settings / Logout */}
        <div className="space-y-1">

          <SidebarBottomLink
            icon={LogOut}
            label="Logout"
          />
        </div>
      </div>
    </aside>
  );
}

function NavigationGroup({
  title,
  items,
}: {
  title: string;
  items: {
    label: string;
    icon: React.ElementType;
    path: string;
    end?: boolean;
  }[];
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>

      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={
                      isActive
                        ? "h-[18px] w-[18px] text-primary"
                        : "h-[18px] w-[18px] text-muted-foreground transition-colors group-hover:text-foreground"
                    }
                    strokeWidth={1.8}
                  />

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

function SidebarBottomLink({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      <Icon
        className="h-[17px] w-[17px]"
        strokeWidth={1.8}
      />

      <span>{label}</span>
    </button>
  );
}