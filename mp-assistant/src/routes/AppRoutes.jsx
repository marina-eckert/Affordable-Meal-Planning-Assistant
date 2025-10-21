import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import GroceryList from "../pages/GroceryList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route path="/profile" element={<Profile />} />
      <Route path="/grocery" element={<GroceryList />} />
    </Routes>
  );
};

export default AppRoutes;
