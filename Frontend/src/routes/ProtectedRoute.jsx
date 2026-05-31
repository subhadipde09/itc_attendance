import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ roles }) {
  const { user, accessToken } = useSelector((state) => state.auth);
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
