# 🎬 MoviesAndStuff: Media Review Manager

A personal full-stack application for managing **movie and game reviews**, built with **.NET 8** and **Angular 19 (with Signals)**.

This is a learning project that prioritizes **clean architecture**, **code reusability (DRY)**, and **modern frontend patterns**.

---

## ✨ Features

MoviesAndStuff allows you to create, view, edit, and delete movies and games — keeping track of details like **title, genre, rating, duration, and watched/played status**.

* **Full CRUD:** Implemented for **Movies** and **Games**.
* **Smart Filters:** Search and filter items by name, genre, and watched/played status.
* **Genre Management:** **Genre CRUD is in progress** to allow dynamic management of categories (moving from static data).
* **Optimized UX:** Reusable components and fluid navigation using **route lazy loading**.

---

## 🧱 Architecture: Focused on DRY Principles

The project layers, in both the backend and frontend, share the core goal of **centralizing logic and avoiding code repetition**.

| Layer | Stack | Key Focus |
|:------|:------|:----------|
| **Backend** | ASP.NET Core 8 REST API (C#) | Centralization of business and persistence logic. |
| **Frontend** | Angular 19 (TypeScript) | Modern reactivity (Signals) and shared component structure. |
| **Database** | SQL Server (via EF Core) | Code-First migrations and optimized relational modeling. |

### 🧠 Backend: Logic Centralization

The **DRY** approach is applied using generics to extract common CRUD logic:

* `BaseMediaController`: Handles generic HTTP operations for all media entities.
* `BaseMediaService`: Contains **all common CRUD logic** (listing, get by ID, creation, update, deletion).
* Specific Services: (e.g., `MovieService`, `GameService`) inherit from `BaseMediaService` and deal only with **minor mapping differences or entity-specific rules**.

> **Benefit:** Adding a new entity (e.g., "Series") requires only a new model, a minimal service, and a new controller, without rewriting core logic.

### 💻 Frontend: Shared Components

Built with **Angular 19** using **Signals, Computed, and Effect** for reactive and modern state management.

Every media module (Movies, Games) uses the same structure of shared components:

* `BaseMediaList`: Encapsulates generic listing logic (filters, search, pagination, and delete confirmation).
* `BaseMediaForm`: Shared form structure for create and edit operations.

#### 🧩 Reusable UI Components

| Component | Description | Primary Use |
|:------------|:----------|:--------------|
| `Sidebar` | Main navigation component. | Navigation between modules. |
| `ConfirmModal` | Generic modal for confirmations. | Used for delete actions. |
| `DropdownSearch` | Dropdown with search filter. | Genre selection in the form and filtering in the list. |
| `MediaTable` | System's global data table. | Used inside `BaseMediaList`. |
| `StarRating` | Rating display and input component. | `Rating` property for movies/games. |
| `Toast` | Reusable notification system. | Success/error feedback. |

---

## 💾 Data Modeling (Entity Framework Core)

The persistence layer uses EF Core. The model is designed for flexibility and code reuse, particularly in the management of Genres.

### Genre Modeling Overview

To adhere to the **DRY principle** and avoid duplicating genre IDs across different media types, an explicit many-to-many relationship was implemented using a junction entity (`GenreMediaType`):

* `Genre`: Unique entity for the genre name (e.g., "Action").
* `MediaType`: Static media types (e.g., "Movie", "Game").
* `GenreMediaType`: Junction table that defines **which genres are available for which media types**.

**Key Entities:**
* `Movies`
* `Games`
* `Genres`
* `MediaTypes`
* `GenreMediaTypes` (junction table)

---

## 🛠️ Tech Stack

### Backend
* ASP.NET Core 8
* Entity Framework Core
* SQL Server
* Swagger / OpenAPI

### Frontend
* Angular 19 (with Signals)
* TypeScript
* Bootstrap
* RxJS

---

## 📋 Project Status and Next Steps

| Status | Module | Description |
|:-------|:-------|:----------|
| ✅ Completed | **Movies CRUD** | Full implementation of listing, forms, and services. |
| ✅ Completed | **Games CRUD** | Full implementation of listing, forms, and services. |
| 🚧 **In Progress** | **Genres CRUD** | Implementing dynamic management and relationship handling for genres. |
| 💡 Next Up | **TV Series CRUD** | Adding a new `Series` entity to validate the overall DRY architecture. |
| 🔮 Future | **Advanced Features** | User accounts, statistics. |

---
