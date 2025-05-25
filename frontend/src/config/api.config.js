// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  CHECK_SESSION: '/auth/check-session',
  REFRESH_TOKEN: '/auth/refresh-token'
};

// User endpoints
export const USER_ENDPOINTS = {
  REGISTER: '/users/register',
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  ALL_USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  UPDATE_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,
  FORGOT_PASSWORD: '/users/forgot-password',
  VERIFY_RESET_CODE: '/users/verify-reset-code',
  RESET_PASSWORD: '/users/reset-password'
};

// Event endpoints
export const EVENT_ENDPOINTS = {
  ALL_EVENTS: '/events',
  ADMIN_EVENTS: '/events/admin',
  EVENT_BY_ID: (id) => `/events/${id}`,
  CREATE_EVENT: '/events',
  UPDATE_EVENT: (id) => `/events/${id}`,
  DELETE_EVENT: (id) => `/events/${id}`,
  APPROVE_EVENT: (id) => `/events/${id}/approve`,
  REJECT_EVENT: (id) => `/events/${id}/reject`
};

// Booking endpoints
export const BOOKING_ENDPOINTS = {
  CREATE_BOOKING: '/bookings',
  USER_BOOKINGS: '/bookings/user',
  EVENT_BOOKINGS: (eventId) => `/bookings/event/${eventId}`,
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  CANCEL_BOOKING: (id) => `/bookings/${id}/cancel`
}; 