import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchComponent from './SearchComponent';
import * as searchService from '../services/searchService';

// Mock the search service
jest.mock('../services/searchService', () => ({
  searchMedia: jest.fn(),
  getSearchHistory: jest.fn(),
  deleteSearch: jest.fn()
}));

// Mock data
const mockSearchResults = {
  data: {
    results: [
      {
        id: 'test-image-1',
        title: 'Test Image 1',
        creator: 'Test Creator',
        url: 'https://example.com/test1.jpg',
        thumbnail: 'https://example.com/test1_thumb.jpg',
        license: 'CC-BY',
        tags: [{ name: 'tag1' }, { name: 'tag2' }]
      },
      {
        id: 'test-image-2',
        title: 'Test Image 2',
        creator: 'Another Creator',
        url: 'https://example.com/test2.jpg',
        thumbnail: 'https://example.com/test2_thumb.jpg',
        license: 'CC0',
        tags: [{ name: 'tag3' }, { name: 'tag4' }]
      }
    ],
    count: 2
  }
};

const mockSearchHistory = {
  data: [
    {
      _id: 'history-1',
      query: 'landscape',
      mediaType: 'images',
      timestamp: new Date().toISOString()
    },
    {
      _id: 'history-2',
      query: 'music',
      mediaType: 'audio',
      timestamp: new Date().toISOString()
    }
  ]
};

// Test component wrapper
const renderComponent = (userValue = null) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: userValue }}>
        <SearchComponent />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('SearchComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search form', () => {
    renderComponent();
    
    expect(screen.getByText(/Open Media Search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search media/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filters/i })).toBeInTheDocument();
  });

  test('shows and hides filters when filters button is clicked', () => {
    renderComponent();
    
    // Filters should be hidden initially
    expect(screen.queryByText(/Advanced Filters/i)).not.toBeInTheDocument();
    
    // Click filters button
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    
    // Filters should now be visible
    expect(screen.getByText(/Advanced Filters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Creator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/License/i)).toBeInTheDocument();
    
    // Click filters button again
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    
    // Filters should be hidden again
    expect(screen.queryByText(/Advanced Filters/i)).not.toBeInTheDocument();
  });

  test('shows history button only for logged in users', () => {
    // Without user (not logged in)
    renderComponent(null);
    expect(screen.queryByRole('button', { name: /History/i })).not.toBeInTheDocument();
    
    // With user (logged in)
    renderComponent({ id: 'user-1', name: 'Test User', email: 'test@example.com' });
    expect(screen.getByRole('button', { name: /History/i })).toBeInTheDocument();
  });

  test('performs search and displays results', async () => {
    searchService.searchMedia.mockResolvedValue(mockSearchResults);
    
    renderComponent();
    
    // Enter search query
    fireEvent.change(screen.getByLabelText(/Search media/i), { target: { value: 'nature' } });
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    
    // Check if search service was called correctly
    expect(searchService.searchMedia).toHaveBeenCalledWith('nature', expect.any(Object));
    
    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Image 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Image 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Creator/i)).toBeInTheDocument();
    });
  });

  test('displays error message when search fails', async () => {
    searchService.searchMedia.mockRejectedValue(new Error('Network error'));
    
    renderComponent();
    
    // Enter search query
    fireEvent.change(screen.getByLabelText(/Search media/i), { target: { value: 'nature' } });
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/An error occurred while searching/i)).toBeInTheDocument();
    });
  });

  test('opens and displays search history', async () => {
    searchService.getSearchHistory.mockResolvedValue(mockSearchHistory);
    
    renderComponent({ id: 'user-1', name: 'Test User', email: 'test@example.com' });
    
    // Click history button
    fireEvent.click(screen.getByRole('button', { name: /History/i }));
    
    // Wait for history dialog to appear
    await waitFor(() => {
      expect(screen.getByText(/Search History/i)).toBeInTheDocument();
      expect(screen.getByText(/landscape/i)).toBeInTheDocument();
      expect(screen.getByText(/music/i)).toBeInTheDocument();
    });
  });

  test('filters are shown and hidden correctly', () => {
    renderComponent();
    
    // Filters should be hidden initially
    expect(screen.queryByText(/Advanced Filters/i)).not.toBeInTheDocument();
    
    // Click filters button
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    
    // Filters should now be visible
    expect(screen.getByText(/Advanced Filters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/License/i)).toBeInTheDocument();
    
    // Click filters button again
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    
    // Filters should be hidden again
    expect(screen.queryByText(/Advanced Filters/i)).not.toBeInTheDocument();
  });
  
  test('changing media type updates search', async () => {
    searchService.searchMedia.mockResolvedValue({
      data: { results: [], count: 0 }
    });
    
    renderComponent();
    
    // Enter search query first
    fireEvent.change(screen.getByLabelText(/Search media/i), { target: { value: 'music' } });
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    
    // Media type should be 'images' by default
    expect(searchService.searchMedia).toHaveBeenCalledWith('music', expect.objectContaining({
      mediaType: 'images'
    }));
    
    // Change media type to 'audio'
    fireEvent.mouseDown(screen.getByLabelText(/Type/i));
    fireEvent.click(screen.getByText(/Audio/i));
    
    // Check if search was performed with new media type
    await waitFor(() => {
      expect(searchService.searchMedia).toHaveBeenCalledWith('music', expect.objectContaining({
        mediaType: 'audio'
      }));
    });
  });
  
  test('handles pagination correctly', async () => {
    // Mock search results with multiple pages
    searchService.searchMedia.mockResolvedValue({
      data: {
        results: [{ id: 'test-1', title: 'Test 1', creator: 'Creator 1' }],
        count: 40,
        page_count: 2
      }
    });
    
    renderComponent();
    
    // Enter search query
    fireEvent.change(screen.getByLabelText(/Search media/i), { target: { value: 'test' } });
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    
    // Wait for pagination to appear
    await waitFor(() => {
      expect(screen.getByText(/Showing page 1 of 2/i)).toBeInTheDocument();
    });
    
    // Reset mock to check second page call
    searchService.searchMedia.mockClear();
    
    // Click next page button (page 2)
    fireEvent.click(screen.getByRole('button', { name: /go to page 2/i }));
    
    // Check if search was performed with page 2
    await waitFor(() => {
      expect(searchService.searchMedia).toHaveBeenCalledWith('test', expect.objectContaining({
        page: 2
      }));
    });
  });
  
  test('applies filters to search', async () => {
    searchService.searchMedia.mockResolvedValue({
      data: { results: [], count: 0 }
    });
    
    renderComponent();
    
    // Enter search query
    fireEvent.change(screen.getByLabelText(/Search media/i), { target: { value: 'landscape' } });
    
    // Open filters
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    
    // Set creator filter
    fireEvent.change(screen.getByLabelText(/Creator/i), { target: { value: 'John Doe' } });
    
    // Set license filter
    fireEvent.mouseDown(screen.getByLabelText(/License/i));
    fireEvent.click(screen.getByText(/CC-BY/i));
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));
    
    // Check if search was performed with filters
    await waitFor(() => {
      expect(searchService.searchMedia).toHaveBeenCalledWith('landscape', expect.objectContaining({
        filters: expect.objectContaining({
          creator: 'John Doe',
          license: 'CC-BY'
        })
      }));
    });
  });
});