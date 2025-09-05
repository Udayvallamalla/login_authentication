import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Form from './form';
import UserList from './UserList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('form');
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with user info and logout */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">User Management System</h1>
            <p className="dashboard-subtitle">Manage your users with ease and style</p>
          </div>
          
          <div className="dashboard-user-section">
            <div className="dashboard-user-info">
              <div className="dashboard-user-avatar">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="dashboard-user-details">
                <span className="dashboard-user-name">
                  {user?.fullName || user?.username}
                </span>
                <span className="dashboard-user-role">Administrator</span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="dashboard-logout-btn"
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <div className="dashboard-tabs">
          <button 
            onClick={() => setActiveTab('form')}
            className={`dashboard-tab ${activeTab === 'form' ? 'active' : 'inactive'}`}
          >
            ➕ Add User
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`dashboard-tab ${activeTab === 'list' ? 'active' : 'inactive'}`}
          >
            👥 View Users
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'form' && (
          <div className="dashboard-content-wrapper form-content">
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Add New User</h2>
              <Form />
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="dashboard-content-wrapper list-content">
            <div className="dashboard-section">
              <UserList />
            </div>
          </div>
        )}
      </div>

      {/* Welcome Message for new users */}
      {user?.lastLogin === null && (
        <div className="dashboard-welcome-banner">
          <div className="dashboard-welcome-content">
            <h3>🎉 Welcome to the User Management System!</h3>
            <p>This is your first time logging in. Start by adding some users or exploring the features.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;