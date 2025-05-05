// Add this test file: client/src/tests/SearchHistory.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SearchHistoryPage from '../pages/SearchHistoryPage';
import * as searchService from '../services/searchService';

// Mock the search service
jest.mock('../services/searchService', () => ({
  getSearchHistory: jest.fn(),
  deleteSearch: jest.fn(),
  clearAllSearchHistory: jest.fn()
}));

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('SearchHistoryPage', () => {
  const mockUser = { id: 'user1', name: 'Test User' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const renderSearchHistoryPage = (user = mockUser) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user }}>
          <SearchHistoryPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };
  
  test('displays loading state initially', () => {
    searchService.getSearchHistory.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))
    );
    
    renderSearchHistoryPage();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  test('displays empty state when no history exists', async () => {
    searchService.getSearchHistory.mockResolvedValue({ data: [] });
    
    renderSearchHistoryPage();
    
    await waitFor(() => {
      expect(screen.getByText(/You don't have any search history yet/i)).toBeInTheDocument();
      expect(screen.getByText(/Start Searching/i)).toBeInTheDocument();
    });
  });
  
  test('displays search history when data exists', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'nature',
        mediaType: 'images',
        timestamp: new Date().toISOString(),
        filters: { license: 'CC-BY' }
      },
      {
        _id: 'history2',
        query: 'jazz',
        mediaType: 'audio',
        timestamp: new Date().toISOString(),
        filters: {}
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    
    renderSearchHistoryPage();
    
    await waitFor(() => {
      expect(screen.getByText('nature')).toBeInTheDocument();
      expect(screen.getByText('jazz')).toBeInTheDocument();
      expect(screen.getByText('Images')).toBeInTheDocument();
      expect(screen.getByText('Audio')).toBeInTheDocument();
      expect(screen.getByText(/license: CC-BY/i)).toBeInTheDocument();
    });
  });
  
  test('deletes a search history item', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'nature',
        mediaType: 'images',
        timestamp: new Date().toISOString()
      },
      {
        _id: 'history2',
        query: 'jazz',
        mediaType: 'audio',
        timestamp: new Date().toISOString()
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    searchService.deleteSearch.mockResolvedValue({ success: true });
    
    renderSearchHistoryPage();
    
    await waitFor(() => {
      expect(screen.getByText('nature')).toBeInTheDocument();
    });
    
    // Open delete dialog
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete$/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(searchService.deleteSearch).toHaveBeenCalledWith('history1');
    });
  });
  
  test('clears all search history', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'nature',
        mediaType: 'images',
        timestamp: new Date().toISOString()
      },
      {
        _id: 'history2',
        query: 'jazz',
        mediaType: 'audio',
        timestamp: new Date().toISOString()
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    searchService.clearAllSearchHistory.mockResolvedValue({ 
      success: true,
      deletedCount: 2
    });
    
    renderSearchHistoryPage();
    
    await waitFor(() => {
      expect(screen.getByText('nature')).toBeInTheDocument();
    });
    
    // Open clear all dialog
    const clearAllButton = screen.getByRole('button', { name: /clear all history/i });
    fireEvent.click(clearAllButton);
    
    // Confirm clearing all
    const confirmButton = screen.getByRole('button', { name: /clear all history$/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(searchService.clearAllSearchHistory).toHaveBeenCalled();
    });
  });
  
  test('navigates to home page when search again is clicked', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'nature',
        mediaType: 'images',
        timestamp: new Date().toISOString(),
        filters: { license: 'CC-BY' }
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    
    renderSearchHistoryPage();
    
    await waitFor(() => {
      expect(screen.getByText('nature')).toBeInTheDocument();
    });
    
    // Click search again button
    const searchAgainButton = screen.getByRole('button', { name: /search again/i });
    fireEvent.click(searchAgainButton);
    
    // Check if navigate was called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('/', {
      state: {
        searchQuery: 'nature',
        mediaType: 'images',
        filters: { license: 'CC-BY' }
      }
    });
  });
  
  test('displays error message when loading fails', async () => {
    searchService.getSearchHistory.mockRejectedValue(new Error('Failed to load'));
    
    renderSearchHistoryPage();
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load your search history/i)).toBeInTheDocument();
    });
  });
});