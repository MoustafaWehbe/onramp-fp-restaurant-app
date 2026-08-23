# Restaurant Discovery Platform — ERD

This document describes the database schema, tables, fields, and relationships implemented by the Restaurant Discovery Platform.

---

# 1. Tables Overview

## Users

Represents system users, including diners, restaurant owners, and administrators.

* `id` (PK, UUID)
* `name`
* `email` (unique)
* `password_hash`
* `role` (enum: `admin`, `user`, `owner`)
* `email_verified` (boolean)
* `created_at`
* `updated_at`

---

## Restaurants

Represents restaurant brands or businesses. A restaurant can have multiple physical branches.

* `id` (PK, UUID)
* `image_url`
* `name`
* `slug` (unique)
* `description`
* `cuisine_type`
* `ambiance_tags` (JSON)
* `price_range` (enum: `Budget`, `Average`, `Expensive`, `Luxury`)
* `email`
* `phone`
* `review_count`
* `average_rating`
* `deleted_at` (nullable)
* `created_at`
* `updated_at`

### Ambiance Tags

`ambiance_tags` stores atmosphere-related tags used for restaurant filtering.

Possible values include:

* `quiet`
* `family`
* `romantic`
* `outdoor`
* `loud`

Example:

```json
["family", "outdoor"]
```

> Note: The current `Restaurant` model does not contain a `verified_at` field. Restaurant ownership verification is handled through `RestaurantClaim`.

---

## Branches

Represents physical locations of restaurants.

* `id` (PK, UUID)
* `restaurant_id` (FK → Restaurants)
* `name`
* `slug`
* `city`
* `address`
* `latitude`
* `longitude`
* `phone` (nullable)
* `opening_hours`
* `review_count`
* `average_rating`
* `deleted_at` (nullable)
* `created_at`
* `updated_at`

Branches use soft deletion through `deleted_at`.

---

## Reviews

Customer reviews associated with restaurant branches.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `branch_id` (FK → Branches)
* `rating` (1–5)
* `comment`
* `deleted_at` (nullable)
* `created_at`
* `updated_at`

Reviews use soft deletion through `deleted_at`.

---

## Branch Images

Images associated with restaurant branches.

* `id` (PK, UUID)
* `branch_id` (FK → Branches)
* `url`
* `type`
* `created_at`
* `updated_at`
* `deleted_at` (managed by Sequelize paranoid mode)

The current model stores `type` as a string rather than enforcing an enum at the model level.

Possible application-level values may include:

* `exterior`
* `interior`
* `menu`
* `other`

---

## Menus

Represents menus managed at the restaurant level.

* `id` (PK, UUID)
* `restaurant_id` (FK → Restaurants)
* `name`
* `description`
* `is_active` (boolean)
* `created_at`
* `updated_at`
* `deleted_at`

Examples:

* Main Menu
* Breakfast Menu
* Seasonal Menu

Menus use soft deletion through `deleted_at`.

---

## Menu Items

Represents individual items belonging to a menu.

* `id` (PK, UUID)
* `menu_id` (FK → Menus)
* `name`
* `description`
* `base_price`
* `image_url` (nullable)
* `display_order`
* `is_active` (boolean)
* `created_at`
* `updated_at`
* `deleted_at`

> Note: The current model does not contain `category` or `available`. Instead, item activation is represented by `is_active`, while branch-specific availability is represented by `BranchMenuItem.is_available`.

---

## Branch Menu Items

Represents branch-level overrides for menu items.

A branch can customize the price and availability of an existing menu item without duplicating the menu item itself.

* `id` (PK, UUID)
* `branch_id` (FK → Branches)
* `menu_item_id` (FK → Menu Items)
* `custom_price` (nullable)
* `is_available` (boolean)
* `created_at`
* `updated_at`
* `deleted_at`

### Behavior

* If `custom_price` is `NULL`, the menu item's `base_price` is used.
* If `custom_price` exists, the branch-specific price is used.
* If `is_available` is `false`, the item is unavailable at that branch.

This allows multiple branches of the same restaurant to customize menu items independently.

---

## Restaurant Claims

Represents restaurant ownership requests submitted by users and reviewed by administrators.

A claim can reference an existing restaurant or request ownership for a restaurant that does not yet exist.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `restaurant_id` (FK → Restaurants, nullable)
* `restaurant_name`
* `email`
* `phone`
* `status` (enum: `pending`, `approved`, `rejected`, `completed`)
* `created_at`
* `updated_at`
* `deleted_at`

### Claim Behavior

* `restaurant_id` is nullable because the restaurant may not exist yet.
* If `restaurant_id` is provided, the user is requesting ownership of an existing restaurant.
* If `restaurant_id` is `NULL`, the user is requesting registration of a new restaurant.
* An administrator reviews the claim.
* A claim can be:

  * `pending`
  * `approved`
  * `rejected`
  * `completed`
* An approved claim authorizes the user to manage the restaurant.

### Important Implementation Note

The current `RestaurantClaim` model has:

```text
user_id: unique
```

Therefore, **the current database model allows only one RestaurantClaim per user**.

This differs from a workflow where users can submit multiple claims over time.

