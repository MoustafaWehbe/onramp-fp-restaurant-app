# Platera 🍽️

Platera is a full-stack restaurant discovery and management platform built for Lebanon. Users can discover restaurants, explore branches and menus, write reviews, save favorites, and use AI-powered search. Restaurant owners can claim and manage restaurants, while admins manage claims and platform operations.

## Features

* 🔐 **Authentication & Authorization** — Registration, email verification, password reset, authentication, and role-based access (`user`, `owner`, `admin`).
* 🍴 **Restaurant Discovery** — Search and filter restaurants by cuisine, price, rating, location, vibe, and availability.
* 📍 **Branches** — Manage multiple branches with locations, opening hours, contact information, images, and ratings.
* 📖 **Menus** — Manage menus, menu items, prices, availability, and branch-specific prices.
* ⭐ **Reviews & Favorites** — Users can review branches and save restaurants to their favorites.
* 🏪 **Restaurant Claims** — Users can request restaurant ownership, with admin approval and owner management.
* 🤖 **AI Search** — Semantic restaurant search using embeddings, Ollama, and PostgreSQL/pgvector.
* ⚙️ **Background Processing** — BullMQ and Redis workers for emails, embeddings, indexing, scraping, and data processing.

## Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router

**Backend**

* Node.js
* TypeScript
* Express
* Sequelize
* Zod

**Database & Infrastructure**

* PostgreSQL + pgvector
* Redis
* BullMQ
* Docker
* Supabase Storage

**AI**

* Ollama
* `nomic-embed-text`
* Vector embeddings
* Semantic search / RAG


## Getting Started

### Requirements

* Node.js 22+
* npm
* Docker Desktop
* Ollama

### Installation

```bash
git clone <repository-url>
cd <repository-directory>

npm install
```

Start the required services:

```bash
docker compose up -d
```

Run database migrations:

```bash
npx sequelize-cli db:migrate
```

For AI search, install and run Ollama with the embedding model:

```bash
ollama pull nomic-embed-text
```

Configure the required environment variables for the API and workers, then start the application:

```bash
npm run dev
```

## Architecture

```text
React Web App
      │
      ▼
   REST API
      │
 ┌────┴─────┐
 ▼          ▼
PostgreSQL  Redis
 + pgvector   │
      ▲       ▼
      │   BullMQ Workers
      │       │
      └── RAG / Embeddings
```

## User Roles

| Role    | Main Responsibilities                       |
| ------- | ------------------------------------------- |
| `user`  | Discover, review, and favorite restaurants  |
| `owner` | Manage restaurants, branches, and menus     |
| `admin` | Manage claims and administrative operations |

## API Documentation

Swagger/OpenAPI documentation is available through the API's configured Swagger route when the backend is running.

---

**Platera — Discover. Explore. Dine.**
