import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/public/Home';
import MapPage from './pages/public/MapPage';
import VehiclesPage from './pages/public/VehiclesPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import UserBookings from './pages/user/UserBookings';
import UserWallet from './pages/user/UserWallet';
import UserTransactions from './pages/user/UserTransactions';
import UserProfile from './pages/user/UserProfile';
import RenterDashboard from './pages/renter/RenterDashboard';
import RenterFleet from './pages/renter/RenterFleet';
import RenterBookings from './pages/renter/RenterBookings';
import RenterEarnings from './pages/renter/RenterEarnings';
import AddVehicle from './pages/renter/AddVehicle';
import RenterProfile from './pages/renter/RenterProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRenters from './pages/admin/AdminRenters';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:'18px'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'renter') return <Navigate to="/renter" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/dashboard" element={<PrivateRoute roles={['user']}><UserDashboard /></PrivateRoute>} />
        <Route path="/dashboard/bookings" element={<PrivateRoute roles={['user']}><UserBookings /></PrivateRoute>} />
        <Route path="/dashboard/wallet" element={<PrivateRoute roles={['user']}><UserWallet /></PrivateRoute>} />
        <Route path="/dashboard/transactions" element={<PrivateRoute roles={['user']}><UserTransactions /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute roles={['user']}><UserProfile /></PrivateRoute>} />
        <Route path="/renter" element={<PrivateRoute roles={['renter']}><RenterDashboard /></PrivateRoute>} />
        <Route path="/renter/fleet" element={<PrivateRoute roles={['renter']}><RenterFleet /></PrivateRoute>} />
        <Route path="/renter/bookings" element={<PrivateRoute roles={['renter']}><RenterBookings /></PrivateRoute>} />
        <Route path="/renter/earnings" element={<PrivateRoute roles={['renter']}><RenterEarnings /></PrivateRoute>} />
        <Route path="/renter/add-vehicle" element={<PrivateRoute roles={['renter']}><AddVehicle /></PrivateRoute>} />
        <Route path="/renter/profile" element={<PrivateRoute roles={['renter']}><RenterProfile /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/renters" element={<PrivateRoute roles={['admin']}><AdminRenters /></PrivateRoute>} />
        <Route path="/admin/vehicles" element={<PrivateRoute roles={['admin']}><AdminVehicles /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute roles={['admin']}><AdminBookings /></PrivateRoute>} />
        <Route path="/admin/payments" element={<PrivateRoute roles={['admin']}><AdminPayments /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster position="bottom-right" toastOptions={{ duration: 3500 }} />
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
// Note: RenterProfile route is already handled by the renter menu via /renter/profile path
// The file exists at pages/renter/RenterProfile.js
