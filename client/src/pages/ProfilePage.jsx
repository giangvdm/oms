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
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
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
  
  // State for account deletion
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
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
      // setSnackbarMessage(err.response?.data?.message || 'Failed to update password. Please try again.');
      setSnackbarMessage(err.message);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };
  
  // Handle delete account click
  const handleDeleteAccountClick = () => {
    setDeleteDialogOpen(true);
  };
  
  // Handle delete account confirmation
  const handleDeleteAccount = async () => {
    // Check if confirmation text matches "DELETE"
    if (deleteConfirmation !== "DELETE") {
      setSnackbarMessage('Please type DELETE to confirm account deletion');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }
    
    try {
      await axios.delete('/api/users/delete-account');
      
      // Close dialog
      setDeleteDialogOpen(false);
      
      // Show success message and logout user
      setSnackbarMessage('Your account has been deleted successfully');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      
      // Wait a moment to show the message before logging out
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      // setSnackbarMessage(err.response?.data?.message || 'Failed to delete account. Please try again.');
      setSnackbarMessage(err.message);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      setDeleteDialogOpen(false);
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
                    secondary="5/8/2025" // This would use the actual user creation date
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
                  startIcon={<HistoryIcon color="primary" />}
                  onClick={() => navigate('/history')}
                  sx={{ justifyContent: 'flex-start', color: '#3a86ff', textTransform: 'uppercase' }}
                >
                  SEARCH HISTORY
                </Button>
                <Button 
                  variant="text" 
                  startIcon={<SearchIcon color="primary" />}
                  onClick={() => navigate('/')}
                  sx={{ justifyContent: 'flex-start', color: '#3a86ff', textTransform: 'uppercase' }}
                >
                  NEW SEARCH
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Account Security Section - Moved up to occupy right column */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, pb: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <SecurityIcon sx={{ mr: 1, color: '#3a86ff' }} />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Account Security
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Manage your account security settings and update your password
            </Typography>
            
            <Alert 
              icon={<InfoIcon />} 
              severity="info" 
              sx={{ 
                mb: 4, 
                backgroundColor: 'rgba(33, 150, 243, 0.08)', 
                border: 'none',
                '& .MuiAlert-icon': {
                  color: '#2196f3'
                }
              }}
            >
              Keep your account secure by using a strong password and updating it regularly.
            </Alert>
            
            <Box component="form" onSubmit={handlePasswordUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    variant="outlined"
                    placeholder="Current Password *"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    variant="outlined"
                    placeholder="New Password *"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Password must be at least 6 characters
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    variant="outlined"
                    placeholder="Confirm New Password *"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{ 
                      mt: 1, 
                      bgcolor: '#3a86ff',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    UPDATE PASSWORD
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Delete Account Section */}
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <DeleteForeverIcon sx={{ mr: 1, color: '#d32f2f' }} />
                <Typography variant="h5" sx={{ fontWeight: 'medium', color: '#d32f2f' }}>
                  Delete Account
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                Once you delete your account, there is no going back. Please be certain.
              </Typography>
              
              <Alert 
                icon={<WarningIcon />} 
                severity="warning" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(237, 108, 2, 0.08)',
                  border: 'none',
                  '& .MuiAlert-icon': {
                    color: '#ed6c02'
                  } 
                }}
              >
                All your data will be permanently deleted, including your profile, search history, and preferences.
              </Alert>
              
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteForeverIcon />}
                onClick={handleDeleteAccountClick}
                sx={{ 
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                    borderColor: '#d32f2f'
                  }
                }}
              >
                DELETE MY ACCOUNT
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-account-dialog-title"
      >
        <DialogTitle id="delete-account-dialog-title" sx={{ color: '#d32f2f' }}>
          Delete Account Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Once you delete your account, all of your data will be permanently removed.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
            To confirm, please type "DELETE" in the field below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error"
            variant="contained"
            disabled={deleteConfirmation !== "DELETE"}
          >
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
      
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