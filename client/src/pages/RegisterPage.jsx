import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users', form);
      setMessage('Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error during registration.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Register</Button>
        </form>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default RegisterPage;
