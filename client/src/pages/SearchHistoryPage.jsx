import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../context/AuthContext';
import { getSearchHistory, deleteSearch, clearAllSearchHistory } from '../services/searchService';
import { useNavigate } from 'react-router-dom';

const SearchHistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [selectedSearchId, setSelectedSearchId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchSearchHistory();
  }, []);
  
  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getSearchHistory();
      setSearchHistory(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError('Failed to load your search history. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleDeleteSearch = async () => {
    if (!selectedSearchId) return;
    
    try {
      await deleteSearch(selectedSearchId);
      setSearchHistory(searchHistory.filter(item => item._id !== selectedSearchId));
      setDeleteDialogOpen(false);
      setSelectedSearchId(null);
      setSuccessMessage('Search deleted successfully');
      
      // Auto-hide the success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting search:', err);
      setError('Failed to delete search. Please try again.');
    }
  };
  
  const handleClearAllHistory = async () => {
    try {
      const response = await clearAllSearchHistory();
      setSearchHistory([]);
      setClearDialogOpen(false);
      setSuccessMessage(`Cleared ${response.deletedCount} search entries`);
      
      // Auto-hide the success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error clearing search history:', err);
      setError('Failed to clear search history. Please try again.');
    }
  };
  
  const openDeleteDialog = (id) => {
    setSelectedSearchId(id);
    setDeleteDialogOpen(true);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleSearchAgain = (searchItem) => {
    // Navigate to the home page with search parameters
    navigate('/', { 
      state: { 
        searchQuery: searchItem.query,
        mediaType: searchItem.mediaType,
        filters: searchItem.filters
      } 
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Search History
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            Back to Search
          </Button>
          
          {searchHistory.length > 0 && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteSweepIcon />}
              onClick={() => setClearDialogOpen(true)}
            >
              Clear All History
            </Button>
          )}
        </Box>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage your recent searches on Open Media Search.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : searchHistory.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              You don't have any search history yet.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Start Searching
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Query</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Type</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Filters</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchHistory.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Typography variant="body1">{item.query}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.mediaType === 'images' ? 'Images' : 'Audio'} 
                        size="small"
                        color={item.mediaType === 'images' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {item.filters && Object.keys(item.filters).some(key => 
                        item.filters[key] && key !== 'page' && key !== 'pageSize'
                      ) ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.entries(item.filters).map(([key, value]) => (
                            value && key !== 'page' && key !== 'pageSize' ? (
                              <Chip 
                                key={key} 
                                label={`${key}: ${value}`} 
                                size="small" 
                                variant="outlined" 
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ) : null
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No filters
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(item.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Search again">
                        <IconButton 
                          onClick={() => handleSearchAgain(item)}
                          size="small"
                          color="primary"
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => openDeleteDialog(item._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this search from your history?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSearch} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Clear All History Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
        <DialogTitle>Clear All Search History</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear your entire search history?
            This will delete all {searchHistory.length} search entries and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearAllHistory} color="error" variant="contained">
            Clear All History
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SearchHistoryPage;