If the intended business rule is:

> "A user can submit multiple claims over time but can have only one approved restaurant."

then the `unique` constraint on `user_id` should eventually be removed and replaced with an appropriate constraint for approved claims.

---

## Favorites

Represents restaurants saved/bookmarked by users.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `restaurant_id` (FK → Restaurants)
* `created_at`
* `updated_at`

There is a unique composite index on:

```text
(user_id, restaurant_id)
```

This prevents a user from favoriting the same restaurant more than once.

---

## Admin Logs

Records administrative actions performed by users with administrative privileges.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `action`
* `target_type`
* `target_id`
* `created_at`
* `updated_at`

`target_type` identifies the type of entity affected, while `target_id` identifies the specific entity.

---

# Authentication and Session Tables

## Sessions

Represents authenticated user sessions.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `user_agent` (nullable)
* `ip_address` (nullable)
* `expires_at`
* `created_at`
* `updated_at`

A user can have multiple active or historical sessions.

---

## Refresh Tokens

Stores hashed refresh tokens associated with user sessions.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `session_id` (FK → Sessions)
* `token_hash` (unique)
* `expires_at`
* `revoked_at` (nullable)
* `created_at`
* `updated_at`

Refresh tokens are associated with both the user and the session.

A refresh token is valid only when:

* it has not expired
* it has not been revoked

---

## Email Verification Tokens

Stores hashed tokens used to verify user email addresses.

* `id` (PK, UUID)
* `user_id` (FK → Users)
* `token_hash` (unique)
* `expires_at`
* `created_at`
* `updated_at`

The token is considered expired when the current time is greater than `expires_at`.

---

## Password Reset Tokens

Stores hashed tokens used for password reset operations.

* `id` (PK, UUID)
* `user_id` (FK → Users, unique)
* `token_hash` (unique)
* `expires_at`
* `created_at`
* `updated_at`

The current model allows at most one password reset token per user.

---

# Search and RAG Tables

## Search Embeddings

Stores searchable textual content and vector embeddings for entities used by the semantic search/RAG system.

* `id` (PK, UUID)
* `entity_type`
* `entity_id` (UUID)
* `content`
* `embedding` (`VECTOR(768)`, nullable)
* `metadata` (JSONB, nullable)
* `created_at`
* `updated_at`

There is a unique composite index on:

```text
(entity_type, entity_id)
```

This allows one embedding record per entity/type combination.

### Entity Types

The `entity_type` field identifies the source entity represented by the embedding.

Examples include:

* `restaurant`
* `menu`
* `menu_item`

The embedding vector currently uses **768 dimensions**, matching the configured embedding model.

---

# 2. Relationships

## Users

* Users 1 → N Sessions
* Users 1 → N Refresh Tokens
* Users 1 → N Email Verification Tokens
* Users 1 → N Password Reset Tokens
* Users 1 → N Admin Logs
* Users 1 → N Favorites
* Users 1 → N Reviews
* Users 1 → N Restaurant Claims

---

## Sessions

* Sessions N → 1 User
* Sessions 1 → N Refresh Tokens

---

## Refresh Tokens

* Refresh Tokens N → 1 User
* Refresh Tokens N → 1 Session

---

## Email Verification Tokens

* Email Verification Tokens N → 1 User

---

## Password Reset Tokens

* Password Reset Tokens N → 1 User
* Current model: one password reset token per user due to unique `user_id`

---

## Restaurants

* Restaurants 1 → N Branches
* Restaurants 1 → N Favorites
* Restaurants 1 → N Restaurant Claims
* Restaurants 1 → N Menus
* Restaurants 0 → N Search Embeddings

Restaurant ownership is determined through approved Restaurant Claims rather than an `owner_id` column on Restaurants.

---

## Branches

* Branches N → 1 Restaurant
* Branches 1 → N Reviews
* Branches 1 → N Branch Images
* Branches 1 → N Branch Menu Items

---

## Reviews

* Reviews N → 1 User
* Reviews N → 1 Branch

---

## Branch Images

* Branch Images N → 1 Branch

---

## Menus

* Menus N → 1 Restaurant
* Menus 1 → N Menu Items
* Menus 0 → N Search Embeddings

---

## Menu Items

* Menu Items N → 1 Menu
* Menu Items 1 → N Branch Menu Items
* Menu Items 0 → N Search Embeddings

---

## Branch Menu Items

* Branch Menu Items N → 1 Branch
* Branch Menu Items N → 1 Menu Item

---

## Restaurant Claims

* Restaurant Claims N → 1 User
* Restaurant Claims N → 0..1 Restaurant

A claim may exist without a restaurant when requesting registration of a new restaurant.

---

## Favorites

* Favorites N → 1 User
* Favorites N → 1 Restaurant

---

## Admin Logs

* Admin Logs N → 1 User

---

## Search Embeddings

Search embeddings are polymorphic at the application level:

* Search Embedding → Restaurant
* Search Embedding → Menu
* Search Embedding → Menu Item

The relationship is represented using:

```text
entity_type + entity_id
```

rather than separate foreign-key columns.

---

# 3. Ownership Workflow

