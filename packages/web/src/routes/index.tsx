import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { EmailVerification } from "../pages/auth/EmailVerification";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Settings } from "../pages/dashboard/Settings";
import { NotFound } from "../pages/NotFound";
import { Restaurants } from "../pages/restaurants/Restaurants";
import { RestaurantDetails } from "../pages/restaurants/RestaurantDetails";
import { Profile } from "../pages/profile/Profile";
import { OwnerDashboard } from "../pages/dashboard/OwnerDashboard";
import { AdminDashboard } from "../pages/dashboard/AdminDashboard";
import BranchDetails from "../pages/branch/BranchDetails";
import { Search } from "../pages/restaurants/Search";
import AuthCenteredLayout from "../layouts/AuthCenteredLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import { VerifyEmailToken } from "../pages/auth/VerifyEmailToken";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "@/pages/home/Home";
import { SavedRestaurants } from "@/pages/restaurants/SavedRestaurants";
import MenuDetailsPage from "@/pages/menu/MenuDetails";
import RestaurantClaimPage from "@/pages/restaurantclaims/RestaurantClaims";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { RestaurantOwnerPage } from "@/pages/onwer/RestaurantOwner";
import { OwnerBranchesPage } from "@/pages/onwer/OwnerBranches";
import { OwnerBranchCreationPage } from "@/pages/onwer/OwnerBranchCreation";
import { OwnerBranchDetailsPage } from "@/pages/onwer/OwnerBranchDetails";
import { OwnerMenusPage } from "@/pages/onwer/OwnerMenusPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { RestaurantClaimsPage } from "@/pages/admin/AdminRestaurantClaimsPage";
import { CreateRestaurant } from "@/pages/onwer/CreateRestaurant";
import { RoleRoute } from "./RoleRoute";


export function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
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

      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/home" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:slug" element={<RestaurantDetails />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/restaurants/:restaurantSlug/branches/:branchSlug"
          element={<BranchDetails />}
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/saved-restaurants" element={<SavedRestaurants />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/claim-restaurant" element={<RestaurantClaimPage />} />
        </Route>

        {/*Owner routes*/}
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
        </Route>
        <Route element={<RoleRoute allowedRoles={["owner"]} />}>
          <Route
            path="/owner/create-restaurant"
            element={<CreateRestaurant />}
          />
        </Route>

        {/*Admin routes*/}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to="restaurant-claims" replace />}
            />
            <Route
              path="restaurant-claims"
              element={<RestaurantClaimsPage />}
            />
          </Route>
        </Route>

      </Route>


      <Route path="*" element={<NotFound />} />


    </Routes>
  );
}
