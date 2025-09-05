import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        password: formData.password,
        email: formData.email || undefined,
        fullName: formData.fullName || undefined
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration successful! You can now sign in.' });
        // Clear form
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          fullName: ''
        });
        // Switch to login after a delay
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Sign up for a new account</p>
        </div>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            <span className="auth-message-icon">
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Choose a username"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your full name (optional)"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your email (optional)"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Create a password (min 6 characters)"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Confirm your password"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-button"
          >
            {isSubmitting ? (
              <div className="auth-button-content">
                <div className="auth-loading-spinner"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="auth-switch-button"
              disabled={isSubmitting}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;