import api from './axios';

export const updateUserProfile = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const getUserBookings = async (userId) => {
  const response = await api.get(`/users/${userId}/bookings`);
  return response.data;
};