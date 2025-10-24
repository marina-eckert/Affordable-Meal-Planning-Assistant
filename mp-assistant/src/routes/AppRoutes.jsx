import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import GroceryList from "../pages/GroceryList";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />
      
      <Route path="/register" element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      } />
      
      <Route path="/dashboard" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />

      <Route path="/profile" element={
        <MainLayout>
          <Profile />
        </MainLayout>
      } />

      <Route path="/grocery" element={
        <MainLayout>
          <GroceryList />
        </MainLayout>
      } />

    </Routes>
  );
};

export default AppRoutes;

