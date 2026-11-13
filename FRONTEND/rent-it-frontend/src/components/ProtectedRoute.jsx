import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { forceLogout } from "../features/auth/authSlice";

// true if the JWT is missing, malformed, or past its "exp" time
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, _persist } = useSelector(
    (state) => state.auth
  );
  const rehydrated = !_persist || _persist.rehydrated;
  const expired = isAuthenticated && isTokenExpired(token);

  // 🔒 Clear a stale session (token expired while it sat in localStorage)
  useEffect(() => {
    if (rehydrated && expired) dispatch(forceLogout());
  }, [rehydrated, expired, dispatch]);

  // ⏳ Wait for redux-persist rehydration
  if (!rehydrated) {
    return null; // or <Spinner />
  }

  // ❌ Not logged in (or session expired) → block immediately
  if (!isAuthenticated || !user || expired) {
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
