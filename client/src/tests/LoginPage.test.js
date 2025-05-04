import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('LoginPage', () => {
  const loginMock = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: loginMock }}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  test('renders login form', () => {
    renderLoginPage();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form and handles successful login', async () => {
    const mockUserData = { id: 'user1', name: 'Test User', email: 'test@example.com' };
    
    axios.post.mockResolvedValue({ data: { user: mockUserData } });
    
    renderLoginPage();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
    // Wait for the login to be processed
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(loginMock).toHaveBeenCalledWith(mockUserData);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message on login failure', async () => {
    // Mock a failed login
    axios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });
    
    renderLoginPage();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    
    // Wait for the error message
    const errorMessage = await screen.findByText('Invalid credentials');
    expect(errorMessage).toBeInTheDocument();
  });
});