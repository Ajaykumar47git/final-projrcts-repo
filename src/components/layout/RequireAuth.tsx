import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';

export function RequireAuth({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'resident' | 'administrator' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
          <Skeleton className="w-48 h-4 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'administrator' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
