// Remove the automatic search triggered by key presses by modifying the SearchComponent.jsx file

import React, { useState, useContext, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { AuthContext } from '../context/AuthContext';
import { searchMedia, getSearchHistory, deleteSearch } from '../services/searchService';
import { debounce } from 'lodash';

// Memoized Media Item Component to prevent unnecessary re-renders
const MediaItem = memo(({ item, mediaType, handleMediaClick, currentAudio, isPlaying, toggleAudioPlayback }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {mediaType === 'images' ? (
        <CardMedia
          component="img"
          height="200"
          image={item.thumbnail || item.url}
          alt={item.title}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleMediaClick(item)}
        />
      ) : (
        <Box 
          height="200" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bgcolor="rgba(0,0,0,0.05)"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleMediaClick(item)}
        >
          <IconButton
            size="large"
            onClick={(e) => {
              e.stopPropagation();
              toggleAudioPlayback(item);
            }}
          >
            {currentAudio && currentAudio.id === item.id && isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </IconButton>
          <Typography variant="body2" color="text.secondary" align="center">
            {item.duration ? `${Math.floor(item.duration / 60)}:${String(Math.floor(item.duration % 60)).padStart(2, '0')}` : 'Audio'}
          </Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {item.title || 'Untitled'}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          By {item.creator || 'Unknown'}
        </Typography>
        <Box mt={1}>
          <Chip 
            label={item.license || 'Unknown License'} 
            size="small" 
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
});

// Memoized Filter Section to prevent re-renders when other state changes
const FilterSection = memo(({ filters, handleFilterChange, showFilters }) => {
  if (!showFilters) return null;
  
  return (
    <Box mt={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
      <Typography variant="h6" gutterBottom>Advanced Filters</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Creator"
            name="creator"
            value={filters.creator}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Title contains"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Tags"
            name="tags"
            value={filters.tags}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            helperText="Comma-separated values"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>License</InputLabel>
            <Select
              name="license"
              value={filters.license}
              label="License"
              onChange={handleFilterChange}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="CC0">CC0</MenuItem>
              <MenuItem value="CC-BY">CC-BY</MenuItem>
              <MenuItem value="CC-BY-SA">CC-BY-SA</MenuItem>
              <MenuItem value="CC-BY-ND">CC-BY-ND</MenuItem>
              <MenuItem value="CC-BY-NC">CC-BY-NC</MenuItem>
              <MenuItem value="CC-BY-NC-SA">CC-BY-NC-SA</MenuItem>
              <MenuItem value="CC-BY-NC-ND">CC-BY-NC-ND</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
});

// Memoized SearchResults Component
const SearchResults = memo(({ 
  results, 
  loading, 
  query, 
  mediaType, 
  totalPages, 
  page, 
  handlePageChange, 
  handleMediaClick, 
  currentAudio, 
  isPlaying, 
  toggleAudioPlayback 
}) => {
  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (results.length === 0) {
    if (query !== '') {
      return (
        <Typography variant="body1" textAlign="center" py={4}>
          No results found. Try different search terms or filters.
        </Typography>
      );
    }
    return null;
  }
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {results.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <MediaItem 
              item={item} 
              mediaType={mediaType}
              handleMediaClick={handleMediaClick}
              currentAudio={currentAudio}
              isPlaying={isPlaying}
              toggleAudioPlayback={toggleAudioPlayback}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </>
  );
});

// Main SearchComponent with optimizations
const SearchComponent = () => {
  // State for search
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('images');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    license: '',
    licenseType: '',
    creator: '',
    tags: '',
    title: ''
  });
  
  // State for audio player
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);
  
  // State for history
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // State for media details
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaDetails, setShowMediaDetails] = useState(false);
  
  const { user } = useContext(AuthContext);
  
  // Load search history when component mounts
  useEffect(() => {
    if (user) {
      loadSearchHistory();
    }
  }, [user]);
  
  // Audio player functionality
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudio]);
  
  // Handle audio end
  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const loadSearchHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setHistoryLoading(true);
      const response = await getSearchHistory();
      setSearchHistory(response.data);
      setHistoryLoading(false);
    } catch (err) {
      console.error('Error loading search history:', err);
      setHistoryLoading(false);
    }
  }, [user]);
  
  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await searchMedia(query, {
        mediaType,
        page,
        pageSize: 20,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });
      
      setResults(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 20));
      setLoading(false);
      
      // Refresh search history if user is logged in
      if (user) {
        loadSearchHistory();
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching');
      setLoading(false);
    }
  }, [query, mediaType, filters, page, user, loadSearchHistory]);
  
  // Update filters without debouncing or triggering search
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
    
    // Explicitly trigger a new search when page changes
    const doPageSearch = async () => {
      if (!query.trim()) return;
      
      try {
        setLoading(true);
        setError('');
        
        const response = await searchMedia(query, {
          mediaType,
          page: value, // Use the new page value
          pageSize: 20,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
        });
        
        setResults(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 20));
        setLoading(false);
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching');
        setLoading(false);
      }
    };
    
    doPageSearch();
  }, [query, mediaType, filters]);
  
  const handleDeleteSearch = useCallback(async (id) => {
    try {
      await deleteSearch(id);
      loadSearchHistory();
    } catch (err) {
      console.error('Error deleting search:', err);
    }
  }, [loadSearchHistory]);
  
  const handleHistoryItemClick = useCallback((historyItem) => {
    setQuery(historyItem.query);
    setMediaType(historyItem.mediaType);
    
    // Apply saved filters if any
    if (historyItem.filters) {
      setFilters({
        license: historyItem.filters.license || '',
        licenseType: historyItem.filters.licenseType || '',
        creator: historyItem.filters.creator || '',
        tags: historyItem.filters.tags || '',
        title: historyItem.filters.title || ''
      });
    }
    
    setShowHistory(false);
    setPage(1); // Reset to first page
    
    // Don't automatically search here - require the user to click the search button
  }, []);
  
  const handleMediaClick = useCallback((media) => {
    setSelectedMedia(media);
    setShowMediaDetails(true);
  }, []);
  
  const toggleAudioPlayback = useCallback((audio) => {
    if (currentAudio && currentAudio.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  }, [currentAudio, isPlaying]);
  
  // Memoize the search history dialog to prevent re-renders
  const SearchHistoryDialog = useMemo(() => {
    return (
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Search History
          <IconButton
            aria-label="close"
            onClick={() => setShowHistory(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {historyLoading ? (
            <Box textAlign="center" py={2}>
              <CircularProgress />
            </Box>
          ) : searchHistory.length > 0 ? (
            <Box>
              {searchHistory.map((item) => (
                <Box 
                  key={item._id} 
                  p={2} 
                  mb={1} 
                  border="1px solid #e0e0e0" 
                  borderRadius={1}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box onClick={() => handleHistoryItemClick(item)} sx={{ cursor: 'pointer', flexGrow: 1 }}>
                    <Typography variant="subtitle1">
                      {item.query}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.mediaType} • {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDeleteSearch(item._id)} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" textAlign="center" py={2}>
              No search history yet.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }, [showHistory, historyLoading, searchHistory, handleHistoryItemClick, handleDeleteSearch]);
  
  // Memoize the media details dialog
  const MediaDetailsDialog = useMemo(() => {
    return (
      <Dialog
        open={showMediaDetails}
        onClose={() => setShowMediaDetails(false)}
        fullWidth
        maxWidth="md"
      >
        {selectedMedia && (
          <>
            <DialogTitle>
              {selectedMedia.title || 'Untitled'}
              <IconButton
                aria-label="close"
                onClick={() => setShowMediaDetails(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={mediaType === 'images' ? 8 : 12}>
                  {mediaType === 'images' ? (
                    <img 
                      src={selectedMedia.url || selectedMedia.thumbnail} 
                      alt={selectedMedia.title} 
                      style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                    />
                  ) : (
                    <Box 
                      p={3} 
                      textAlign="center" 
                      border="1px solid #e0e0e0"
                      borderRadius={1}
                    >
                      <IconButton
                        size="large"
                        onClick={() => toggleAudioPlayback(selectedMedia)}
                      >
                        {currentAudio && currentAudio.id === selectedMedia.id && isPlaying ? (
                          <PauseIcon sx={{ fontSize: 60 }} />
                        ) : (
                          <PlayArrowIcon sx={{ fontSize: 60 }} />
                        )}
                      </IconButton>
                      <Typography variant="body1">
                        {selectedMedia.title || 'Untitled Audio'}
                      </Typography>
                      {selectedMedia.duration && (
                        <Typography variant="body2" color="text.secondary">
                          Duration: {Math.floor(selectedMedia.duration / 60)}:{String(Math.floor(selectedMedia.duration % 60)).padStart(2, '0')}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={mediaType === 'images' ? 4 : 12}>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Creator:</strong> {selectedMedia.creator || 'Unknown'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>License:</strong> {selectedMedia.license || 'Unknown'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Source:</strong>{' '}
                    <a href={selectedMedia.source || selectedMedia.url} target="_blank" rel="noopener noreferrer">
                      View Original
                    </a>
                  </Typography>
                  {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                    <>
                      <Typography variant="body1" gutterBottom>
                        <strong>Tags:</strong>
                      </Typography>
                      <Box>
                        {selectedMedia.tags.map((tag, index) => (
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
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button component="a" href={selectedMedia.url} target="_blank" rel="noopener noreferrer">
                Download
              </Button>
              <Button onClick={() => setShowMediaDetails(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  }, [showMediaDetails, selectedMedia, mediaType, toggleAudioPlayback, currentAudio, isPlaying]);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Audio player */}
      {currentAudio && (
        <audio
          ref={audioRef}
          src={currentAudio.url}
          onEnded={handleAudioEnd}
          style={{ display: 'none' }}
        />
      )}
      
      {/* Search header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Open Media Search
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Search for open-licensed {mediaType === 'images' ? 'images' : 'audio files'} from Openverse
        </Typography>
      </Box>
      
      {/* Search form */}
      <Box component="form" onSubmit={handleSearch} mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              label="Search media"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={mediaType}
                label="Type"
                onChange={(e) => setMediaType(e.target.value)}
              >
                <MenuItem value="images">Images</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display="flex" gap={1}>
              <Button 
                variant="contained" 
                type="submit" 
                fullWidth
                startIcon={<SearchIcon />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterListIcon />}
              >
                Filters
              </Button>
              {user && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    loadSearchHistory();
                    setShowHistory(true);
                  }}
                  startIcon={<HistoryIcon />}
                >
                  History
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        
        {/* Filters - Memoized component */}
        <FilterSection 
          showFilters={showFilters} 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
        />
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Search results - Memoized component */}
      <Box mb={4}>
        <SearchResults 
          results={results}
          loading={loading}
          query={query}
          mediaType={mediaType}
          totalPages={totalPages}
          page={page}
          handlePageChange={handlePageChange}
          handleMediaClick={handleMediaClick}
          currentAudio={currentAudio}
          isPlaying={isPlaying}
          toggleAudioPlayback={toggleAudioPlayback}
        />
      </Box>
      
      {/* Search History Dialog - Memoized */}
      {SearchHistoryDialog}
      
      {/* Media Details Dialog - Memoized */}
      {MediaDetailsDialog}
    </Container>
  );
};

export default SearchComponent;