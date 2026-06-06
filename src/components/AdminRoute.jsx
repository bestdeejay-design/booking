import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user || !isAdmin) return <Navigate to="/login" />;
  return children;
}
