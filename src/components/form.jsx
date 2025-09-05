import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import '../styles/Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    id: uuidv4(), // Generate unique ID
    name: '',
    gender: '',
    email: '',
    phoneNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Send data to your backend API endpoint
      const response = await axios.post('http://localhost:3001/api/users', formData);

      console.log('Data sent successfully:', response.data);
      setMessage({ type: 'success', text: 'User data saved successfully!' });

      // Reset the form
      setFormData({
        id: uuidv4(), // Generate new unique ID for the next user
        name: '',
        gender: '',
        email: '',
        phoneNumber: '',
      });
    } catch (error) {
      console.error('Error sending data:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data.error || 'Failed to save user data';
        setMessage({ type: 'error', text: errorMessage });
      } else if (error.request) {
        // Request was made but no response received
        setMessage({ type: 'error', text: 'Cannot connect to server. Please make sure the server is running.' });
      } else {
        // Something else happened
        setMessage({ type: 'error', text: 'An unexpected error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [focusedField, setFocusedField] = useState('');
  const [hoveredButton, setHoveredButton] = useState(false);

  return (
    <div className="form-wrapper">
      {message.text && (
        <div className={`form-message ${message.type}`}>
          <span style={{ fontSize: '16px' }}>
            {message.type === 'success' ? '✅' : '❌'}
          </span>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
            required 
            disabled={isSubmitting}
            placeholder="Enter your full name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange}
            onFocus={() => setFocusedField('gender')}
            onBlur={() => setFocusedField('')}
            required
            disabled={isSubmitting}
            className="form-select"
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            required 
            disabled={isSubmitting}
            placeholder="Enter your email address"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input 
            type="tel" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleChange}
            onFocus={() => setFocusedField('phoneNumber')}
            onBlur={() => setFocusedField('')}
            required 
            disabled={isSubmitting}
            placeholder="Enter your phone number"
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="form-button"
        >
          {isSubmitting ? (
            <div className="button-content">
              <div className="loading-spinner"></div>
              Submitting...
            </div>
          ) : (
            'Submit Form'
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;