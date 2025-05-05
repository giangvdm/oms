import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/users/login', formData);
      
      console.log('Login response:', res.data); // Add this for debugging
      
      // Check if the response format has token and user separately
      if (res.data.token && res.data.user) {
        // Combine token and user into one object
        const userData = {
          ...res.data.user,
          token: res.data.token
        };
        login(userData);
      } else if (res.data.user && res.data.user.token) {
        // If token is already part of user object
        login(res.data.user);
      } else {
        // Unexpected response format
        throw new Error('Invalid response format');
      }
      
      // Navigate to home page on successful login
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message)
      // setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
