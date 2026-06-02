export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  CHECK_SESSION: '/auth/check-session',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET: (token) => `/auth/verify-reset/${token}`,
  RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
};

export const USER_ENDPOINTS = {
  GET_PROFILE: '/users/current',
  UPDATE_PROFILE: '/users/me',
  ALL_USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  UPDATE_USER: (id) => `/users/${id}`,
  DELETE_USER: (id) => `/users/${id}`,
  ADMIN_STATS: '/users/stats/admin',
  ORGANIZER_STATS: '/users/stats/organizer',
  USER_STATS: '/users/stats/user',
  USER_BOOKINGS: '/users/bookings',
  USER_EVENTS: '/users/events',
};

export const EVENT_ENDPOINTS = {
  ALL_EVENTS: '/events/',
  MY_EVENTS: '/events/my-events',
  ADMIN_EVENTS: '/events/all',
  EVENT_BY_ID: (id) => `/events/${id}`,
  CREATE_EVENT: '/events',
  UPDATE_EVENT: (id) => `/events/${id}`,
  DELETE_EVENT: (id) => `/events/${id}`,
  APPROVE_EVENT: (id) => `/events/admin/${id}/approve`,
  REJECT_EVENT: (id) => `/events/admin/${id}/reject`,
};

export const BOOKING_ENDPOINTS = {
  CREATE_BOOKING: '/bookings',
  USER_BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  CANCEL_BOOKING: (id) => `/bookings/${id}`,
};
