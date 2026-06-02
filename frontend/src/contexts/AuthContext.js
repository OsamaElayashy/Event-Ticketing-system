import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../config/api.config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get(AUTH_ENDPOINTS.CHECK_SESSION);
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    const { user: loggedInUser } = response.data;
    setUser(loggedInUser);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // ignore
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const updateUserProfile = async (updateData) => {
    const response = await api.put(USER_ENDPOINTS.UPDATE_PROFILE, updateData);
    const updatedUser = response.data;
    setUser(updatedUser);
    return updatedUser;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    currentUser: user, // alias for backward compat
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    updateUserProfile,
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

export { AuthContext };
