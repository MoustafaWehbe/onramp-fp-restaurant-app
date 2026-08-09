# Restaurant Discovery Platform — ERD

This document describes the core database schema and relationships for the Restaurant Discovery Platform.

---

## 1. Tables Overview

### Users

Represents system users (diners, restaurant owners, admins).

* id (PK)
* name
* email
* password
* role (enum)
* created_at
* updated_at

---

### Restaurants

Represents restaurant brands or chains.

* id (PK)
* owner_id (FK → Users, nullable)
* name
* description
* cuisine_type
* price_range
* email
* phone
* ambiance_tags (JSON)

  * Possible values:

    * quiet
    * family
    * romantic
    * outdoor
    * loud

* review_count
* average_rating
* verified_at (Date)
* created_at
* updated_at

**Note:**
`ambiance_tags` allows users to filter restaurants based on atmosphere preferences in the future.

Example:

```json
["family", "outdoor"]
```

---

### Branches

Physical locations of restaurants.

* id (PK)
* restaurant_id (FK)
* name
* address
* city
* latitude
* longitude
* phone
* opening_hours
* review_count
* average_rating
* created_at
* updated_at

---

### Reviews

Customer reviews for branches.

* id (PK)
* branch_id (FK)
* user_id (FK)
* rating (tinyint)
* comment
* created_at
* updated_at

---

### Images

Images associated with branches.

* id (PK)
* branch_id (FK)
* url
* type (enum: exterior, interior, menu, other)
* created_at
* updated_at

---

### Menus

Represents menus managed by restaurants.

* id (PK)
* restaurant_id (FK)
* name
* description
* is_active (boolean)
* created_at
* updated_at

**Example:**

* Main Menu
* Breakfast Menu
* Seasonal Menu

---

### Menu Items

Items inside a restaurant menu.

* id (PK)
* menu_id (FK)
* name
* description
* category
* price
* image_url
* available (boolean)
* created_at
* updated_at

**Example categories:**

* Appetizers
* Main Course
* Desserts
* Drinks

---

### Restaurant Claims (Pivot)

Represents ownership/claim requests between users and restaurants.

* user_id (FK)
* restaurant_id (FK)
* status (enum: pending, approved, rejected)
* claimed_at
* reviewed_by (FK → Users)
* reviewed_at

**Primary Key:** (user_id, restaurant_id)

---

### Admin Logs

Logs admin actions in the system.

* id (PK)
* user_id (FK)
* action
* target_type
* target_id
* created_at

---

### Favorites

Restaurants saved by users.

* id (PK)
* user_id (FK)
* restaurant_id (FK)
* created_at

---

---

## Branch Menu Items

Represents branch-level overrides for menu items.

Used when a branch needs to customize menu item availability or pricing without duplicating menu item data.

* id (PK)
* branch_id (FK)
* menu_item_id (FK)
* custom_price (nullable)
* is_available (boolean)
* created_at
* updated_at
* deleted_at

**Behavior:**

* If `custom_price` is NULL → use the menu item's `base_price`.
* If `custom_price` exists → use the branch-specific price.
* If `is_available` is false → the item is unavailable for that branch.


# 2. Relationships

### Users
* Users 1 → 0..1 Restaurants (owns)
* Users 1 → N Admin Logs
* Users 1 → N Favorites
* Users 1 → N Reviews
* Users 1 → N Restaurant Claims

### Restaurants
* Restaurants 0..1 → 1 User (owner)
* Restaurants 1 → N Branches
* Restaurants 1 → N Favorites
* Restaurants 1 → N Restaurant Claims
* Restaurants 1 → N Menus

### Branches

* Branches 1 → N Reviews
* Branches 1 → N Images
* Branches 1 → N Branch Menu Items

### Menus

* Menus 1 → N Menu Items

### MenuItems

* Menu Items 1 → N Branch Menu Items
---

# 3. Notes

* A restaurant can have multiple branches.
* Reviews and images are tied to branches, not directly to restaurants.
* Restaurants now support ambiance-based filtering through `ambiance_tags`.
* Menus are managed at the restaurant level.
* Each restaurant can have multiple menus.
* Each menu contains multiple menu items.
* Restaurant owners can create, update, activate/deactivate menus and manage their items.
* Restaurant claims handle ownership verification workflow.
* Admin logs track important administrative actions.
* Favorites provide a simple user → restaurant bookmarking system.
* Branch menu items allow branches to override menu item prices and availability.
* Branches do not duplicate menu item data; they only store branch-specific changes.
* Each restaurant can have at most one owner.
* Each restaurant owner can own at most one restaurant.
* A restaurant may have no owner if it has not been claimed.
---

# 4. Cardinality Summary

* Users (1) ─── (N) Reviews

* Users (1) ─── (N) Favorites

* Users (1) ─── (N) Admin Logs

* Users (N) ─── (N) Restaurants (via Restaurant Claims)

* Restaurants (1) ─── (N) Branches

* Restaurants (1) ─── (N) Menus

* Restaurants (1) ─── (N) Favorites

* Restaurants (1) ─── (N) Restaurant Claims

* Branches (1) ─── (N) Reviews

* Branches (1) ─── (N) Images

* Branches (1) ─── (N) Branch Menu Items

* Menus (1) ─── (N) Menu Items

* Menu Items (1) ─── (N) Branch Menu Items