import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../context/AuthContext';
import { getSearchHistory, deleteSearch } from '../services/searchService';

const SearchHistoryComponent = ({ onSelectHistory }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  
  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getSearchHistory();
      setSearchHistory(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError('Failed to load search history');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
      setLoading(false);
    }
  }, [user]);
  
  const handleDeleteSearch = async (e, id) => {
    e.stopPropagation();
    
    try {
      await deleteSearch(id);
      setSearchHistory(searchHistory.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting search:', err);
      setError('Failed to delete search');
    }
  };
  
  if (!user) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Alert severity="info">
          Log in to view and manage your search history.
        </Alert>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Searches
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : searchHistory.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No search history found. Start searching to save your queries.
        </Typography>
      ) : (
        <List>
          {searchHistory.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem 
                button 
                onClick={() => onSelectHistory(item)}
                alignItems="flex-start"
              >
                <ListItemText
                  primary={item.query}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {item.mediaType}
                      </Typography>
                      {" — "}
                      {new Date(item.timestamp).toLocaleString()}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="search again"
                    onClick={() => onSelectHistory(item)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={(e) => handleDeleteSearch(e, item._id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < searchHistory.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default SearchHistoryComponent;