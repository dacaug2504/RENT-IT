import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, _persist } = useSelector(
    (state) => state.auth
  );

  // ⏳ Wait for redux-persist rehydration
  if (_persist && !_persist.rehydrated) {
    return null; // or <Spinner />
  }

  // ❌ Not logged in → block immediately
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // =========================
  // 🔹 Normalize user role
  // =========================
  let userRole = user.role;

  if (typeof userRole === "object" && userRole !== null) {
    userRole =
      userRole.roleName ||
      userRole.role_name ||
      userRole.name;
  }

  if (typeof userRole === "string") {
    userRole = userRole.toUpperCase();
  }

  // =========================
  // 🔹 Normalize allowed roles
  // =========================
  if (allowedRoles) {
    const normalizedAllowedRoles = allowedRoles.map(r =>
      r.toUpperCase()
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      console.warn("Role blocked:", userRole);
      return <Navigate to="/login" replace />;
    }
  }

  // ✅ AUTHORIZED → render nested route
  return <Outlet />;
};

export default ProtectedRoute;
