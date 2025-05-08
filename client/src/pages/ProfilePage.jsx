import React, { useContext, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  fontSize: '3rem'
}));

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Handle password change
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbarMessage('New passwords do not match');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setSnackbarMessage('Password must be at least 6 characters');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }
    
    try {
      await axios.post(`/api/users/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // For now, just show a success message
      setSnackbarMessage('Password updated successfully!');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setSnackbarMessage(err.response?.data?.message || 'Failed to update password. Please try again.');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Get the first letter of the user's name for the avatar
  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <ProfileAvatar>{getInitial()}</ProfileAvatar>
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Log Out
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Name" secondary={user?.name} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user?.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Member Since" 
                    secondary={new Date().toLocaleDateString()} // This would use the actual user creation date
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="text" 
                  startIcon={<HistoryIcon />}
                  onClick={() => navigate('/history')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Search History
                </Button>
                <Button 
                  variant="text" 
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  New Search
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Account Security Section - Moved up to occupy right column */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <SecurityIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5" gutterBottom>
                Account Security
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your account security settings and update your password
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Keep your account secure by using a strong password and updating it regularly.
            </Alert>
            
            <Box component="form" onSubmit={handlePasswordUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    helperText="Password must be at least 6 characters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;