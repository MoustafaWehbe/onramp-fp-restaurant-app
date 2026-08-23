import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import AuthCenteredLayout from "../layouts/AuthCenteredLayout";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { EmailVerification } from "../pages/auth/EmailVerification";
import { VerifyEmailToken } from "../pages/auth/VerifyEmailToken";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Home from "@/pages/home/Home";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Settings } from "../pages/dashboard/Settings";
import { Profile } from "../pages/profile/Profile";

import { Restaurants } from "../pages/restaurants/Restaurants";
import { RestaurantDetails } from "../pages/restaurants/RestaurantDetails";
import { Search } from "../pages/restaurants/Search";
import { SavedRestaurants } from "@/pages/restaurants/SavedRestaurants";

import BranchDetails from "../pages/branch/BranchDetails";
import MenuDetailsPage from "@/pages/menu/MenuDetails";

import RestaurantClaimPage from "@/pages/restaurantclaims/RestaurantClaims";

import { OwnerDashboard } from "../pages/dashboard/OwnerDashboard";
import { RestaurantOwnerPage } from "@/pages/onwer/RestaurantOwner";
import { OwnerBranchesPage } from "@/pages/onwer/OwnerBranches";
import { OwnerBranchCreationPage } from "@/pages/onwer/OwnerBranchCreation";
import { OwnerBranchDetailsPage } from "@/pages/onwer/OwnerBranchDetails";
import { OwnerMenusPage } from "@/pages/onwer/OwnerMenusPage";
import { CreateRestaurant } from "@/pages/onwer/CreateRestaurant";

import { RestaurantClaimsPage } from "@/pages/admin/AdminRestaurantClaimsPage";

import { NotFound } from "../pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      {/*  AUTH ROUTES  */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<AuthCenteredLayout />}>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmailToken />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/*  PUBLIC / USER APP  */}

      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />

        <Route path="/restaurants" element={<Restaurants />} />

        <Route
          path="/restaurants/:slug"
          element={<RestaurantDetails />}
        />

        <Route path="/search" element={<Search />} />

        <Route
          path="/restaurants/:restaurantSlug/branches/:branchSlug"
          element={<BranchDetails />}
        />

        <Route
          path="/menus/:menuId"
          element={<MenuDetailsPage />}
        />

        {/*  PROTECTED USER ROUTES  */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/saved-restaurants" element={<SavedRestaurants />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/claim-restaurant"
            element={<RestaurantClaimPage />}
          />
        </Route>
      </Route>

      {/* OWNER ROUTES*/}

      <Route element={<RoleRoute allowedRoles={["owner"]} />}>
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} />

          <Route
            path="restaurant"
            element={<RestaurantOwnerPage />}
          />

          <Route
            path="branches"
            element={<OwnerBranchesPage />}
          />

          <Route
            path="restaurants/:restaurantSlug/branches"
            element={<OwnerBranchCreationPage />}
          />

          <Route
            path="restaurants/:restaurantSlug/branches/:branchSlug"
            element={<OwnerBranchDetailsPage />}
          />

          <Route
            path="menus"
            element={<OwnerMenusPage />}
          />
        </Route>

        <Route
          path="/owner/create-restaurant"
          element={<CreateRestaurant />}
        />
      </Route>

      {/* ADMIN ROUTES */}

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={
              <Navigate
                to="restaurant-claims"
                replace
              />
            }
          />

          <Route
            path="restaurant-claims"
            element={<RestaurantClaimsPage />}
          />
        </Route>
      </Route>

      {/* ==================== NOT FOUND ==================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}