# Affordable Meal Planning Assistant

A comprehensive web application that helps users create weekly meal plans within their budget. Designed to make meal planning simple, cost-effective, and personalized for every household.

## Features

- **User Authentication**: JWT-based login and signup system
- **Profile Management**: Update user profiles with profile picture uploads
- **Weekly Meal Planning**: Create and manage weekly meal plans with breakfast, lunch, and dinner options
- **Recipe Database**: Browse and search through recipes with ingredients, ratings, and cooking times
- **Ingredient Management**: Complete ingredient database for recipes
- **Grocery List**: Personalized grocery list management with CRUD operations
- **AI Chat Integration**: Interactive chat system for meal planning assistance
- **File Upload Support**: Upload profile pictures and manage file storage
- **Swagger Documentation**: Complete API documentation with interactive testing

## Architecture

### Backend (.NET 9.0 ASP.NET Core)
- **API Layer**: RESTful API built with ASP.NET Core 9.0 using **minimal APIs in Program.cs**
- **Database**: Microsoft SQL Server 2022 (`mpa_db`)
- **Authentication**: JWT-based authentication system (60-minute expiration)
- **AI Integration**: Custom GeminiService for intelligent meal suggestions
- **Documentation**: Swagger/OpenAPI at root endpoint
- **File Management**: Static file serving for uploads (`/uploads/profiles`)

### Frontend (React 19)
- **Framework**: React 19 with modern hooks and patterns
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router for navigation
- **UI Components**: Lucide React for consistent iconography
- **Architecture**: Component-based with routes and layouts

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Database**: SQL Server 2022 (port 1433)
- **Backend API**: Port 1501
- **Frontend Dev Server**: Port 5173

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** (v18 or higher) for frontend development
- **.NET 9.0 SDK** for backend development
- **Gemini API Key** (DO NOT commit it publicly)


## Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/marina-eckert/Affordable-Meal-Planning-Assistant.git](https://github.com/marina-eckert/Affordable-Meal-Planning-Assistant.git)
cd Affordable-Meal-Planning-Assistant
```
### 2. Start Backend Services
```bash
cd backend
docker-compose up -d
```
### 3. Frontend Development
```bash
cd ../mp-assistant
npm install
npm run dev
```

## Configuration

### Backend – appsettings.json
```
{
  "ConnectionStrings": {
    "DbConnectionString": "Server=sqlserver,1433;Database=mpa_db;User Id=sa;Password=StrongPassword@1;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "Key": "super-secret-key-CHANGE-THIS",
    "Issuer": "MPA.Auth.API",
    "Audience": "Clients",
    "ExpiresInMinutes": 60
  }
}
```
### Environment Variables (backend/.env)
```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

## Running the App

### Quick Start
```
# Start backend
cd backend && docker-compose up -d

# Start frontend
cd ../mp-assistant && npm install && npm run dev
```

### Access Points

- **Frontend**: http://localhost:5173

- **Backend API**: http://localhost:1501

- **Swagger Docs**: http://localhost:1501

- **Database**: localhost:1433

## Project Structure

Affordable-Meal-Planning-Assistant/
├── backend/
│   ├── src/MPA.API/
│   │   ├── Services/
│   │   ├── Entities/
│   │   ├── DTOs/
│   │   ├── Persistence/
│   │   ├── Interfaces/
│   │   ├── Settings/
│   │   ├── Constants/
│   │   ├── Enums/
│   │   ├── Program.cs
│   │   ├── DependencyRegistrar.cs
│   │   └── Dockerfile
│   ├── docker-compose.yml
│   └── env
│
├── mp-assistant/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── mealplanexample.json
└── README.md

## Database Schema
- Users
- Recipes
- Ingredients
- MealPlans
- MealPlanDays
- MealPlanItems
- GroceryItems

## Authentication System

- JWT-based login
- 60-minute expiration
- Bearer token authorization

## Academic Project

This project was developed as part of a university full-stack web development course.

### Technologies Demonstrated

- ASP.NET Core 9 Minimal APIs
- React 19 + Vite
- SQL Server + EF Core
- JWT Authentication
- Docker & Docker Compose
- AI Integration (Gemini)
- Static file hosting

## Troubleshooting

### Docker Connection Issues
If containers fail to start or services cannot connect:

```bash
docker-compose down -v
docker-compose up -d
```

- Ensure Docker Desktop is running.
- Make sure ports **1501**, **5173**, and **1433** are not being used by other programs.
- Verify that the backend `.env` file exists and contains valid values.

---

### Database Connection Errors
Common errors include “SQL Server unreachable”, “Login failed”, or EF Core migration failures.

**Fixes:**

Check that SQL Server is running:
```bash
docker ps
```

Ensure the connection string matches:
```
Server=sqlserver,1433;Database=mpa_db;User Id=sa;Password=StrongPassword@1;TrustServerCertificate=True
```

Restart SQL Server container:
```bash
docker restart sqlserver
```

Make sure port **1433** is not taken by a local SQL Server instance.

---

### Authentication / JWT Issues
If protected API routes return **401 Unauthorized**:

- Ensure the JWT secret in `appsettings.json` is valid.
- Tokens expire every **60 minutes**, so request a new token.
- Confirm the frontend sends the proper Authorization header:
```
Authorization: Bearer <token>
```

---

### API Not Responding
If the frontend cannot reach the backend API:

Check backend logs:
```bash
docker logs backend-service
```

Verify API is reachable in browser:
- http://localhost:1501  
- http://localhost:1501/swagger

Ensure `.env` contains a valid Gemini API key.

---

### Frontend Build or Runtime Errors
If the frontend throws build errors or fails to start:

```bash
cd mp-assistant
rm -rf node_modules package-lock.json
npm install
npm run dev
```

- Node.js version must be **18 or higher**.
- Ensure Vite config uses the correct API base URL.

---

### AI (Gemini) Issues
If AI chat does not respond:

- Verify `GEMINI_API_KEY` in `backend/env`.
- Ensure the API key is still active.
- Check backend logs:
```bash
docker logs backend-service
```

---

### Profile Picture Upload Issues
If profile picture uploads fail:

- Ensure `uploads/profiles` directory exists in backend container.
- Confirm static file serving is enabled in `Program.cs`.
- Use JPG or PNG files.

---

### CORS or Network Errors
If browser console shows CORS errors:

- Make sure backend is running at `http://localhost:1501`.
- Ensure frontend uses correct API base URL.
- Restart frontend after changes.

---

### General Debugging Tips
- Restart all services:
```bash
docker-compose down -v
docker-compose up -d
```

- Clear browser cache.
- Test endpoints individually in Swagger.
- Verify all environment variables are loaded correctly.
