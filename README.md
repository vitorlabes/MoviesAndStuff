# MoviesAndStuff

🎬 Movie Reviews CRUD

A personal system for managing movie reviews, developed for learning and personal organization. Allows you to register, view, edit, and delete movie reviews with information like title, director, genre, rating, and watch status.


✨ Features

🎥 Complete Movie CRUD: Create, list, edit, and delete reviews

🔍 Filter System: Search by title, filter by genre and status (watched/queue)

🏷️ Genre Management: Categorize movies by genre

👀 Watch Control: Mark movies as watched or in queue

⭐ Rating System: Rate movies with scores

📱 Responsive Interface: Reusable components and modals


🛠️ Technologies

Backend

ASP.NET Core with Entity Framework

SQL Server (or other relational database)

REST API with complete CRUD endpoints

Frontend

Angular with TypeScript

RxJS for reactive state management

Reusable Components: Dropdown and Modal

Reactive Forms with validations


📋 API Endpoints

Movies

GET /api/movies - List movies (with optional filters)

GET /api/movies/{id} - Get movie by ID

POST /api/movies - Create new movie

PUT /api/movies/{id} - Update movie

PATCH /api/movies/{id}/watched - Toggle watch status

DELETE /api/movies/{id} - Delete movie

Genres

GET /api/movies/genres - List all genres

🎯 Key Components


MoviesListComponent

Listing with search, genre, and status filters

Confirmation modal for deletion

Quick toggle for "watched" status

MoviesFormComponent

Form to create/edit movies

Genre dropdown

Form validations

Reusable Components

DropdownComponent: Option selection with consistent interface

ConfirmModalComponent: Confirmation modal for destructive actions

🔮 Upcoming Features


TV Series: CRUD for series reviews

Games: CRUD for game reviews

User System: Personal reviews

Reports: Viewing statistics

Import/Export: Data backup

💡 Motivation



Learn and practice fullstack development

Organize personal movie reviews

Implement code patterns and architecture

Create reusable components
