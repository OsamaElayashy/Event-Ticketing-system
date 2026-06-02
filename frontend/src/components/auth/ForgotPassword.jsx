import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { AUTH_ENDPOINTS } from '../../config/api.config';
import { toast } from 'react-toastify';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      setSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-form-container">
        <h2>Check Your Email</h2>
        <p>We sent a password reset link to <strong>{email}</strong>.</p>
        <p>Click the link in the email to reset your password.</p>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'error' : ''}
            placeholder="Enter your registered email"
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <button type="submit" disabled={isLoading} className="auth-button">
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="auth-footer">
          <p>Remember your password? <Link to="/login">Login here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
