import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Profile from "../pages/Profile";
import GroceryList from "../pages/GroceryList";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Recipes from "../pages/Recipes";
import MealPlanner from "../pages/MealPlanner";
import Insights from "../pages/Insights";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />

      <Route
        path="/grocery"
        element={
          <MainLayout>
            <GroceryList />
          </MainLayout>
        }
      />

      <Route
        path="/recipes"
        element={
          <MainLayout>
            <Recipes />
          </MainLayout>
        }
      />

      <Route
        path="/planner"
        element={
          <MainLayout>
            <MealPlanner />
          </MainLayout>
        }
      />
      <Route
        path="/insights"
        element={
          <MainLayout>
            <Insights />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
