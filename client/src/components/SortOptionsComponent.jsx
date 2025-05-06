import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider 
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Component for media sort options
 * 
 * @param {Object} props - Component props
 * @param {string} props.mediaType - Current media type ('images' or 'audio')
 * @param {string} props.currentSort - Current sort option
 * @param {Function} props.onSortChange - Function to call when sort option changes
 * @param {boolean} props.buttonVariant - Button variant ('text', 'outlined', 'contained')
 * @param {string} props.buttonSize - Button size ('small', 'medium', 'large')
 */
const SortOptionsComponent = ({
  mediaType = 'images',
  currentSort = 'relevance',
  onSortChange,
  buttonVariant = 'outlined',
  buttonSize = 'medium'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Handle menu open
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Handle sort option selection
  const handleSortSelect = (sortOption) => {
    onSortChange(sortOption);
    handleClose();
  };
  
  // Get sort options based on media type
  const getSortOptions = () => {
    const commonOptions = [
      { value: 'relevance', label: 'Relevance', icon: <SearchIcon /> },
      { value: 'title', label: 'Title (A-Z)', icon: <SortByAlphaIcon /> },
      { value: 'creator', label: 'Creator', icon: <PersonIcon /> },
      { value: 'newest', label: 'Newest First', icon: <AccessTimeIcon /> },
      { value: 'oldest', label: 'Oldest First', icon: <AccessTimeIcon /> }
    ];
    
    if (mediaType === 'images') {
      return [
        ...commonOptions,
        { value: 'popularity', label: 'Popularity', icon: <TrendingUpIcon /> }
      ];
    } else {
      return [
        ...commonOptions,
        { value: 'duration', label: 'Duration', icon: <MusicNoteIcon /> }
      ];
    }
  };
  
  // Get the current sort option label
  const getCurrentSortLabel = () => {
    const sortOption = getSortOptions().find(option => option.value === currentSort);
    return sortOption ? sortOption.label : 'Relevance';
  };
  
  return (
    <>
      <Button
        variant={buttonVariant}
        startIcon={<SortIcon />}
        onClick={handleClick}
        size={buttonSize}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Sort: {getCurrentSortLabel()}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 200,
            maxWidth: 300
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Sort {mediaType} by:
        </Typography>
        <Divider />
        
        {getSortOptions().map((option) => (
          <MenuItem
            key={option.value}
            selected={currentSort === option.value}
            onClick={() => handleSortSelect(option.value)}
            sx={{ 
              py: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {currentSort === option.value ? <CheckIcon color="primary" /> : option.icon}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SortOptionsComponent;