import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

// Test component that uses the AuthContext
const TestComponent = () => {
  const { user, login, logout } = useContext(AuthContext);
  
  return (
    <div>
      {user ? (
        <>
          <div data-testid="user-name">{user.name}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ id: 'test-user', name: 'Test User' })}>
          Login
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('provides null user when not logged in', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // User should not be logged in initially
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  test('loads user from localStorage if present', () => {
    // Set user in localStorage
    localStorage.setItem('user', JSON.stringify({ id: 'stored-user', name: 'Stored User' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // User should be loaded from localStorage
    expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User');
  });
  
  test('login function updates user state and localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially not logged in
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    
    // Click login button
    act(() => {
      screen.getByRole('button', { name: /login/i }).click();
    });
    
    // Now user should be logged in
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    
    // Check if localStorage was updated
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      id: 'test-user',
      name: 'Test User'
    });
  });
  
  test('logout function clears user state and localStorage', () => {
    // Start with logged in user
    localStorage.setItem('user', JSON.stringify({ id: 'test-user', name: 'Test User' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially logged in
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    
    // Mock window.location.reload
    const originalReload = window.location.reload;
    window.location.reload = jest.fn();
    
    // Click logout button
    act(() => {
      screen.getByRole('button', { name: /logout/i }).click();
    });
    
    // Check if localStorage was cleared
    expect(localStorage.getItem('user')).toBeNull();
    
    // Check if page reload was called
    expect(window.location.reload).toHaveBeenCalled();
    
    // Restore original reload function
    window.location.reload = originalReload;
  });
});