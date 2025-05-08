import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';

import SortOptionsComponent from './SortOptionsComponent';
import ActiveFiltersComponent from './ActiveFiltersComponent';

/**
 * Component for advanced search filters
 * 
 * @param {Object} props - Component props
 * @param {string} props.mediaType - Current media type ('images' or 'audio')
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Function to call when filters change
 * @param {Function} props.onResetFilters - Function to reset all filters
 * @param {Function} props.onSearch - Function to trigger a new search
 */
const AdvancedFiltersComponent = ({
  mediaType = 'images',
  filters,
  onFilterChange,
  onResetFilters,
  onSearch
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  
  // Handle clearing a specific filter
  const handleClearFilter = (filterName) => {
    onFilterChange(filterName, '');
  };
  
  // Count active filters (excluding sortBy, page, and pageSize)
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value !== '' && key !== 'sortBy' && key !== 'page' && key !== 'pageSize'
  ).length;
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  return (
    <Paper sx={{ mt: 2, p: 0, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      {/* Header section with sort and reset buttons */}
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        px={2} 
        py={1.5}
        bgcolor="rgba(0, 0, 0, 0.02)"
        borderBottom="1px solid #e0e0e0"
      >
        <Box display="flex" alignItems="center">
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1, height: 20, minWidth: 20 }} 
              />
            )}
          </Typography>
        </Box>
        <Box>
          <SortOptionsComponent 
            mediaType={mediaType}
            currentSort={filters.sortBy || 'relevance'}
            onSortChange={(sortOption) => onFilterChange('sortBy', sortOption)}
            buttonSize="small"
          />
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onResetFilters}
            startIcon={<ClearIcon />}
            sx={{ ml: 1 }}
          >
            Reset
          </Button>
        </Box>
      </Box>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Box px={2} py={1}>
          <ActiveFiltersComponent 
            filters={filters}
            onClearFilter={handleClearFilter}
            onClearAllFilters={onResetFilters}
            compact
          />
        </Box>
      )}
      
      {/* Filter tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="filter tabs">
          <Tab label="Basic Filters" />
          <Tab label={mediaType === 'images' ? "Image Filters" : "Audio Filters"} />
          <Tab label="License & Source" />
        </Tabs>
      </Box>
      
      {/* Basic Filters Tab */}
      {activeTab === 0 && (
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Creator"
                name="creator"
                value={filters.creator || ''}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                helperText="Filter by creator or artist name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title contains"
                name="title"
                value={filters.title || ''}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                helperText="Find media with specific words in title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={filters.tags || ''}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                helperText="Comma-separated tags (e.g., nature,water,sky)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category || ''}
                  label="Category"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Any</MenuItem>
                  {mediaType === 'images' ? (
                    [
                      <MenuItem key="photograph" value="photograph">Photograph</MenuItem>,
                      <MenuItem key="illustration" value="illustration">Illustration</MenuItem>,
                      <MenuItem key="digitized_artwork" value="digitized_artwork">Digitized Artwork</MenuItem>
                    ]
                  ) : (
                    [
                      <MenuItem key="sound_effect" value="sound_effect">Sound Effect</MenuItem>,
                      <MenuItem key="music" value="music">Music</MenuItem>,
                      <MenuItem key="audiobook" value="audiobook">Audiobook</MenuItem>,
                      <MenuItem key="podcast" value="podcast">Podcast</MenuItem>
                    ]
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* Media Specific Filters Tab */}
      {activeTab === 1 && (
        <Box sx={{ p: 2 }}>
          {mediaType === 'images' ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Orientation</InputLabel>
                  <Select
                    name="orientation"
                    value={filters.orientation || ''}
                    label="Orientation"
                    onChange={handleFilterChange}
                    sx={{
                      minWidth: '120px',
                      px: 2
                    }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="tall">Tall</MenuItem>
                    <MenuItem value="wide">Wide</MenuItem>
                    <MenuItem value="square">Square</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Size</InputLabel>
                  <Select
                    name="size"
                    value={filters.size || ''}
                    label="Size"
                    onChange={handleFilterChange}
                    sx={{
                      minWidth: '120px',
                      px: 2
                    }}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Accordion sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="advanced-image-filters"
                    id="advanced-image-filters-header"
                  >
                    <Typography variant="subtitle2">More Image Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Extension</InputLabel>
                          <Select
                            name="extension"
                            value={filters.extension || ''}
                            label="Extension"
                            onChange={handleFilterChange}
                          >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="jpg">JPG</MenuItem>
                            <MenuItem value="png">PNG</MenuItem>
                            <MenuItem value="svg">SVG</MenuItem>
                            <MenuItem value="gif">GIF</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Duration</InputLabel>
                  <Select
                    name="duration"
                    value={filters.duration || ''}
                    label="Duration"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="shortest">Very Short (&lt; 30s)</MenuItem>
                    <MenuItem value="short">Short (30s - 2m)</MenuItem>
                    <MenuItem value="medium">Medium (2m - 10m)</MenuItem>
                    <MenuItem value="long">Long (&gt; 10m)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Genres"
                  name="genres"
                  value={filters.genres || ''}
                  onChange={handleFilterChange}
                  variant="outlined"
                  size="small"
                  helperText="Comma-separated genre names"
                />
              </Grid>
              <Grid item xs={12}>
                <Accordion sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="advanced-audio-filters"
                    id="advanced-audio-filters-header"
                  >
                    <Typography variant="subtitle2">More Audio Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Audio Format</InputLabel>
                          <Select
                            name="audioExtension"
                            value={filters.audioExtension || ''}
                            label="Audio Format"
                            onChange={handleFilterChange}
                          >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="mp3">MP3</MenuItem>
                            <MenuItem value="wav">WAV</MenuItem>
                            <MenuItem value="ogg">OGG</MenuItem>
                            <MenuItem value="flac">FLAC</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
      
      {/* License Tab */}
      {activeTab === 2 && (
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>License</InputLabel>
                <Select
                  name="license"
                  value={filters.license || ''}
                  label="License"
                  onChange={handleFilterChange}
                  sx={{
                    minWidth: '120px',
                    px: 2
                  }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="CC0">CC0 (Public Domain)</MenuItem>
                  <MenuItem value="CC-BY">CC BY</MenuItem>
                  <MenuItem value="CC-BY-SA">CC BY-SA</MenuItem>
                  <MenuItem value="CC-BY-ND">CC BY-ND</MenuItem>
                  <MenuItem value="CC-BY-NC">CC BY-NC</MenuItem>
                  <MenuItem value="CC-BY-NC-SA">CC BY-NC-SA</MenuItem>
                  <MenuItem value="CC-BY-NC-ND">CC BY-NC-ND</MenuItem>
                  <MenuItem value="PDM">Public Domain Mark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>License Type</InputLabel>
                <Select
                  name="licenseType"
                  value={filters.licenseType || ''}
                  label="License Type"
                  onChange={handleFilterChange}
                  sx={{
                    minWidth: '120px',
                    px: 2
                  }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="commercial">Commercial Use Allowed</MenuItem>
                  <MenuItem value="modification">Modification Allowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Source"
                name="source"
                value={filters.source || ''}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                helperText="Filter by source (e.g., Flickr, Wikimedia, Freesound)"
              />
            </Grid>
          </Grid>
          
          <Box mt={2} px={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Not all filters may work for every query. Some combinations may yield limited results.
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Bottom action area */}
      <Box 
        p={2} 
        display="flex" 
        justifyContent="flex-end" 
        borderTop="1px solid #e0e0e0"
        bgcolor="rgba(0, 0, 0, 0.02)"
      >
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onSearch}
          startIcon={<FilterListIcon />}
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default AdvancedFiltersComponent;