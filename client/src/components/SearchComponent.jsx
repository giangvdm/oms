import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
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
  Alert,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ClearIcon from '@mui/icons-material/Clear';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { AuthContext } from '../context/AuthContext';
import { searchMedia, getSearchHistory, deleteSearch, clearAllSearchHistory } from '../services/searchService';

// Import custom components
import SortOptionsComponent from './SortOptionsComponent';
import ActiveFiltersComponent from './ActiveFiltersComponent';
import AdvancedFiltersComponent from './AdvancedFiltersComponent';

const SearchComponent = () => {
  // State for search
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('images');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default items per page
  
  // State for view options
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    license: '',
    licenseType: '',
    creator: '',
    tags: '',
    title: '',
    // New filter options
    category: '',
    orientation: '', // For images only
    size: '', // For images only
    duration: '', // For audio only
    source: '',
    sortBy: 'relevance' // Default sort option
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
  
  // State to track current search parameters
  const [currentSearchParams, setCurrentSearchParams] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  // Active filters count (for badge)
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(
      ([key, value]) => value !== '' && key !== 'sortBy' && key !== 'page' && key !== 'pageSize'
    ).length;
  }, [filters]);
  
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
  
  // Reset specific filters when media type changes
  useEffect(() => {
    // Reset media type specific filters
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (mediaType === 'images') {
        // Reset audio specific filters
        delete newFilters.duration;
      } else {
        // Reset image specific filters
        delete newFilters.orientation;
        delete newFilters.size;
      }
      
      return newFilters;
    });
  }, [mediaType]);
  
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
  
  // Function to perform the search with current parameters
  const performSearch = useCallback(async (searchParams) => {
    if (!searchParams || !searchParams.query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create a copy of filters excluding empty values
      const activeFilters = Object.fromEntries(
        Object.entries(searchParams.filters).filter(([_, v]) => v !== '')
      );
      
      const response = await searchMedia(searchParams.query, {
        mediaType: searchParams.mediaType,
        page: searchParams.page,
        pageSize: searchParams.itemsPerPage,
        filters: activeFilters,
        timestamp: searchParams.timestamp // Pass timestamp to avoid cache
      });
      
      setResults(response.data.results);
      setTotalPages(response.data.page_count || 0);
      setTotalResults(response.data.count || 0);
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
  }, [user, loadSearchHistory]);
  
  // Handle filter change
  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Use our existing handle function but adapt it to the new component pattern
  const handleSingleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    handleFilterChange(name, value);
  }, [handleFilterChange]);
  
  // Reset all filters
  const handleResetFilters = () => {
    const defaultFilters = {
      license: '',
      licenseType: '',
      creator: '',
      tags: '',
      title: '',
      category: '',
      orientation: mediaType === 'images' ? '' : undefined,
      size: mediaType === 'images' ? '' : undefined,
      duration: mediaType === 'audio' ? '' : undefined,
      source: '',
      sortBy: 'relevance'
    };
    
    setFilters(defaultFilters);
    
    // If there's an existing search, perform it again with reset filters
    if (currentSearchParams) {
      const updatedParams = {
        ...currentSearchParams,
        filters: defaultFilters,
        page: 1 // Reset to first page when resetting filters
      };
      
      setPage(1);
      setCurrentSearchParams(updatedParams);
      performSearch(updatedParams);
    }
  };
  
  // Handle initial search
  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    
    // Reset to first page when starting a new search
    setPage(1);
    
    // Add a timestamp to ensure we don't get cached results when filters change
    const timestamp = Date.now();
    
    // Save current search parameters
    const searchParams = {
      query,
      mediaType,
      filters,
      page: 1, // Always start on first page for a new search
      itemsPerPage,
      timestamp // Add timestamp to force new search
    };
    
    setCurrentSearchParams(searchParams);
    performSearch(searchParams);
    
    // Scroll to top when starting a new search
    window.scrollTo(0, 0);
  }, [query, mediaType, filters, itemsPerPage, performSearch]);
  
  // Handle page change
  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
    
    // Update search parameters with new page
    const updatedParams = {
      ...currentSearchParams,
      page: newPage
    };
    
    setCurrentSearchParams(updatedParams);
    performSearch(updatedParams);
    
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  }, [currentSearchParams, performSearch]);
  
  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    
    // Update search parameters with new page size and reset to page 1
    if (currentSearchParams) {
      const updatedParams = {
        ...currentSearchParams,
        page: 1,
        itemsPerPage: newItemsPerPage
      };
      
      setPage(1);
      setCurrentSearchParams(updatedParams);
      performSearch(updatedParams);
    }
  };
  
  const handleDeleteSearch = useCallback(async (id) => {
    try {
      await deleteSearch(id);
      loadSearchHistory();
    } catch (err) {
      console.error('Error deleting search:', err);
    }
  }, [loadSearchHistory]);
  
  const handleHistoryItemClick = useCallback((historyItem) => {
    // Set search parameters from history
    setQuery(historyItem.query);
    setMediaType(historyItem.mediaType);
    
    // Apply saved filters if any
    if (historyItem.filters) {
      // Create a new filters object with only the relevant filters
      // (excluding pagination parameters)
      const relevantFilters = {};
      
      Object.entries(historyItem.filters).forEach(([key, value]) => {
        if (value && key !== 'page' && key !== 'pageSize') {
          relevantFilters[key] = value;
        }
      });
      
      setFilters(relevantFilters);
    } else {
      // Reset filters if none in history
      setFilters({
        license: '',
        licenseType: '',
        creator: '',
        tags: '',
        title: '',
        category: '',
        orientation: mediaType === 'images' ? '' : undefined,
        size: mediaType === 'images' ? '' : undefined,
        duration: mediaType === 'audio' ? '' : undefined,
        source: '',
        sortBy: 'relevance'
      });
    }
    
    // Reset to page 1
    setPage(1);
    setShowHistory(false);
    
    // Perform the search immediately
    const searchParams = {
      query: historyItem.query,
      mediaType: historyItem.mediaType,
      filters: historyItem.filters || {},
      page: 1,
      itemsPerPage
    };
    
    setCurrentSearchParams(searchParams);
    performSearch(searchParams);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [itemsPerPage, performSearch, mediaType]);
  
  const handleMediaClick = useCallback((media) => {
    setSelectedMedia(media);
    setShowMediaDetails(true);
  }, []);

  const handleMediaTypeChange = (e) => {
    const newMediaType = e.target.value;
    setMediaType(newMediaType);
    
    // If there's an existing query, perform search with the new media type
    if (query.trim()) {
      // Create updated search parameters
      const searchParams = {
        query,
        mediaType: newMediaType,
        filters,
        page: 1, // Reset to first page when switching media types
        itemsPerPage
      };
      
      setCurrentSearchParams(searchParams);
      setPage(1); // Reset page
      performSearch(searchParams);
    }
  };
  
  const toggleAudioPlayback = useCallback((audio) => {
    if (currentAudio && currentAudio.id === audio.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  }, [currentAudio, isPlaying]);
  
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
              InputProps={{
                endAdornment: query ? (
                  <IconButton 
                    size="small" 
                    onClick={() => setQuery('')}
                    aria-label="clear search"
                  >
                    <ClearIcon />
                  </IconButton>
                ) : null
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={mediaType}
                label="Type"
                onChange={handleMediaTypeChange}
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
                color={activeFiltersCount > 0 ? "primary" : "inherit"}
                sx={activeFiltersCount > 0 ? { fontWeight: 'bold' } : {}}
              >
                {activeFiltersCount > 0 ? `${activeFiltersCount}` : 'Filters'}
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
        
        {/* Sort options - show above search results when filters aren't displayed */}
        {!showFilters && results.length > 0 && (
          <Box mt={2} display="flex" justifyContent="flex-end">
            <SortOptionsComponent 
              mediaType={mediaType}
              currentSort={filters.sortBy || 'relevance'}
              onSortChange={(sortOption) => {
                handleFilterChange('sortBy', sortOption);
                // Apply sort immediately
                const updatedParams = {
                  ...currentSearchParams,
                  filters: {
                    ...currentSearchParams.filters,
                    sortBy: sortOption
                  },
                  page: 1 // Reset to first page when changing sort
                };
                setPage(1);
                setCurrentSearchParams(updatedParams);
                performSearch(updatedParams);
              }}
            />
          </Box>
        )}
        
        {/* Filters */}
        {showFilters && (
          <AdvancedFiltersComponent 
            mediaType={mediaType}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch}
          />
        )}
      </Box>
      
      {/* Display active filter chips even when filter panel is closed */}
      {!showFilters && activeFiltersCount > 0 && (
        <ActiveFiltersComponent 
          filters={filters}
          onClearFilter={(filterName) => handleFilterChange(filterName, '')}
          onClearAllFilters={handleResetFilters}
        />
      )}
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {/* Search results */}
      <Box mb={4}>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : results.length > 0 ? (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Search Results {totalResults > 0 && `(${totalResults} items found)`}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2}>
                {/* Items per page selector */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Items per page</InputLabel>
                  <Select
                    value={itemsPerPage}
                    label="Items per page"
                    onChange={handleItemsPerPageChange}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
                
                {/* View toggle */}
                <Box>
                  <Tooltip title="Grid view">
                    <IconButton 
                      onClick={() => setViewMode('grid')}
                      color={viewMode === 'grid' ? 'primary' : 'default'}
                    >
                      <GridViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List view">
                    <IconButton 
                      onClick={() => setViewMode('list')}
                      color={viewMode === 'list' ? 'primary' : 'default'}
                    >
                      <ViewListIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            {/* Grid view */}
            {viewMode === 'grid' && (
              <Grid container spacing={3}>
                {results.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* List view */}
            {viewMode === 'list' && (
              <Paper>
                {results.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <Box 
                      p={2} 
                      display="flex" 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                      }}
                      onClick={() => handleMediaClick(item)}
                    >
                      {/* Thumbnail/Audio preview */}
                      <Box mr={2} sx={{ width: 100, height: 100, flexShrink: 0 }}>
                        {mediaType === 'images' ? (
                          <img 
                            src={item.thumbnail || item.url} 
                            alt={item.title}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              borderRadius: 4
                            }}
                          />
                        ) : (
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="center"
                            bgcolor="rgba(0,0,0,0.05)"
                            height="100%"
                            borderRadius={1}
                          >
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAudioPlayback(item);
                              }}
                            >
                              {currentAudio && currentAudio.id === item.id && isPlaying ? (
                                <PauseIcon />
                              ) : (
                                <PlayArrowIcon />
                              )}
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      
                      {/* Content */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {item.title || 'Untitled'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          By {item.creator || 'Unknown'}
                        </Typography>
                        <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                          <Chip 
                            label={item.license || 'Unknown License'} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                          {item.tags && item.tags.length > 0 && (
                            item.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Chip 
                                key={tagIndex}
                                label={tag.name || tag} 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))
                          )}
                          {item.tags && item.tags.length > 3 && (
                            <Chip 
                              label={`+${item.tags.length - 3} more`} 
                              size="small" 
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Paper>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Showing page {page} of {totalPages}
                  </Typography>
                </Box>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                />
                <Box mt={2} display="flex" gap={1} alignItems="center">
                  <Tooltip title="Jump to page">
                    <TextField
                      size="small"
                      label="Go to page"
                      type="number"
                      InputProps={{ inputProps: { min: 1, max: totalPages } }}
                      sx={{ width: '100px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const targetPage = parseInt(e.target.value);
                          if (targetPage >= 1 && targetPage <= totalPages) {
                            handlePageChange(null, targetPage);
                          }
                        }
                      }}
                    />
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    {itemsPerPage} results per page
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        ) : query !== '' && (
          <Typography variant="body1" textAlign="center" py={4}>
            No results found. Try different search terms or filters.
          </Typography>
        )}
      </Box>
      
      {/* Search History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Search History</Typography>
            {searchHistory.length > 0 && (
              <Button 
                size="small" 
                color="error" 
                startIcon={<DeleteSweepIcon />}
                onClick={async () => {
                  try {
                    await clearAllSearchHistory();
                    setSearchHistory([]);
                    // Show temporary success message
                    setSuccessMessage('All search history cleared successfully');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                Clear All
              </Button>
            )}
            <IconButton
              aria-label="close"
              onClick={() => setShowHistory(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
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
                  sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <Box 
                    onClick={() => handleHistoryItemClick(item)} 
                    sx={{ cursor: 'pointer', flexGrow: 1 }}
                  >
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <Typography variant="subtitle1">
                        {item.query}
                      </Typography>
                      <Chip 
                        label={item.mediaType === 'images' ? 'Images' : 'Audio'} 
                        size="small"
                        color={item.mediaType === 'images' ? 'primary' : 'secondary'}
                        variant="outlined"
                        sx={{ ml: 1, height: 20 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.timestamp).toLocaleString('en-GB')}
                    </Typography>
                    {item.filters && Object.keys(item.filters).some(key => 
                      item.filters[key] && key !== 'page' && key !== 'pageSize'
                    ) && (
                      <Box mt={0.5} display="flex" flexWrap="wrap" gap={0.5}>
                        {Object.entries(item.filters).map(([key, value]) => (
                          value && key !== 'page' && key !== 'pageSize' ? (
                            <Chip 
                              key={key} 
                              label={`${key}: ${value}`} 
                              size="small" 
                              variant="outlined" 
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          ) : null
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Tooltip title="Search again">
                      <IconButton 
                        onClick={() => handleHistoryItemClick(item)} 
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => {
                          deleteSearch(item._id)
                            .then(() => {
                              setSearchHistory(searchHistory.filter(h => h._id !== item._id));
                            })
                            .catch(err => {
                              console.error('Error deleting search:', err);
                              setError('Failed to delete search');
                            });
                        }} 
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
      
      {/* Media Details Dialog */}
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
              {selectedMedia && (
                <Button 
                  component="a" 
                  href={`/media/${mediaType}/${selectedMedia.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon />}
                >
                  View Full Details
                </Button>
              )}
              {selectedMedia && (
                <Button 
                  component="a" 
                  href={selectedMedia.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download
                </Button>
              )}
              <Button onClick={() => setShowMediaDetails(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SearchComponent;