import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useSelector((state) => state.auth);
  const { user, isAuthenticated, _persist } = auth;

  // ⏳ Wait for redux-persist to rehydrate
  if (_persist && !_persist.rehydrated) {
    return null; // or a spinner if you want
  }

  // ❌ Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // =========================
  // 🔹 Normalize user role (KEEP OLD LOGIC)
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
  const normalizedAllowedRoles = allowedRoles?.map(
    (r) => r.toUpperCase()
  );

  // ❌ Role not allowed
  if (
    normalizedAllowedRoles &&
    !normalizedAllowedRoles.includes(userRole)
  ) {
    console.warn("Role blocked by ProtectedRoute:", userRole);
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
