import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import EventAnalytics from './pages/EventAnalytics';
import UserBookings from './pages/UserBookings';
import AdminEvents from './pages/AdminEvents';
import AdminUsers from './pages/AdminUsers';
import Unauthorized from './pages/Unauthorized';

const AppRoutes = () => {
  return (
    <div className="App">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 130px)' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - All Authenticated Users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Standard Users */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute requiredRole="user">
                <UserBookings />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Event Organizers */}
          <Route
            path="/my-events"
            element={
              <ProtectedRoute requiredRole="organizer">
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events/new"
            element={
              <ProtectedRoute requiredRole="organizer">
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events/analytics"
            element={
              <ProtectedRoute requiredRole="organizer">
                <EventAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes; 