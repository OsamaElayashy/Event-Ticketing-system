import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForms.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { sendResetCode, resetPassword } = useAuth();

  const validateEmail = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = () => {
    const newErrors = {};
    if (!resetCode) newErrors.resetCode = 'Reset code is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await sendResetCode(email);
      setIsCodeSent(true);
      toast.success('Reset code sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateResetForm()) return;

    setIsLoading(true);
    try {
      await resetPassword(email, resetCode, newPassword);
      toast.success('Password reset successful! Please login with your new password.');
      // Redirect to login page after successful reset
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="brand-title">EventTick</h1>
        <p className="welcome-text">
          {!isCodeSent 
            ? 'Enter your email to reset your password'
            : 'Enter the reset code sent to your email'
          }
        </p>
      </div>

      <form onSubmit={isCodeSent ? handleResetPassword : handleSendCode} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              disabled={isCodeSent}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        {isCodeSent && (
          <>
            <div className="form-group">
              <label htmlFor="resetCode">Reset Code</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="resetCode"
                  placeholder="Enter the 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className={errors.resetCode ? 'error' : ''}
                  maxLength={6}
                />
                {errors.resetCode && <span className="error-message">{errors.resetCode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Create a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={errors.newPassword ? 'error' : ''}
                />
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>
            </div>
          </>
        )}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            isCodeSent ? 'Reset Password' : 'Send Reset Code'
          )}
        </button>

        <div className="auth-prompt">
          <p>
            Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm; 