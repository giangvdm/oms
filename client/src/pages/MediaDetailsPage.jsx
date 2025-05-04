import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  CircularProgress,
  Alert,
  Breadcrumbs
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getMediaDetails } from '../services/searchService';

const MediaDetailsPage = () => {
  const { id, mediaType } = useParams();
  const [mediaDetails, setMediaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMediaDetails(id, mediaType);
        setMediaDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching media details:', err);
        setError('Failed to load media details. The item may not exist or there was a network issue.');
        setLoading(false);
      }
    };
    
    if (id && mediaType) {
      fetchMediaDetails();
    }
    
    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [id, mediaType]);
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Search
        </Button>
      </Container>
    );
  }
  
  if (!mediaDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          Media details not found.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Search
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={() => navigate('/', { state: { mediaType } })} sx={{ cursor: 'pointer' }}>
          {mediaType === 'images' ? 'Images' : 'Audio'}
        </Link>
        <Typography color="text.primary">{mediaDetails.title || 'Details'}</Typography>
      </Breadcrumbs>
      
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <Grid container>
          {/* Media Preview */}
          <Grid item xs={12} md={mediaType === 'images' ? 8 : 12}>
            {mediaType === 'images' ? (
              <Box 
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.03)', 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                  height: '100%'
                }}
              >
                <img 
                  src={mediaDetails.url} 
                  alt={mediaDetails.title} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '500px', 
                    objectFit: 'contain' 
                  }} 
                />
              </Box>
            ) : (
              <Box 
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.03)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                  minHeight: '300px'
                }}
              >
                <audio
                  ref={audioRef}
                  src={mediaDetails.url}
                  onEnded={handleAudioEnded}
                  style={{ display: 'none' }}
                />
                <IconButton
                  onClick={toggleAudio}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    mb: 2
                  }}
                >
                  {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  {mediaDetails.title || 'Audio File'}
                </Typography>
                {mediaDetails.duration && (
                  <Typography variant="body2" color="text.secondary">
                    Duration: {Math.floor(mediaDetails.duration / 60)}:{String(Math.floor(mediaDetails.duration % 60)).padStart(2, '0')}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
          
          {/* Media Info */}
          <Grid item xs={12} md={mediaType === 'images' ? 4 : 12}>
            <Box p={3}>
              <Typography variant="h5" gutterBottom>
                {mediaDetails.title || 'Untitled'}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={mediaDetails.license || 'Unknown License'} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
                {mediaDetails.license_version && (
                  <Chip 
                    label={`v${mediaDetails.license_version}`} 
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Creator
              </Typography>
              <Typography variant="body1" paragraph>
                {mediaDetails.creator || 'Unknown'}
              </Typography>
              
              {mediaDetails.description && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {mediaDetails.description}
                  </Typography>
                </>
              )}
              
              {mediaDetails.tags && mediaDetails.tags.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {mediaDetails.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag.name || tag} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </Box>
                </>
              )}
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button 
                  variant="contained" 
                  component="a" 
                  href={mediaDetails.url} 
                  target="_blank"
                  download
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
                
                {mediaDetails.source && (
                  <Button 
                    variant="outlined" 
                    component="a" 
                    href={mediaDetails.source} 
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LaunchIcon />}
                  >
                    View Source
                  </Button>
                )}
              </Box>
              
              {mediaDetails.attribution && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attribution
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2" component="div">
                      <div dangerouslySetInnerHTML={{ __html: mediaDetails.attribution }} />
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MediaDetailsPage;