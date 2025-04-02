import React from 'react';
import { Box, Typography, Container, TextField, Button, Stack } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Open Media Search
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Discover open-license images and audio with a simple search.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Search media..."
          variant="outlined"
        />
        <Button variant="contained" size="large">
          Search
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
        Powered by <a href="https://openverse.org" target="_blank" rel="noopener noreferrer">Openverse API</a>
      </Typography>
    </Container>
  );
};

export default HomePage;
