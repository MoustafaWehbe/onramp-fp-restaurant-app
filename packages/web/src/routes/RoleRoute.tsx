import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { useLocation } from "react-router-dom";

type Role = "user" | "owner" | "admin";

interface RoleRouteProps {
  allowedRoles: Role[];
}

const roleRedirects: Record<Role, string> = {
  user: "/home",
  owner: "/owner",
  admin: "/admin/restaurant-claims",
};

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role as Role)) {
    return (
      <Navigate
        to={roleRedirects[user.role as Role]}
        replace
      />
    );
  }

  return <Outlet />;
}