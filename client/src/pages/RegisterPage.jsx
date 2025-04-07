import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email address is invalid';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/\d/.test(value)) error = 'Password must include at least one number';
        else if (!/[a-zA-Z]/.test(value)) error = 'Password must include at least one letter';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate on change
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };
    
    // Validate all fields
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      const res = await axios.post('/api/users', form);
      setMessage('Registration successful!');
      // Reset form after successful registration
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error during registration.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="Name" 
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Email" 
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Password" 
            name="password" 
            type="password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
        {message && <Typography sx={{ mt: 2 }} color={message.includes('Error') ? 'error' : 'success'}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default RegisterPage;
