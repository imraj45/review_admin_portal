import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ReviewsPage from './pages/ReviewsPage'
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/reviews" replace />,
  },
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/register',
    element: <PublicRoute><RegisterPage /></PublicRoute>,
  },
  {
    path: '/forgot-password',
    element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
  },
  {
    path: '/reset-password',
    element: <PublicRoute><ResetPasswordPage /></PublicRoute>,
  },
  {
    path: '/reviews',
    element: <ProtectedRoute><ReviewsPage /></ProtectedRoute>,
  },
])

export default router
