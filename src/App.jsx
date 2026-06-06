import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import SetupAdmin from './pages/SetupAdmin';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute><Payment /></ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute><Admin /></AdminRoute>
                }
              />
              <Route
                path="/setup-admin"
                element={
                  <ProtectedRoute><SetupAdmin /></ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </DataProvider>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}
