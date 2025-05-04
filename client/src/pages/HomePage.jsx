import React from 'react';
import { Container } from '@mui/material';
import SearchComponent from '../components/SearchComponent';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <SearchComponent />
    </Container>
  );
};

export default HomePage;