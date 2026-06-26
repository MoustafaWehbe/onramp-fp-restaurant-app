# Restaurant Discovery Platform — ERD

This document describes the core database schema and relationships for the Restaurant Discovery Platform.

---

## 1. Tables Overview

### Users
Represents system users (diners, restaurant owners, admins).

- id (PK)
- name
- email
- password
- role (enum)
- created_at
- updated_at

---

### Restaurants
Represents restaurant brands or chains.

- id (PK)
- name
- description
- cuisine_type
- price_range
- verified (boolean)
- created_at
- updated_at

---

### Branches
Physical locations of restaurants.

- id (PK)
- restaurant_id (FK)
- name
- address
- city
- latitude
- longitude
- phone
- opening_hours
- created_at
- updated_at

---

### Reviews
Customer reviews for branches.

- id (PK)
- branch_id (FK)
- user_id (FK)
- rating (tinyint)
- comment
- created_at
- updated_at

---

### Images
Images associated with branches.

- id (PK)
- branch_id (FK)
- url
- type (enum: exterior, interior, menu, other)
- created_at
- updated_at

---

### Restaurant Claims (Pivot)
Represents ownership/claim requests between users and restaurants.

- user_id (FK)
- restaurant_id (FK)
- status (enum: pending, approved, rejected)
- claimed_at
- reviewed_by (FK → Users)
- reviewed_at

**Primary Key:** (user_id, restaurant_id)

---

### Admin Logs
Logs admin actions in the system.

- id (PK)
- user_id (FK)
- action
- target_type
- target_id
- created_at

---

### Favorites
Restaurants saved by users.

- id (PK)
- user_id (FK)
- restaurant_id (FK)
- created_at

---

## 2. Relationships

- Users 1 → N Admin Logs
- Users 1 → N Favorites
- Users 1 → N Reviews
- Users 1 → N Restaurant Claims

- Restaurants 1 → N Branches
- Restaurants 1 → N Favorites
- Restaurants 1 → N Restaurant Claims

- Branches 1 → N Reviews
- Branches 1 → N Images

- Restaurant Claims is a pivot table between Users and Restaurants (many-to-many)

---

## 3. Notes

- A restaurant can have multiple branches.
- Reviews and images are tied to branches, not directly to restaurants.
- Restaurant claims handle ownership verification workflow.
- Admin logs track all important admin/system actions.
- Favorites is a simple user → restaurant bookmarking system.

---

## 4. Cardinality Summary
- Users (1) ─── (N) Reviews
- Users (1) ─── (N) Favorites
- Users (1) ─── (N) Admin Logs
- Users (N) ─── (N) Restaurants (via Restaurant Claims)

- Restaurants (1) ─── (N) Branches
- Branches (1) ─── (N) Reviews
- Branches (1) ─── (N) Images