import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Utensils } from "lucide-react";

import {
    AddMenuItemForm,
    BranchMenuSection,
    CreateMenuForm,
    MenuHeader,
    MenuItemsGrid,
    MenuSelector,
} from "@/components/owner/menus";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBranchMenus } from "@/hooks/owner/useBranchMenus";
import { useOwnerMenus } from "@/hooks/owner/useOwnerMenus";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";
import type { Menu } from "@/types/menu";

export function OwnerMenusPage() {
    const { restaurantSlug } = useOutletContext<OwnerOutletContext>();

    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const [selectedBranchSlug, setSelectedBranchSlug] = useState<string | null>(
        null,
    );
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [menuPendingDeletion, setMenuPendingDeletion] = useState<Menu | null>(
        null,
    );

    const {
        data: menus,
        isLoading: menusLoading,
        error: menusError,
        createMenuMutation,
        updateMenuMutation,
        deleteMenuMutation,
        addMenuItemMutation,
        updateMenuItemMutation,
    } = useOwnerMenus(restaurantSlug, {
        selectedBranchSlug,
        onMenuCreated: (menu) => {
            setSelectedMenuId(menu.id);
            setShowCreateMenu(false);
        },
        onMenuDeleted: () => {
            setSelectedMenuId(null);
            setMenuPendingDeletion(null);
        },
        onMenuItemAdded: () => setShowAddItem(false),
        onMenuItemUpdated: () => setEditingItemId(null),
    });

    const { branchesQuery, branchMenusQuery, overrideMutation } = useBranchMenus(
        restaurantSlug,
        selectedBranchSlug,
    );

    useEffect(() => {
        if (!menus?.length) return;

        const selectedMenuExists = menus.some(
            (menu) => menu.id === selectedMenuId,
        );

        if (!selectedMenuExists && selectedMenuId !== menus[0].id) {
            setSelectedMenuId(menus[0].id);
        }
    }, [menus, selectedMenuId]);

    useEffect(() => {
        const branches = branchesQuery.data;

        if (!branches?.length) {
            setSelectedBranchSlug(null);
            return;
        }

        const selectedBranchExists = branches.some(
            (branch) => branch.slug === selectedBranchSlug,
        );

        if (!selectedBranchExists) {
            setSelectedBranchSlug(branches[0].slug);
        }
    }, [branchesQuery.data, selectedBranchSlug]);

    useEffect(() => {
        setShowAddItem(false);
        setEditingItemId(null);
    }, [selectedMenuId]);

    const selectedMenu = menus?.find((menu) => menu.id === selectedMenuId);

    if (!restaurantSlug)
        return (
            <EmptyState
                title="No restaurant found"
                description="We couldn't find a restaurant associated with your owner account."
            />
        );

    if (menusLoading) return <LoadingSpinner />;

    if (menusError)
        return (
            <EmptyState
                title="Something went wrong"
                description="Unable to load your menus."
            />
        );

    return (
        <div className="w-full">
            <header className="mb-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                            Menus Management
                        </p>

                        <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
                            Menus
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C]">
                            Manage your restaurant menus and menu items across branches.
                        </p>
                    </div>

                    <Button
                        className="w-fit gap-2 rounded-xl"
                        onClick={() => setShowCreateMenu((visible) => !visible)}
                    >
                        <Plus className="h-4 w-4" />
                        Create Menu
                    </Button>
                </div>

                {showCreateMenu && (
                    <CreateMenuForm
                        onCancel={() => setShowCreateMenu(false)}
                        onSubmit={(payload) =>
                            createMenuMutation.mutate(payload)
                        }
                        isSubmitting={createMenuMutation.isPending}
                    />
                )}
            </header>

            {menus?.length === 0 ? (
                <NoMenusState />
            ) : (
                <>
                    <MenuSelector
                        menus={menus ?? []}
                        selectedMenuId={selectedMenuId}
                        onSelect={setSelectedMenuId}
                    />

                    {selectedMenu && (
                        <section className="mb-14">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <MenuHeader
                                    menu={selectedMenu}
                                    size="lg"
                                    onSave={(payload) =>
                                        updateMenuMutation.mutate({
                                            menuId: selectedMenu.id,
                                            payload,
                                        })
                                    }
                                    onDelete={() =>
                                        setMenuPendingDeletion(selectedMenu)
                                    }
                                    isSaving={updateMenuMutation.isPending}
                                    isDeleting={
                                        deleteMenuMutation.isPending
                                    }
                                />

                                <Button
                                    variant="outline"
                                    className="shrink-0 gap-2 rounded-xl border-[#EAE4DC]"
                                    onClick={() =>
                                        setShowAddItem((visible) => !visible)
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>

                            {showAddItem && (
                                <AddMenuItemForm
                                    onCancel={() => setShowAddItem(false)}
                                    onSubmit={(formData) =>
                                        addMenuItemMutation.mutate({
                                            menuId: selectedMenu.id,
                                            formData,
                                        })
                                    }
                                    isSubmitting={
                                        addMenuItemMutation.isPending
                                    }
                                />
                            )}

                            <MenuItemsGrid
                                items={selectedMenu.menuItems}
                                editingItemId={editingItemId}
                                onEdit={setEditingItemId}
                                onCancelEdit={() =>
                                    setEditingItemId(null)
                                }
                                onSubmitEdit={(menuItemId, formData) =>
                                    updateMenuItemMutation.mutate({
                                        menuId: selectedMenu.id,
                                        menuItemId,
                                        formData,
                                    })
                                }
                                isSubmitting={
                                    updateMenuItemMutation.isPending
                                }
                            />
                        </section>
                    )}

                    <BranchMenuSection
                        branches={branchesQuery.data}
                        selectedBranchSlug={selectedBranchSlug}
                        onSelectBranch={setSelectedBranchSlug}
                        isLoadingBranches={branchesQuery.isLoading}
                        branchMenus={branchMenusQuery.data}
                        isLoadingMenus={branchMenusQuery.isLoading}
                        onOverrideItem={(menuItemId, payload) =>
                            overrideMutation.mutate({
                                menuItemId,
                                payload,
                            })
                        }
                    />
                </>
            )}

            <ConfirmDialog
                open={Boolean(menuPendingDeletion)}
                title="Delete this menu?"
                description={
                    menuPendingDeletion
                        ? `“${menuPendingDeletion.name}” and all of its items will be permanently deleted.`
                        : undefined
                }
                onCancel={() => setMenuPendingDeletion(null)}
                onConfirm={() =>
                    menuPendingDeletion &&
                    deleteMenuMutation.mutate(menuPendingDeletion.id)
                }
            />
        </div>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF7]">
                    <Utensils
                        className="h-5 w-5 text-[#A8A29E]"
                        strokeWidth={1.5}
                    />
                </div>

                <h2 className="mt-5 font-serif text-2xl font-medium text-[#292524]">
                    {title}
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
                    {description}
                </p>
            </div>
        </div>
    );
}

function NoMenusState() {
    return (
        <Card className="rounded-2xl border-[#EAE4DC] bg-white p-10 text-center">
            <Utensils className="mx-auto h-8 w-8 text-[#A8A29E]" />

            <h3 className="mt-4 font-serif text-xl text-[#292524]">
                No menus yet
            </h3>

            <p className="mt-2 text-sm text-[#78716C]">
                Create your first menu to start adding items.
            </p>
        </Card>
    );
}