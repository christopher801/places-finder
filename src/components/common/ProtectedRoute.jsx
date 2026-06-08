// src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <LoadingSpinner fullPage text="Loading..." />;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
