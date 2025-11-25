# Affordable Meal Planning Assistant

A comprehensive web application that helps users create weekly meal plans within their budget. Designed to make meal planning simple, cost-effective, and personalized for every household.

## 🚀 Features

- **User Authentication**: JWT-based login and signup system
- **Profile Management**: Update user profiles with profile picture uploads
- **Weekly Meal Planning**: Create and manage weekly meal plans with breakfast, lunch, and dinner options
- **Recipe Database**: Browse and search through recipes with ingredients, ratings, and cooking times
- **Ingredient Management**: Complete ingredient database for recipes
- **Grocery List**: Personalized grocery list management with CRUD operations
- **AI Chat Integration**: Interactive chat system for meal planning assistance
- **File Upload Support**: Upload profile pictures and manage file storage
- **Swagger Documentation**: Complete API documentation with interactive testing

## 🏗️ Architecture

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

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** (v18 or higher) for frontend development
- **.NET 9.0 SDK** for backend development
- **Gemini API Key** (provided in env file)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/marina-eckert/Affordable-Meal-Planning-Assistant.git](https://github.com/marina-eckert/Affordable-Meal-Planning-Assistant.git)
cd Affordable-Meal-Planning-Assistant
