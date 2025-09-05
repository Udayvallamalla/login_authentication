import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3001/api/users/${userId}`);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter(user => 
          user.id.toLowerCase().includes(searchId.toLowerCase())
        ));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  // Search functionality
  const handleSearch = (searchValue) => {
    setSearchId(searchValue);
    if (searchValue.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.id.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setFilteredUsers(users);
  };

  if (loading) return (
    <div className="loading-message">
      <div className="loading-spinner"></div>
      <p>Loading users...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-message">
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
      <p>{error}</p>
      <button onClick={fetchUsers} className="form-button" style={{ marginTop: '16px' }}>
        Try Again
      </button>
    </div>
  );



  return (
    <div className="user-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 className="user-list-title">All Users</h2>
        <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
          {filteredUsers.length} of {users.length} {users.length === 1 ? 'User' : 'Users'}
        </div>
      </div>

      {/* Search Section */}
      <div className="search-container" style={{ marginBottom: '20px' }}>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchId}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
            style={{
              padding: '10px 14px',
              fontSize: '14px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: '#ffffff',
              fontFamily: 'inherit',
              width: '100%',
              maxWidth: '300px'
            }}
          />
          {searchId && (
            <button
              onClick={clearSearch}
              className="clear-search-btn"
              style={{
                marginLeft: '10px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                border: '2px solid #e1e5e9',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
        {searchId && filteredUsers.length === 0 && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px', fontStyle: 'italic' }}>
            No users found with ID containing "{searchId}"
          </p>
        )}
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: '0.5' }}>👥</div>
          <p style={{ fontSize: '1.2rem', fontWeight: '500', margin: '0' }}>No users found</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
            Add your first user to get started!
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users">
          <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: '0.5' }}>🔍</div>
          <p style={{ fontSize: '1.2rem', fontWeight: '500', margin: '0' }}>No matching users found</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
            Try searching with a different ID or clear the search filter.
          </p>
        </div>
      ) : (
        <div className="user-list-container">
          <table className="users-table">
            <thead className="table-header">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="user-id" title={user.id}>{user.id}</td>
                  <td className="user-name">{user.name}</td>
                  <td>
                    <span className={`user-gender gender-${user.gender}`}>
                      {user.gender}
                    </span>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-phone">{user.phoneNumber}</td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="form-button"
                      style={{ 
                        backgroundColor: '#ef4444', 
                        padding: '6px 12px', 
                        fontSize: '11px',
                        margin: '0'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button 
        onClick={fetchUsers}
        className="form-button"
        style={{ 
          marginTop: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          margin: '20px auto 0'
        }}
      >
        🔄 Refresh List
      </button>
    </div>
  );
};

export default UserList;