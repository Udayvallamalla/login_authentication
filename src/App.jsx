import React from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

// Loading component
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p style={{ color: '#374151', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
        Loading...
      </p>
    </div>
  </div>
);

// Main App Content
const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
