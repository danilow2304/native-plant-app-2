// In App.jsx:  import { adminRoutes } from './admin/adminRoutes';
// then put  {adminRoutes}  inside <Routes> ... </Routes>
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PlantForm from './PlantForm';
import PlantDetail from './PlantDetail';

export const adminRoutes = [
  <Route key="login" path="/admin/login" element={<AdminLogin />} />,
  <Route key="dash" path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />,
  <Route key="new" path="/admin/plants/new" element={<ProtectedRoute><PlantForm /></ProtectedRoute>} />,
  <Route key="view" path="/admin/plants/:id" element={<ProtectedRoute><PlantDetail /></ProtectedRoute>} />,
  <Route key="edit" path="/admin/plants/:id/edit" element={<ProtectedRoute><PlantForm /></ProtectedRoute>} />,
];
