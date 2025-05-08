import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchHistoryPage from './pages/SearchHistoryPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import ProfilePage from './pages/ProfilePage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import UserGuidePage from './pages/UserGuidePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  });
  
  // Set up axios interceptor for authentication
  useEffect(() => {
    // Set up axios defaults for authorization
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        if (userData && userData.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Add a request interceptor to ensure the Authorization header is set for all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        // Get the latest user data from localStorage
        const currentUserInfo = localStorage.getItem('user');
        if (currentUserInfo) {
          try {
            const currentUserData = JSON.parse(currentUserInfo);
            if (currentUserData && currentUserData.token) {
              config.headers.Authorization = `Bearer ${currentUserData.token}`;
            }
          } catch (error) {
            console.error('Error parsing user data in interceptor:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          {/* Flex container to make footer stick to bottom */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <NavBar />
            {/* Main content area with minimum height */}
            <Box 
              component="main" 
              sx={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                // Add padding to ensure content doesn't touch the edges
                pt: { xs: 2, sm: 3 },
                pb: { xs: 4, sm: 6 },
                // Ensure minimum height for sparse content pages
                minHeight: { xs: '70vh', sm: '75vh', md: '80vh' }
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/terms" element={<TermsAndConditionsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/guide" element={<UserGuidePage />} />
                <Route 
                  path="/history" 
                  element={
                    <ProtectedRoute>
                      <SearchHistoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/media/:mediaType/:id" element={<MediaDetailsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;