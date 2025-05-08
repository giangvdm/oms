import React from 'react';
import { Container, Box } from '@mui/material';
import SearchComponent from '../components/SearchComponent';

const HomePage = () => {
  return (
    <Box 
      sx={{ 
        minHeight: { xs: '70vh', sm: '75vh', md: '80vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}
    >
      <Container maxWidth="lg">
        <SearchComponent />
      </Container>
    </Box>
  );
};

export default HomePage;