Restaurant ownership is handled through `RestaurantClaim`.

### Existing Restaurant

```text
User
  |
  | submits claim
  v
RestaurantClaim
  |
  | restaurant_id
  v
Existing Restaurant
```

The administrator reviews the claim.

```text
pending
   |
   +----> approved
   |
   +----> rejected
```

After the owner completes the required restaurant setup, the claim can reach:

```text
completed
```

### New Restaurant

```text
User
  |
  | submits claim
  v
RestaurantClaim
  |
  | restaurant_id = NULL
  v
Administrator Review
  |
  | approved
  v
Restaurant Creation / Owner Setup
```

---

# 4. Cardinality Summary

* Users (1) ─── (N) Sessions

* Users (1) ─── (N) Refresh Tokens

* Users (1) ─── (N) Email Verification Tokens

* Users (1) ─── (N) Password Reset Tokens

* Users (1) ─── (N) Reviews

* Users (1) ─── (N) Favorites

* Users (1) ─── (N) Admin Logs

* Users (1) ─── (N) Restaurant Claims

* Sessions (1) ─── (N) Refresh Tokens

* Restaurants (1) ─── (N) Branches

* Restaurants (1) ─── (N) Menus

* Restaurants (1) ─── (N) Favorites

* Restaurants (1) ─── (N) Restaurant Claims

* Restaurants (1) ─── (N) Search Embeddings*

* Branches (1) ─── (N) Reviews

* Branches (1) ─── (N) Branch Images

* Branches (1) ─── (N) Branch Menu Items

* Menus (1) ─── (N) Menu Items

* Menus (1) ─── (N) Search Embeddings*

* Menu Items (1) ─── (N) Branch Menu Items

* Menu Items (1) ─── (N) Search Embeddings*

* Branch Menu Items (N) ─── (1) Branch

* Branch Menu Items (N) ─── (1) Menu Item

* Restaurant Claims (N) ─── (0..1) Restaurant

`*` Search Embedding relationships are application-level polymorphic relationships using `entity_type` and `entity_id`, not database-enforced foreign keys.

---

# 5. Important Database Rules

* Restaurant slugs are unique.
* User emails are unique.
* Favorite `(user_id, restaurant_id)` combinations are unique.
* Refresh token hashes are unique.
* Email verification token hashes are unique.
* Password reset token hashes are unique.
* Password reset tokens currently have a unique `user_id`.
* Restaurant claims currently have a unique `user_id`.
* Restaurants, branches, reviews, menus, menu items, branch menu items, restaurant claims, and branch images use soft-delete behavior where configured with Sequelize paranoid mode.
* Branch menu items allow branch-specific price and availability overrides.
* Menu items contain the base price.
* Menus belong to restaurants.
* Menu items belong to menus.
* Branches belong to restaurants.
* Reviews belong to branches.
* Images belong to branches.
* Restaurant ownership is determined through the Restaurant Claim workflow.
* Search embeddings use 768-dimensional vectors.
* Search embeddings use `(entity_type, entity_id)` as their logical entity identifier.

---

# 6. Notes

* A restaurant can have multiple branches.
* Reviews and images are associated with branches rather than directly with restaurants.
* Restaurants support ambiance-based filtering through `ambiance_tags`.
* Menus are managed at the restaurant level.
* Each restaurant can have multiple menus.
* Each menu contains multiple menu items.
* Restaurant owners can manage their restaurant's menus and menu items according to authorization rules.
* Branches can customize menu item pricing and availability without duplicating menu item records.
* Restaurant claims handle the ownership verification workflow.
* A restaurant claim can reference an existing restaurant or represent a request for a new restaurant.
* Administrators approve or reject ownership requests.
* Admin logs track administrative actions.
* Favorites provide a user-to-restaurant bookmarking relationship.
* Authentication uses sessions and refresh tokens.
* Email verification uses dedicated verification tokens.
* Password recovery uses dedicated password reset tokens.
* Search embeddings support semantic search and RAG functionality.
* Embeddings are associated with restaurants, menus, and menu items through `entity_type` and `entity_id`.
* Restaurant ownership is not stored directly on the Restaurant table.
* The current `RestaurantClaim.user_id` uniqueness constraint means one user can currently have only one claim record.
* If the intended business rule allows multiple historical claims per user, that uniqueness constraint should be changed in the database/model.

---

# 7. Entity Relationship Diagram Summary

```text
Users
 ├──< Sessions
 │      └──< RefreshTokens
 │
 ├──< EmailVerificationTokens
 ├──< PasswordResetTokens
 ├──< AdminLogs
 ├──< Favorites >── Restaurants
 ├──< Reviews >── Branches >── Restaurants
 └──< RestaurantClaims >── Restaurants

Restaurants
 ├──< Branches
 ├──< Menus
 ├──< Favorites
 └──< RestaurantClaims

Menus
 └──< MenuItems
          └──< BranchMenuItems >── Branches

Branches
 ├──< Reviews
 ├──< BranchImages
 └──< BranchMenuItems

Restaurants ──┐
Menus ────────┼──< SearchEmbeddings
MenuItems ────┘
```

