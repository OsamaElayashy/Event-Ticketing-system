import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../config/api.config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get(AUTH_ENDPOINTS.CHECK_SESSION);
        setUser(response.data.user);
      } catch (error) {
        // Session is invalid or expired
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
      const { user, token } = response.data;
      setUser(user);
      if (token) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(USER_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const updateUserProfile = async (updateData) => {
    try {
      const response = await api.put(USER_ENDPOINTS.UPDATE_PROFILE, updateData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Function to refresh token (optional)
  const refreshToken = async () => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // Add axios response interceptor for token refresh (optional)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout, refreshToken]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    updateUserProfile,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};