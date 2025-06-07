import { Navigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthHelper';

const RequireAdmin = ({ children }) => {
  const { user, isLoading } = useAuth();

  console.log('RequireAdmin:', { user, isLoading });

  if (isLoading) {
    return <div className="loader">Завантаження...</div>;
  }

  const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('Moderator');

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAdmin;
