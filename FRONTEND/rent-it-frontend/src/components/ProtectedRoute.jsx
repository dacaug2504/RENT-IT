import { Navigate } from 'react-router-dom';
import { userService } from '../services/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = userService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Normalize role safely
  let userRole = user.role;

  if (typeof userRole === 'object' && userRole !== null) {
    userRole =
      userRole.roleName ||
      userRole.role_name ||
      userRole.name;
  }

  if (typeof userRole === 'string') {
    userRole = userRole.toUpperCase(); // normalize
  }

  // 🔹 Normalize allowed roles
  const normalizedAllowedRoles = allowedRoles?.map(r => r.toUpperCase());

  if (
    normalizedAllowedRoles &&
    !normalizedAllowedRoles.includes(userRole)
  ) {
    console.warn('Role blocked by ProtectedRoute:', userRole);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
