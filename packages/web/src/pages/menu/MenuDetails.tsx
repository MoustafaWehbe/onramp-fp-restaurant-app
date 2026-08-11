import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Menu {
    id: string;
    name: string;
}

interface MenuItem {
    id: string;
    menuId: string;
    name: string;
    description: string | null;
    base_price: number;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
}

interface MenuDetails extends Menu {
    description: string | null;
    menuItems: MenuItem[];
}

interface Branch {
    name: string;
    restaurant: {
        name: string;
    };
    menus: Menu[];
}

interface BranchResponse {
    branch: Branch;
}

const MenuDetailsPage = () => {
    const { restaurantSlug, branchSlug, menuId } = useParams();
    const navigate = useNavigate();

    const [branch, setBranch] = useState<Branch | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] =
        useState<MenuDetails | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSwitchingMenu, setIsSwitchingMenu] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [failedImageIds, setFailedImageIds] = useState<Set<string>>(
        new Set()
    );
    /*
     * Fetch branch information and all available menus.
     */
    useEffect(() => {
        const fetchBranch = async () => {
            if (!restaurantSlug || !branchSlug) {
                return;
            }

            try {
                setHasError(false);

                const response = await apiClient.get(
                    `/restaurants/${restaurantSlug}/branches/${branchSlug}`
                );

                const branchData: BranchResponse =
                    response.data.data;

                setBranch(branchData.branch);
                setMenus(branchData.branch.menus);
            } catch (error) {
                console.error("Failed to load branch menus", error);
                setHasError(true);
            }
        };

        fetchBranch();
    }, [restaurantSlug, branchSlug]);

    /*
     * Fetch the currently selected menu and its items.
     */
    useEffect(() => {
        const fetchMenu = async () => {
            if (!branchSlug || !menuId) {
                return;
            }

            try {
                setIsLoading(true);
                setHasError(false);

                const response = await apiClient.get(
                    `/branches/${branchSlug}/menus/${menuId}`
                );

                setSelectedMenu(response.data.data);
            } catch (error) {
                console.error("Failed to load menu", error);
                setSelectedMenu(null);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [branchSlug, menuId]);

    /*
     * Switch between menus without leaving the page.
     */
    const handleMenuChange = async (newMenuId: string) => {
        if (
            newMenuId === selectedMenu?.id ||
            !branchSlug
        ) {
            return;
        }

        try {
            setIsSwitchingMenu(true);

            const response = await apiClient.get(
                `/branches/${branchSlug}/menus/${newMenuId}`
            );

            setSelectedMenu(response.data.data);

            navigate(
                `/restaurants/${restaurantSlug}/branches/${branchSlug}/menus/${newMenuId}`
            );
        } catch (error) {
            console.error("Failed to switch menu", error);
        } finally {
            setIsSwitchingMenu(false);
        }
    };

    if (isLoading && !selectedMenu) {
        return <LoadingSpinner />;
    }

    if (hasError && !selectedMenu) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-destructive">
                    Failed to load menu.
                </p>
            </div>
        );
    }

    if (!branch) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">
                    Branch not found.
                </p>
            </div>
        );
    }

    if (!selectedMenu) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">
                    Menu not found.
                </p>
            </div>
        );
    }

    const menuItems = [...selectedMenu.menuItems].sort(
        (a, b) => a.display_order - b.display_order
    );

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Restaurant and Branch Header */}
            <header className="mb-10 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                    {restaurantSlug?.replace(/-/g, " ")}
                </p>

                <h1 className="mt-2 text-2xl font-bold">
                    {branch.name}
                </h1>

                <div className="mx-auto mt-6 h-px w-16 bg-primary" />
            </header>

            {/* Menu Switcher */}
            {menus.length > 0 && (
                <nav className="mb-12 flex flex-wrap justify-center gap-3">
                    {menus.map((menu) => {
                        const isSelected =
                            menu.id === selectedMenu.id;

                        return (
                            <button
                                key={menu.id}
                                type="button"
                                disabled={isSwitchingMenu}
                                onClick={() =>
                                    handleMenuChange(menu.id)
                                }
                                className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                    } ${isSwitchingMenu
                                        ? "cursor-wait opacity-70"
                                        : ""
                                    }`}
                            >
                                {menu.name}
                            </button>
                        );
                    })}
                </nav>
            )}

            {/* Current Menu Header */}
            <header className="mb-12 text-center">
                <div className="mx-auto mb-5 h-px w-16 bg-primary" />

                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {selectedMenu.name}
                </h2>

                {selectedMenu.description && (
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                        {selectedMenu.description}
                    </p>
                )}

                <div className="mx-auto mt-6 h-px max-w-3xl bg-border" />
            </header>

            {/* Menu Items */}
            {menuItems.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => {
                        const isAvailable = item.is_active;

                        return (
                            <article
                                key={item.id}
                                className={`overflow-hidden rounded-2xl border bg-background transition ${!isAvailable
                                    ? "opacity-60"
                                    : ""
                                    }`}
                            >
                                {item.image_url && !failedImageIds.has(item.id) ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        onError={() => {
                                            setFailedImageIds((current) => {
                                                const next = new Set(current);
                                                next.add(item.id);
                                                return next;
                                            });
                                        }}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-muted">
                                        <span className="text-sm text-muted-foreground">
                                            No image
                                        </span>
                                    </div>
                                )}

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-semibold">
                                            {item.name}
                                        </h3>

                                        <span className="shrink-0 font-semibold">
                                            $
                                            {Number(
                                                item.base_price
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {item.description}
                                        </p>
                                    )}

                                    {!isAvailable && (
                                        <div className="mt-4">
                                            <span className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                                Not available now
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <h3 className="text-lg font-semibold">
                        No items available
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        This menu does not have any items yet.
                    </p>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-12 border-t pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Prices and availability may vary.
                </p>
            </footer>
        </div>
    );
};

export default MenuDetailsPage;
