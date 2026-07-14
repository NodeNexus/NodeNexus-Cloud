import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export const ProtectedRoute = () => {
  const { token } = useStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
