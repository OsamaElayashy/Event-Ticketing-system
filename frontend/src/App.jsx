import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import UnauthorizedPage from './components/common/UnauthorizedPage';

// Event Components
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';
import MyEventsPage from './components/events/MyEventsPage';
import EventForm from './components/events/EventForm';
import AdminEventsPage from './components/events/AdminEventsPage';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';

// Add these imports
import ToastProvider from './components/common/Toast';
import UserBookingsPage from './pages/UserBookingsPage';
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
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Event Routes */}
                <Route path="/events" element={<EventList />} />
                <Route path="/events/new" element={<EventForm />} />
                <Route path="/events/:id" element={<EventDetails />} />

                {/* User Bookings Routes */}
                <Route path="/bookings" element={<PrivateRoute roles={['user']} />}> 
                  <Route index element={<UserBookingsPage />} />
                  <Route path=":id" element={<BookingDetails />} />
                </Route>
                
                {/* Profile Route - Accessible to all authenticated users */}
                <Route path="/profile" element={<PrivateRoute />}>
                  <Route index element={<ProfilePage />} />
                </Route>
                
                {/* Organizer-only Routes */}
                <Route path="/my-events" element={<PrivateRoute roles={['organizer']} />}> 
                  <Route index element={<MyEventsPage />} />
                  <Route path="new" element={<EventForm />} />
                  <Route path=":id/edit" element={<EventForm isEditing />} />
                </Route>
                
                {/* Admin-only Routes */}
                <Route path="/admin/events" element={<PrivateRoute roles={['admin']} />}> 
                  <Route index element={<AdminEventsPage />} />
                </Route>
                
                {/* Default Protected Route */}
                <Route path="/" element={<PrivateRoute />}> 
                  <Route index element={<HomePage />} />
                </Route>
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