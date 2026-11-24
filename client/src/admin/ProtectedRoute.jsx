import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from './api';

// Client-side route guard. (Real enforcement is the server's requireAuth middleware.)
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!getToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
}
