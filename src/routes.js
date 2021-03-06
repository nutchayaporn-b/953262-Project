import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import OrderManagement from './pages/OrderManagement';
import PaymentManagement from './pages/PaymentManagement';
import NotFound from './pages/Page404';
import { useAuth } from './context/AuthContext';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/customer',
      element: <DashboardLayout />,
      children: [
        { path: 'order', element: <Products /> },
        { path: 'checkout', element: <Blog /> },
      ],
    },
    {
      path: '/kitchen',
      element: <DashboardLayout />,
      children: [
        { path: 'order', element: <OrderManagement /> },
        { path: 'payment', element: <PaymentManagement /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: 'dashboard', element: <DashboardLayout />, children: [{ path: '', element: <DashboardApp /> }] },
        { path: 'auth/login', element: <Login /> },
        { path: 'auth/register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
