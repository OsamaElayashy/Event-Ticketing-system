import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import UnauthorizedPage from './components/common/UnauthorizedPage';
import ToastProvider from './components/common/Toast';

// Event Components
import EventDetails from './components/events/EventDetails';
import MyEventsPage from './components/events/MyEventsPage';
import EventForm from './components/events/EventForm';
import AdminEventsPage from './components/events/AdminEventsPage';

// Admin
import AdminUsersPage from './components/admin/AdminUsersPage';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import UserBookingsPage from './pages/UserBookingsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Booking
import BookingDetails from './components/booking/BookingDetails';

import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
      <Router>
        <AuthProvider>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Default Home - requires login */}
              <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />

              {/* Events - accessible to all logged-in users */}
              <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />

              {/* Bookings - StandardUser */}
              <Route path="/bookings" element={<PrivateRoute roles={['StandardUser']}><UserBookingsPage /></PrivateRoute>} />
              <Route path="/bookings/:id" element={<PrivateRoute roles={['StandardUser']}><BookingDetails /></PrivateRoute>} />

              {/* Profile - all authenticated users */}
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

              {/* Organizer Routes */}
              <Route path="/my-events" element={<PrivateRoute roles={['Organizer']}><MyEventsPage /></PrivateRoute>} />
              <Route path="/my-events/new" element={<PrivateRoute roles={['Organizer']}><EventForm /></PrivateRoute>} />
              <Route path="/my-events/:id/edit" element={<PrivateRoute roles={['Organizer']}><EventForm isEditing /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/events" element={<PrivateRoute roles={['Admin']}><AdminEventsPage /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute roles={['Admin']}><AdminUsersPage /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
