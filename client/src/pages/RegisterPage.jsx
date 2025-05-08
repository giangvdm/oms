import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper,
  Alert,
  Divider,
  Link
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ConsentSection from '../components/ConsentSection';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  
  const [consent, setConsent] = useState({
    dataConsent: false,
    termsConsent: false
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== form.password) error = 'Passwords do not match';
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

  const handleConsentChange = (name, checked) => {
    setConsent({
      ...consent,
      [name]: checked
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      name: '', 
      email: '', 
      password: '',
      confirmPassword: '' 
    };
    
    // Validate all fields
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    
    // Check consent checkboxes
    if (!consent.dataConsent || !consent.termsConsent) {
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    // Validate all fields before submission
    if (!validateForm()) {
      setMessage('Please correct the errors before submitting.');
      setMessageType('error');
      return;
    }
    
    try {
      // Prepare data for API
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password
      };
      
      const res = await axios.post('/api/users', userData);
      setMessage('Registration successful! You can now log in.');
      setMessageType('success');
      
      // Reset form after successful registration
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
      setConsent({ dataConsent: false, termsConsent: false });
      setAttemptedSubmit(false);
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error during registration. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          Sign up to search and save open-licensed media
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {message && (
          <Alert severity={messageType} sx={{ mt: 2, mb: 2 }}>
            {message}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="Full Name" 
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          
          <TextField 
            fullWidth 
            margin="normal" 
            label="Email Address" 
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
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
            helperText={errors.password || "Must be at least 6 characters with at least one number"}
            required
          />
          
          <TextField 
            fullWidth 
            margin="normal" 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
          />
          
          <ConsentSection 
            dataConsent={consent.dataConsent}
            termsConsent={consent.termsConsent}
            onConsentChange={handleConsentChange}
            showErrors={attemptedSubmit}
          />
          
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth 
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;