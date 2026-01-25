import { Navigate } from 'react-router-dom';
import { userService } from '../services/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = userService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;