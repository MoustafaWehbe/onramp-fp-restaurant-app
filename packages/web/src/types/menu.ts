export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  base_price: number;
  display_order?: number;
  is_active?: boolean;
  image_url?: string | null;
}

export interface Menu {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  menuItems?: MenuItem[];
}


export interface BranchMenuItem extends MenuItem {
  customPrice?: number | null;
  isAvailable?: boolean | null;
}

export interface BranchMenu extends Menu {
  menuItems: BranchMenuItem[];
}