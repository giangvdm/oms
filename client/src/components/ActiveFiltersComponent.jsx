import React from 'react';
import { Box, Chip, Typography, Paper } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Component to display active filters as chips
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onClearFilter - Function to clear a specific filter
 * @param {Function} props.onClearAllFilters - Function to clear all filters
 * @param {boolean} props.compact - Whether to display in compact mode
 */
const ActiveFiltersComponent = ({ 
  filters, 
  onClearFilter, 
  onClearAllFilters, 
  compact = false 
}) => {
  // Filter out empty values and sortBy (which is shown separately)
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value !== '' && key !== 'sortBy' && key !== 'page' && key !== 'pageSize'
  );
  
  // If no active filters, return nothing
  if (activeFilters.length === 0) {
    return null;
  }
  
  // Get better display names for filters
  const getDisplayName = (key) => {
    const displayNames = {
      'license': 'License',
      'licenseType': 'License Type',
      'creator': 'Creator',
      'tags': 'Tags',
      'title': 'Title',
      'category': 'Category',
      'orientation': 'Orientation',
      'size': 'Size',
      'duration': 'Duration',
      'source': 'Source'
    };
    
    return displayNames[key] || key;
  };
  
  // Get better display value if needed
  const getDisplayValue = (key, value) => {
    // Special case for license types
    if (key === 'licenseType') {
      if (value === 'commercial') return 'Commercial Use';
      if (value === 'modification') return 'Modification Allowed';
    }
    
    return value;
  };
  
  return (
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        mt: 2, 
        p: compact ? 1 : 2, 
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box display="flex" alignItems="center" mb={compact ? 0.5 : 1}>
        <FilterListIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant={compact ? "body2" : "subtitle2"}>
          Active Filters
        </Typography>
      </Box>
      
      <Box display="flex" flexWrap="wrap" gap={0.8}>
        {activeFilters.map(([key, value]) => (
          <Chip
            key={key}
            label={`${getDisplayName(key)}: ${getDisplayValue(key, value)}`}
            onDelete={() => onClearFilter(key)}
            size={compact ? "small" : "medium"}
            color="primary"
            variant="outlined"
          />
        ))}
        <Chip
          label="Clear all filters"
          onClick={onClearAllFilters}
          size={compact ? "small" : "medium"}
          color="error"
          variant="outlined"
          icon={<ClearIcon />}
        />
      </Box>
    </Paper>
  );
};

export default ActiveFiltersComponent;