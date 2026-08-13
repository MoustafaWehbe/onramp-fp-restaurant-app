import {
    BarChart3,
    Building2,
    LayoutDashboard,
    LogOut,
    Menu,
    Store,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

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

interface OwnerSidebarProps {
    userName: string;
}

export function OwnerSidebar({
    userName,
}: OwnerSidebarProps) {
    const handleLogout = async () => {
        try {
            await apiClient.post("/auth/logout");

            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[400px] flex-col border-r border-[#EAE4DC] bg-white">
            {/* ===================================================== */}
            {/* Logo                                                   */}
            {/* ===================================================== */}

            <div className="px-6 pb-8 pt-7">
                <div className="flex items-center gap-3">
                    {/* Logo mark */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-serif text-xl font-bold text-primary-foreground shadow-sm">
                        P
                    </div>

                    {/* Brand */}
                    <div>
                        <h1 className="font-serif text-xl font-semibold tracking-tight text-[#292524]">
                            Platera
                        </h1>

                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#A8A29E]">
                            Owner Dashboard
                        </p>
                    </div>
                </div>
            </div>

            {/* ===================================================== */}
            {/* Navigation                                             */}
            {/* ===================================================== */}

            <nav className="flex-1 overflow-y-auto px-4">
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

            {/* ===================================================== */}
            {/* Bottom Section                                         */}
            {/* ===================================================== */}

            <div className="border-t border-[#EEE9E2] px-4 pb-5 pt-4">
                {/* Profile */}

                <div className="mb-3 rounded-2xl border border-[#EEE9E2] bg-[#FCFAF7] p-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground shadow-sm">
                            {userName
                                ? userName.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        {/* Name */}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#292524]">
                                {userName || "Owner"}
                            </p>

                            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#A8A29E]">
                                Restaurant Owner
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logout */}

                <SidebarBottomLink
                    icon={LogOut}
                    label="Logout"
                    onClick={handleLogout}
                />
            </div>
        </aside>
    );
}

/* ========================================================= */
/* Navigation Group                                          */
/* ========================================================= */

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
        <div className="mb-7">
            {/* Group title */}

            <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                {title}
            </p>

            {/* Items */}

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
                                    // Base
                                    "group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all duration-200",

                                    // Active / inactive
                                    isActive
                                        ? "bg-primary/10 font-semibold text-primary"
                                        : "text-[#78716C] hover:bg-[#F7F4F0] hover:text-[#292524]",
                                ].join(" ")
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Icon */}

                                    <div
                                        className={[
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10"
                                                : "bg-transparent group-hover:bg-white",
                                        ].join(" ")}
                                    >
                                        <Icon
                                            className={[
                                                "h-[17px] w-[17px] transition-colors duration-200",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-[#A8A29E] group-hover:text-[#57534E]",
                                            ].join(" ")}
                                            strokeWidth={1.7}
                                        />
                                    </div>

                                    {/* Label */}

                                    <span className="truncate">
                                        {item.label}
                                    </span>

                                    {/* Active indicator */}

                                    {isActive && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}

/* ========================================================= */
/* Bottom Link                                                */
/* ========================================================= */

function SidebarBottomLink({
    icon: Icon,
    label,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#78716C] transition-all duration-200 hover:bg-[#F7F4F0] hover:text-[#292524]"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors group-hover:bg-white">
                <Icon
                    className="h-[17px] w-[17px] text-[#A8A29E] transition-colors group-hover:text-[#57534E]"
                    strokeWidth={1.7}
                />
            </div>

            <span>{label}</span>
        </button>
    );
}