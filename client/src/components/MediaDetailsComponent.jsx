import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Link,
  Grid,
  IconButton,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import { getMediaDetails } from '../services/searchService';

const MediaDetailsComponent = ({ mediaId, mediaType, onClose }) => {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMediaDetails(mediaId, mediaType);
        setMediaDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching media details:', err);
        setError('Failed to load media details');
        setLoading(false);
      }
    };
    
    if (mediaId) {
      fetchMediaDetails();
    }
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [mediaId, mediaType]);
  
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
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  if (!mediaDetails) {
    return (
      <Box p={2}>
        <Typography>No details available.</Typography>
      </Box>
    );
  }
  
  return (
    <Card>
      {mediaType === 'images' ? (
        <CardMedia
          component="img"
          image={mediaDetails.url || mediaDetails.thumbnail}
          alt={mediaDetails.title}
          sx={{ 
            maxHeight: '500px',
            objectFit: 'contain',
            backgroundColor: 'rgba(0,0,0,0.03)'
          }}
        />
      ) : (
        <Box 
          p={4} 
          display="flex" 
          flexDirection="column" 
          alignItems="center"
          bgcolor="rgba(0,0,0,0.03)"
        >
          <audio
            ref={audioRef}
            src={mediaDetails.url}
            onEnded={handleAudioEnded}
            style={{ display: 'none' }}
          />
          <IconButton
            onClick={toggleAudio}
            size="large"
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' } 
            }}
          >
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
          <Typography variant="body2" mt={2}>
            {mediaDetails.duration ? 
              `Duration: ${Math.floor(mediaDetails.duration / 60)}:${String(Math.floor(mediaDetails.duration % 60)).padStart(2, '0')}` 
              : 'Audio File'}
          </Typography>
        </Box>
      )}
      
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {mediaDetails.title || 'Untitled'}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {mediaDetails.description && (
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
                <Typography variant="body2">{mediaDetails.description}</Typography>
              </Box>
            )}
            
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">Creator</Typography>
              <Typography variant="body2">{mediaDetails.creator || 'Unknown'}</Typography>
            </Box>
            
            {mediaDetails.tags && mediaDetails.tags.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">Tags</Typography>
                <Box mt={1}>
                  {mediaDetails.tags.map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag.name || tag} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>License Information</Typography>
              <Typography variant="body2" gutterBottom>
                {mediaDetails.license || 'Unknown License'}
              </Typography>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>Actions</Typography>
                
                <Box display="flex" flexDirection="column" gap={1}>
                  <Link 
                    href={mediaDetails.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                  >
                    <DownloadIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Download
                  </Link>
                  
                  {mediaDetails.source && (
                    <Link 
                      href={mediaDetails.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      display="flex"
                      alignItems="center"
                    >
                      <LaunchIcon fontSize="small" sx={{ mr: 0.5 }} />
                      View Original Source
                    </Link>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}