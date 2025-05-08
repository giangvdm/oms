import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Divider, 
  Grid, 
  IconButton 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';

const Footer = () => {
  // Get the current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <SearchIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.primary">
                Open Media Search
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Search and discover open-licensed media content from the largest collections of Creative Commons materials.
            </Typography>
            <Box display="flex" gap={1}>
              <IconButton 
                aria-label="GitHub" 
                size="small" 
                component="a" 
                href="https://github.com/giangvdm/OpenMediaSearchWebApp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link component={RouterLink} to="/login" color="inherit" underline="hover">
                Login
              </Link>
              <Link component={RouterLink} to="/register" color="inherit" underline="hover">
                Register
              </Link>
              <Link component={RouterLink} to="/history" color="inherit" underline="hover">
                Search History
              </Link>
              <Link component={RouterLink} to="/guide" color="inherit" underline="hover">
                User Guide
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link component={RouterLink} to="/terms" color="inherit" underline="hover">
                Terms and Conditions
              </Link>
              <Link component={RouterLink} to="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="https://creativecommons.org/licenses/" target="_blank" rel="noopener" color="inherit" underline="hover">
                Licensing Information
              </Link>
              <Link component={RouterLink} to="#" color="inherit" underline="hover">
                Cookie Policy
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Open Media Search. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ at University of Lincoln
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;