import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Mock component to render inside ProtectedRoute
const MockProtectedComponent = () => <div>Protected Content</div>;

// Helper function to render component with context
const renderProtectedRoute = (userValue = null) => {
  return render(
    <AuthContext.Provider value={{ user: userValue }}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <MockProtectedComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute Component', () => {
  test('renders children when user is authenticated', () => {
    renderProtectedRoute({ id: 'user1', name: 'Test User' });
    
    // Protected content should be visible
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Login page should not be visible
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  test('redirects to login page when user is not authenticated', () => {
    renderProtectedRoute(null);
    
    // Protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    
    // Login page should be visible
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});