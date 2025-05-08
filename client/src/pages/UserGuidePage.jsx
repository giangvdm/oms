import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs,
  Link,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import TuneIcon from '@mui/icons-material/Tune';
import InfoIcon from '@mui/icons-material/Info';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageIcon from '@mui/icons-material/Image';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';

// Mock images for guide sections
const searchScreenImg = '../assets/guide/search-interface.png';
const filtersScreenImg = '../assets/guide/filter-options.png';
const accountScreenImg = '../assets/guide/account-features.png';
const historyScreenImg = '../assets/guide/search-history.png';

const UserGuidePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">User Guide</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Open Media Search User Guide
      </Typography>
      
      <Typography variant="body1" paragraph>
        Welcome to Open Media Search! This guide will help you understand how to use all the features of our application to search and access open-licensed media content efficiently.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          centered={!isMobile}
        >
          <Tab icon={<SearchIcon />} label="Getting Started" />
          <Tab icon={<TuneIcon />} label="Search Features" />
          <Tab icon={<AccountCircleIcon />} label="Account Management" />
          <Tab icon={<HelpOutlineIcon />} label="FAQ" />
        </Tabs>
      </Box>

      {/* Getting Started Tab */}
      {tabValue === 0 && (
        <Box>
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Getting Started with Open Media Search
            </Typography>
            
            <Typography variant="body1" paragraph>
              Open Media Search allows you to search and access millions of open-licensed media files from various sources, including images and audio. Here's how to get started:
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={searchScreenImg}
                    alt="Search Interface"
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      1. Basic Search
                    </Typography>
                    <Typography variant="body2">
                      Enter your search term in the search box on the homepage. Select whether you want to search for "Images" or "Audio" using the dropdown menu next to the search box. Click the search button to see results.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={filtersScreenImg}
                    alt="Filter Options"
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      2. Using Filters
                    </Typography>
                    <Typography variant="body2">
                      Click the "Filters" button to access advanced search options. You can filter by license type, creator, tags, and more. Use these filters to narrow down your search for more specific results.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={accountScreenImg}
                    alt="Account Features"
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      3. Creating an Account
                    </Typography>
                    <Typography variant="body2">
                      While you can search without an account, registering allows you to save your search history. Click "Register" in the top right corner to create an account with your email and password.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={historyScreenImg}
                    alt="Search History"
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      4. Accessing Your History
                    </Typography>
                    <Typography variant="body2">
                      Once logged in, you can access your search history by clicking the "History" button in the search interface. This allows you to quickly return to previous searches without having to re-enter the search terms.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Understanding Open Licenses
            </Typography>
            
            <Typography variant="body1" paragraph>
              All media accessible through Open Media Search is available under various open licenses. Understanding these licenses is important for proper usage:
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Creative Commons Licenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Creative Commons (CC) licenses are a set of copyright licenses that enable the free distribution of otherwise copyrighted work. Here are the main types:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="CC0 (Public Domain)" 
                      secondary="You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="CC BY (Attribution)" 
                      secondary="You must give appropriate credit, provide a link to the license, and indicate if changes were made." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="CC BY-SA (Attribution-ShareAlike)" 
                      secondary="Similar to CC BY, but if you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="CC BY-ND (Attribution-NoDerivatives)" 
                      secondary="You may redistribute the material, but you can't modify it." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="CC BY-NC (Attribution-NonCommercial)" 
                      secondary="You may not use the material for commercial purposes." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Public Domain</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Public domain works are those whose intellectual property rights have expired, been forfeited, or are inapplicable. These works can be used for any purpose without restriction.
                </Typography>
                <Typography variant="body2">
                  Materials in the public domain are typically labeled with "Public Domain Mark" (PDM) or "CC0" in our search results.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">How to Properly Attribute</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Most open licenses require proper attribution. A good attribution includes:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Title of the work" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Author/Creator name" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Source (URL)" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="License (with link to license terms)" 
                    />
                  </ListItem>
                </List>
                <Typography variant="body2">
                  Example: "Forest Sunrise" by Jane Smith is licensed under CC BY 4.0.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      )}

      {/* Search Features Tab */}
      {tabValue === 1 && (
        <Box>
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Advanced Search Features
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Using Filters</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Filters help you narrow down your search results to find exactly what you're looking for:
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><TuneIcon /></ListItemIcon>
                        <ListItemText 
                          primary="License Filters" 
                          secondary="Filter by license type (CC0, CC-BY, etc.) or choose 'Commercial Use Allowed' for business projects." 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TuneIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Creator Filters" 
                          secondary="Search for works by a specific creator." 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TuneIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Tag Filters" 
                          secondary="Filter by tags associated with the media." 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><ImageIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Image-Specific Filters" 
                          secondary="Filter images by orientation (tall, wide, square), size, or image type." 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><MusicNoteIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Audio-Specific Filters" 
                          secondary="Filter audio by duration, genres, or audio format." 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TuneIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Source Filters" 
                          secondary="Filter by the original source of the media." 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Search Techniques</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Improve your search results with these techniques:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Multiple Keywords" 
                      secondary="Use multiple keywords like 'beach sunset waves' to find more specific results." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Specific Terms" 
                      secondary="Use specific terms rather than general ones. For example, 'golden retriever' instead of just 'dog'." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Combine Search with Filters" 
                      secondary="For best results, use a combination of search terms and filters." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Media Type" 
                      secondary="Be sure to select the appropriate media type (Images or Audio) before searching." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TuneIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Sorting and Viewing Results</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Customize how you view your search results:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Sort Options" 
                      secondary="Sort results by relevance, newest first, title, creator, or popularity." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Grid View vs. List View" 
                      secondary="Toggle between grid view (better for images) and list view (shows more details)." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Items Per Page" 
                      secondary="Adjust how many results are shown per page using the dropdown menu." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Pagination" 
                      secondary="Navigate through multiple pages of results using the pagination controls at the bottom." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Viewing Media Details</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Get detailed information about specific media:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Preview Media" 
                      secondary="Click on any search result to open a preview with full details." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Audio Playback" 
                      secondary="Play audio directly in the application using the playback controls." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Full Details Page" 
                      secondary="View the full details page to see complete information about the media, including license details." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Download Media" 
                      secondary="Download the media directly from the details view." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Visit Source" 
                      secondary="Visit the original source of the media for additional context or information." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      )}

      {/* Account Management Tab */}
      {tabValue === 2 && (
        <Box>
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Account Features and Management
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Registration and Login</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Creating and managing your account:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Creating an Account" 
                      secondary="Click 'Register' in the navigation bar and provide your name, email, and password. Accept the terms and privacy policy to complete registration." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Logging In" 
                      secondary="Use your email and password to log in. You can select 'Remember Me' to stay logged in on your device." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Password Recovery" 
                      secondary="Use the 'Forgot Password' link on the login page if you need to reset your password." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Managing Search History</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Access and manage your search history:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Viewing History" 
                      secondary="Access your search history by clicking the 'History' button in the search interface or through the history page in your account." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Repeating Searches" 
                      secondary="Click on any past search to repeat it with the same parameters and filters." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Deleting Individual Searches" 
                      secondary="Remove specific entries from your history by clicking the delete icon next to the search." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Clearing All History" 
                      secondary="Clear your entire search history using the 'Clear All History' button in the history view." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Profile and Security</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Manage your profile and account security:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Updating Profile Information" 
                      secondary="Edit your name and other profile details on the Profile page." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Changing Password" 
                      secondary="Change your password from the Profile page for security." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Account Deletion" 
                      secondary="You can request account deletion from the Profile page. This will permanently remove your account and all associated data." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Logging Out" 
                      secondary="Log out of your account by clicking your profile icon and selecting 'Logout'." 
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BookmarkIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Data Privacy</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Understanding your data and privacy:
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Data Collection" 
                      secondary="We collect your name, email, and search history to provide and improve the service." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Data Access" 
                      secondary="You can access all your data through your Profile and History pages." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Data Removal" 
                      secondary="Delete specific search history or request complete account deletion to remove your data." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Privacy Policy" 
                      secondary={
                        <span>
                          View our full <Link component={RouterLink} to="/privacy">Privacy Policy</Link> for detailed information about how we handle your data.
                        </span>
                      }
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      )}

      {/* FAQ Tab */}
      {tabValue === 3 && (
        <Box>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Frequently Asked Questions
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">What is Open Media Search?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Open Media Search is a web application that allows you to search and access millions of open-licensed media files including images and audio. All content available through our service is under various open licenses such as Creative Commons licenses or is in the public domain, making it legally reusable under the specific license terms.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Do I need to create an account to use Open Media Search?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  No, you can search and access media without creating an account. However, creating an account allows you to save your search history, making it easier to return to previous searches. Account creation is free and only requires a valid email address.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Where does the media content come from?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  The media content is sourced from Openverse API, which aggregates open-licensed content from various platforms including Flickr, Wikimedia Commons, Freesound, and many others. We do not host the media files directly; instead, we provide a search interface to discover and access them from their original sources.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Can I use the media I find for commercial purposes?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  It depends on the specific license of the media you find. Some licenses (like CC0, CC BY, or CC BY-SA) allow commercial use, while others (like CC BY-NC) do not. You can use our license filter to search specifically for media that allows commercial use. Always make sure to check the license terms for each media item before using it commercially.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Do I need to attribute the creator when using the media?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Most open licenses require attribution, meaning you must credit the creator when using their work. The only exceptions are works in the public domain (CC0 or PDM). For all other licenses (CC BY, CC BY-SA, etc.), proper attribution is required. Our media details page provides all the information you need for proper attribution.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">How do I report inappropriate content?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  If you find any inappropriate content that violates our terms of service or appears to be incorrectly licensed, please contact us at support@openmediasearch.com with details about the content in question. We will investigate and take appropriate action as needed.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Is there a limit to how many searches I can perform?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  There are no strict limits on the number of searches you can perform. However, we do implement rate limiting to ensure fair usage of our service. If you're experiencing issues with search limits, please contact us for assistance.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">What should I do if I can't find what I'm looking for?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  If you're having trouble finding specific content, try these tips:
                  <ul>
                    <li>Use different search terms or keywords</li>
                    <li>Try both singular and plural forms</li>
                    <li>Use fewer filters to broaden your search</li>
                    <li>Try searching in both media types (images and audio)</li>
                    <li>Check your spelling</li>
                  </ul>
                  Remember that our search is limited to open-licensed content, so not all types of media may be available.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">How can I contact support?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  If you need assistance or have questions not covered in this guide, please contact our support team at support@openmediasearch.com. We aim to respond to all inquiries within 24-48 hours during weekdays.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Box>
      )}

      {/* Call to action at the bottom */}
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" gutterBottom>
          Ready to start searching?
        </Typography>
        <Typography variant="body1" paragraph>
          Now that you understand how to use Open Media Search, start exploring millions of open-licensed media files!
        </Typography>
        <Link component={RouterLink} to="/" underline="always">
          Go to Search Page
        </Link>
      </Box>
    </Container>
  );
};

export default UserGuidePage;