// src/pages/onwer/OwnerMenusPage.tsx

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Utensils,
  Store,
  Check,
  Pencil,
  X,
  ImageOff,
  Trash2,
} from "lucide-react";

import { ownerMenusApi } from "@/services/owner/menusApi";
import { ownerBranchesApi } from "@/services/owner/branchesApi";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";
import type { Branch } from "@/types/restaurant";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { MenuItem, Menu, BranchMenu, BranchMenuItem } from "@/types/menu";

export function OwnerMenusPage() {
  const { restaurantSlug } = useOutletContext<OwnerOutletContext>();
  const queryClient = useQueryClient();

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedBranchSlug, setSelectedBranchSlug] = useState<string | null>(
    null,
  );
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // ── Menus ────────────────────────────────────────────────
  const {
    data: menus,
    isLoading: menusLoading,
    error: menusError,
  } = useQuery({
    queryKey: ["owner-menus", restaurantSlug],
    queryFn: () => ownerMenusApi.getRestaurantMenus(restaurantSlug!),
    enabled: !!restaurantSlug,
  });

  useEffect(() => {
    if (!selectedMenuId && menus && menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  const selectedMenu = menus?.find((m: Menu) => m.id === selectedMenuId);

  const invalidateMenuQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["owner-menus", restaurantSlug] });
    queryClient.invalidateQueries({
      queryKey: ["owner-branch-menus", restaurantSlug, selectedBranchSlug],
    });
  };

  const createMenuMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      description?: string;
      is_active?: boolean;
    }) => ownerMenusApi.createMenu(restaurantSlug!, payload),
    onSuccess: (newMenu) => {
      invalidateMenuQueries();
      setSelectedMenuId(newMenu.id);
      setShowCreateMenu(false);
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: (vars: {
      menuId: string;
      payload: { name?: string; description?: string | null; is_active?: boolean };
    }) =>
      ownerMenusApi.updateMenu(restaurantSlug!, vars.menuId, vars.payload),
    onSuccess: invalidateMenuQueries,
  });

  const deleteMenuMutation = useMutation({
    mutationFn: (menuId: string) =>
      ownerMenusApi.deleteMenu(restaurantSlug!, menuId),
    onSuccess: () => {
      invalidateMenuQueries();
      setSelectedMenuId(null);
    },
  });

  const addMenuItemMutation = useMutation({
    mutationFn: (formData: FormData) =>
      ownerMenusApi.addMenuItem(restaurantSlug!, selectedMenuId!, formData),
    onSuccess: () => {
      invalidateMenuQueries();
      setShowAddItem(false);
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: (vars: { menuItemId: string; formData: FormData }) =>
      ownerMenusApi.updateMenuItem(
        restaurantSlug!,
        selectedMenuId!,
        vars.menuItemId,
        vars.formData,
      ),
    onSuccess: () => {
      invalidateMenuQueries();
      setEditingItemId(null);
    },
  });

  // ── Branches ─────────────────────────────────────────────
  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["owner-branches", restaurantSlug],
    queryFn: () => ownerBranchesApi.getRestaurantBranches(restaurantSlug!),
    enabled: !!restaurantSlug,
  });

  useEffect(() => {
    if (!selectedBranchSlug && branches && branches.length > 0) {
      setSelectedBranchSlug(branches[0].slug);
    }
  }, [branches, selectedBranchSlug]);

  const { data: branchMenus, isLoading: branchMenusLoading } = useQuery({
    queryKey: ["owner-branch-menus", restaurantSlug, selectedBranchSlug],
    queryFn: () =>
      ownerMenusApi.getBranchMenus(restaurantSlug!, selectedBranchSlug!),
    enabled: !!restaurantSlug && !!selectedBranchSlug,
  });

  const overrideMutation = useMutation({
    mutationFn: (vars: {
      menuItemId: string;
      payload: { customPrice?: number | null; isAvailable?: boolean };
    }) =>
      ownerMenusApi.overrideBranchMenuItem(
        restaurantSlug!,
        selectedBranchSlug!,
        vars.menuItemId,
        vars.payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owner-branch-menus", restaurantSlug, selectedBranchSlug],
      });
    },
  });

  if (!restaurantSlug) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF7]">
            <Utensils className="h-5 w-5 text-[#A8A29E]" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-medium text-[#292524]">
            No restaurant found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
            We couldn't find a restaurant associated with your owner account.
          </p>
        </div>
      </div>
    );
  }

  if (menusLoading) return <LoadingSpinner />;

  if (menusError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF7]">
            <Utensils className="h-5 w-5 text-[#A8A29E]" strokeWidth={1.5} />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-medium text-[#292524]">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-[#78716C]">
            Unable to load your menus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
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
            onClick={() => setShowCreateMenu((v) => !v)}
          >
            <Plus className="h-4 w-4" />
            Create Menu
          </Button>
        </div>

        {showCreateMenu && (
          <CreateMenuForm
            onCancel={() => setShowCreateMenu(false)}
            onSubmit={(payload) => createMenuMutation.mutate(payload)}
            isSubmitting={createMenuMutation.isPending}
          />
        )}
      </header>

      {menus?.length === 0 ? (
        <Card className="rounded-2xl border-[#EAE4DC] bg-white p-10 text-center">
          <Utensils className="mx-auto h-8 w-8 text-[#A8A29E]" />
          <h3 className="mt-4 font-serif text-xl text-[#292524]">
            No menus yet
          </h3>
          <p className="mt-2 text-sm text-[#78716C]">
            Create your first menu to start adding items.
          </p>
        </Card>
      ) : (
        <>
          {/* Menu selector — horizontal scroll */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {menus?.map((menu: Menu) => (
              <button
                key={menu.id}
                onClick={() => setSelectedMenuId(menu.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  menu.id === selectedMenuId
                    ? "border-[#292524] bg-[#292524] text-white"
                    : "border-[#EAE4DC] bg-white text-[#57534E] hover:border-[#D6D3D1]"
                }`}
              >
                {menu.name}
              </button>
            ))}
          </div>

          {/* Selected menu's items */}
          {selectedMenu && (
            <section className="mb-14">
              <div className="mb-5 flex items-start justify-between gap-4">
                <EditableMenuHeader
                  menu={selectedMenu}
                  size="lg"
                  onSave={(payload) =>
                    updateMenuMutation.mutate({
                      menuId: selectedMenu.id,
                      payload,
                    })
                  }
                  onDelete={() => {
                    if (
                      confirm(
                        `Delete "${selectedMenu.name}"? This can't be undone.`,
                      )
                    ) {
                      deleteMenuMutation.mutate(selectedMenu.id);
                    }
                  }}
                  isSaving={updateMenuMutation.isPending}
                  isDeleting={deleteMenuMutation.isPending}
                />
                <Button
                  variant="outline"
                  className="shrink-0 gap-2 rounded-xl border-[#EAE4DC]"
                  onClick={() => setShowAddItem((v) => !v)}
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {showAddItem && (
                <AddMenuItemForm
                  onCancel={() => setShowAddItem(false)}
                  onSubmit={(formData) =>
                    addMenuItemMutation.mutate(formData)
                  }
                  isSubmitting={addMenuItemMutation.isPending}
                />
              )}

              {!selectedMenu.menuItems || selectedMenu.menuItems.length === 0 ? (
                <Card className="rounded-2xl border-[#EAE4DC] bg-white p-8 text-center text-sm text-[#78716C]">
                  No items in this menu yet.
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedMenu.menuItems.map((item: MenuItem) =>
                    editingItemId === item.id ? (
                      <EditMenuItemForm
                        key={item.id}
                        item={item}
                        onCancel={() => setEditingItemId(null)}
                        onSubmit={(formData) =>
                          updateMenuItemMutation.mutate({
                            menuItemId: item.id,
                            formData,
                          })
                        }
                        isSubmitting={updateMenuItemMutation.isPending}
                      />
                    ) : (
                      <Card
                        key={item.id}
                        className="overflow-hidden rounded-2xl border-[#EAE4DC] bg-white"
                      >
                        <MenuItemImage src={item.image_url} alt={item.name} />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-serif text-lg font-medium text-[#292524]">
                              {item.name}
                            </h3>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="text-sm font-semibold text-[#292524]">
                                ${Number(item.base_price).toFixed(2)}
                              </span>
                              <button
                                onClick={() => setEditingItemId(item.id)}
                                className="text-[#A8A29E] hover:text-[#57534E]"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          {item.description && (
                            <p className="mt-1.5 text-sm leading-5 text-[#78716C]">
                              {item.description}
                            </p>
                          )}
                          {item.is_active === false && (
                            <Badge variant="secondary" className="mt-3">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </section>
          )}

          {/* Branches section */}
          <section>
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                Branch Overrides
              </p>
              <h2 className="font-serif text-2xl font-medium text-[#292524]">
                Manage by Branch
              </h2>
              <p className="mt-1 text-sm text-[#78716C]">
                Branches inherit the restaurant's menus. Override price or
                availability per branch below.
              </p>
            </div>

            {branchesLoading ? (
              <LoadingSpinner />
            ) : !branches || branches.length === 0 ? (
              <Card className="rounded-2xl border-[#EAE4DC] bg-white p-8 text-center text-sm text-[#78716C]">
                <Store className="mx-auto mb-3 h-6 w-6 text-[#A8A29E]" />
                No branches yet.
              </Card>
            ) : (
              <>
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {branches.map((branch: Branch) => (
                    <button
                      key={branch.id}
                      onClick={() => setSelectedBranchSlug(branch.slug)}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                        branch.slug === selectedBranchSlug
                          ? "border-[#292524] bg-[#292524] text-white"
                          : "border-[#EAE4DC] bg-white text-[#57534E] hover:border-[#D6D3D1]"
                      }`}
                    >
                      {branch.name}
                    </button>
                  ))}
                </div>

                {branchMenusLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-8">
                    {branchMenus?.map((menu: BranchMenu) => (
                      <div key={menu.id}>
                        <EditableMenuHeader
                          menu={menu}
                          size="sm"
                          onSave={(payload) =>
                            updateMenuMutation.mutate({
                              menuId: menu.id,
                              payload,
                            })
                          }
                          isSaving={updateMenuMutation.isPending}
                        />
                        <div className="mt-3 grid gap-3">
                          {menu.menuItems.map((item) => (
                            <BranchMenuItemRow
                              key={item.id}
                              item={item}
                              onSave={(payload) =>
                                overrideMutation.mutate({
                                  menuItemId: item.id,
                                  payload,
                                })
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function MenuItemImage({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-[#FCFAF7]">
        <ImageOff className="h-6 w-6 text-[#D6D3D1]" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className="aspect-[4/3] overflow-hidden bg-[#FCFAF7]">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function EditableMenuHeader({
  menu,
  size,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: {
  menu: Menu;
  size: "lg" | "sm";
  onSave: (payload: {
    name?: string;
    description?: string | null;
    is_active?: boolean;
  }) => void;
  onDelete?: () => void;
  isSaving: boolean;
  isDeleting?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(menu.name);
  const [description, setDescription] = useState(menu.description ?? "");
  const [isActive, setIsActive] = useState(menu.is_active ?? true);

  useEffect(() => {
    setName(menu.name);
    setDescription(menu.description ?? "");
    setIsActive(menu.is_active ?? true);
  }, [menu.name, menu.description, menu.is_active]);

  const save = () => {
    onSave({
      name: name.trim() || undefined,
      description: description.trim() || null,
      is_active: isActive,
    });
    setEditing(false);
  };

  const titleClass =
    size === "lg"
      ? "font-serif text-2xl font-medium text-[#292524]"
      : "font-serif text-lg font-medium text-[#292524]";

  if (editing) {
    return (
      <div className="w-full rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 rounded-lg"
            placeholder="Menu name"
            autoFocus
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="h-9 rounded-lg"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Active</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex gap-1.5">
            {onDelete && (
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-lg border-[#EAE4DC] text-red-600 hover:bg-red-50"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-lg border-[#EAE4DC]"
              onClick={() => setEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={save}
              disabled={isSaving}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setEditing(true)}
        className="group flex items-center gap-2 text-left"
      >
        <h3 className={titleClass}>{menu.name}</h3>
        <Pencil className="h-3.5 w-3.5 text-[#A8A29E] opacity-0 transition-opacity group-hover:opacity-100" />
        {menu.is_active === false && (
          <Badge variant="secondary">Inactive</Badge>
        )}
      </button>
      {menu.description && (
        <p className="mt-1 text-sm text-[#78716C]">{menu.description}</p>
      )}
    </div>
  );
}

function CreateMenuForm({
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  onCancel: () => void;
  onSubmit: (payload: { name: string; description?: string }) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Card className="mt-4 rounded-2xl border-[#EAE4DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-[#292524]">
          New menu
        </h3>
        <button onClick={onCancel} className="text-[#A8A29E] hover:text-[#57534E]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <Input
          placeholder="Menu name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg"
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" className="rounded-lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="rounded-lg"
          disabled={!name.trim() || isSubmitting}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              description: description.trim() || undefined,
            })
          }
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </Card>
  );
}

function AddMenuItemForm({
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name.trim());
    if (description.trim()) formData.append("description", description.trim());
    formData.append("base_price", basePrice);
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <Card className="mb-5 rounded-2xl border-[#EAE4DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-[#292524]">
          New item
        </h3>
        <button onClick={onCancel} className="text-[#A8A29E] hover:text-[#57534E]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Base price"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="rounded-lg"
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg sm:col-span-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="text-sm text-[#78716C] sm:col-span-2"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" className="rounded-lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="rounded-lg"
          disabled={!name.trim() || !basePrice.trim() || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Adding..." : "Add item"}
        </Button>
      </div>
    </Card>
  );
}

function EditMenuItemForm({
  item,
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  item: MenuItem;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [basePrice, setBasePrice] = useState(item.base_price.toString());
  const [isActive, setIsActive] = useState(item.is_active ?? true);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("base_price", basePrice);
    formData.append("is_active", String(isActive));
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base font-medium text-[#292524]">
          Edit item
        </h3>
        <button onClick={onCancel} className="text-[#A8A29E] hover:text-[#57534E]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid gap-2.5">
        <Input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 rounded-lg"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Base price"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="h-9 rounded-lg"
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-9 rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="text-xs text-[#78716C]"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Active</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-lg"
              disabled={!name.trim() || !basePrice.trim() || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BranchMenuItemRow({
  item,
  onSave,
}: {
  item: BranchMenuItem;
  onSave: (payload: {
    customPrice?: number | null;
    isAvailable?: boolean;
  }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [priceInput, setPriceInput] = useState(
    Number(item.customPrice ?? item.base_price).toString(),
  );

  const isOverridden =
    item.customPrice !== undefined && item.customPrice !== null;
  const isAvailable = item.isAvailable ?? true;

  const savePrice = () => {
    const value = parseFloat(priceInput);
    if (!Number.isNaN(value)) {
      onSave({ customPrice: value });
    }
    setEditing(false);
  };

  return (
    <Card className="flex items-center gap-4 rounded-2xl border-[#EAE4DC] bg-white p-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FCFAF7]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-4 w-4 text-[#D6D3D1]" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-[#292524]">{item.name}</p>
          {isOverridden && (
            <Badge variant="secondary" className="shrink-0">
              Overridden
            </Badge>
          )}
        </div>
        <p className="text-xs text-[#A8A29E]">
          Base price: ${Number(item.base_price).toFixed(2)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="h-9 w-24 rounded-lg"
              autoFocus
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={savePrice}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#292524] hover:text-[#57534E]"
          >
            ${Number(item.customPrice ?? item.base_price).toFixed(2)}
            <Pencil className="h-3.5 w-3.5 text-[#A8A29E]" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78716C]">Available</span>
          <Switch
            checked={isAvailable}
            onCheckedChange={(checked) => onSave({ isAvailable: checked })}
          />
        </div>
      </div>
    </Card>
  );
}