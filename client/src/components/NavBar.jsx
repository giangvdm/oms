import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Open Media Search
        </Typography>

        <Box>
          <Button component={RouterLink} to="/login" color="inherit">
            Login
          </Button>
          <Button component={RouterLink} to="/register" color="inherit">
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
