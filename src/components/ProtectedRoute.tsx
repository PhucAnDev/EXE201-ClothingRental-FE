import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // If no user is logged in, redirect to home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleId = currentUser.roleId;
    if (!allowedRoles.includes(userRoleId)) {
      // User doesn't have permission, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
