import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';

// Mock useMediaQuery to control responsive behavior
jest.mock('@mui/material/useMediaQuery', () => jest.fn());

// Helper function to render component with context
const renderNavBar = (userValue = null) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ 
        user: userValue, 
        logout: jest.fn() 
      }}>
        <NavBar />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('NavBar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders logo and app name', () => {
    renderNavBar();
    
    // Check if app name is displayed
    expect(screen.getByText('Open Media Search')).toBeInTheDocument();
  });

  test('shows login and register buttons when user is not logged in', () => {
    renderNavBar();
    
    // Check for login and register buttons
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows avatar and user menu when user is logged in', () => {
    renderNavBar({ id: 'user1', name: 'Test User', email: 'test@example.com' });
    
    // History button should be visible
    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
    
    // User avatar should be visible (checking for first letter of user name)
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  test('opens user menu when avatar is clicked', () => {
    renderNavBar({ id: 'user1', name: 'Test User', email: 'test@example.com' });
    
    // Initially menu items are not visible
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Click avatar to open menu
    const avatar = screen.getByText('T');
    fireEvent.click(avatar);
    
    // Now menu items should be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls logout function when logout is clicked', () => {
    const logoutMock = jest.fn();
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ 
          user: { id: 'user1', name: 'Test User' }, 
          logout: logoutMock 
        }}>
          <NavBar />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    // Click avatar to open menu
    fireEvent.click(screen.getByText('T'));
    
    // Click logout
    fireEvent.click(screen.getByText('Logout'));
    
    // Check if logout was called
    expect(logoutMock).toHaveBeenCalled();
  });
});