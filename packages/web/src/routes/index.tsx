import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Settings } from "../pages/dashboard/Settings";
import { NotFound } from "../pages/NotFound";
import { Restaurants } from "../pages/restaurants/Restaurants";
import { RestaurantDetails } from "../pages/restaurants/RestaurantDetails";
import { Profile } from "../pages/profile/Profile";
import { OwnerDashboard } from "../pages/dashboard/OwnerDashboard";
import { AdminDashboard } from "../pages/dashboard/AdminDashboard";
import { Search } from "../pages/restaurants/Search";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />


    </Routes>
  );
}
