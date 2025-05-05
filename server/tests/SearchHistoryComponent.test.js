// Add this test file: client/src/tests/SearchHistoryComponent.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import SearchHistoryComponent from '../components/SearchHistoryComponent';
import * as searchService from '../services/searchService';

// Mock the search service
jest.mock('../services/searchService', () => ({
  getSearchHistory: jest.fn(),
  deleteSearch: jest.fn(),
  clearAllSearchHistory: jest.fn()
}));

describe('SearchHistoryComponent', () => {
  const mockUser = { id: 'user1', name: 'Test User' };
  const mockOnSelectHistory = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const renderComponent = (user = mockUser) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <SearchHistoryComponent onSelectHistory={mockOnSelectHistory} />
      </AuthContext.Provider>
    );
  };
  
  test('shows login prompt when user is not logged in', () => {
    renderComponent(null);
    
    expect(screen.getByText(/Log in to view and manage your search history/i)).toBeInTheDocument();
  });
  
  test('displays loading state initially when user is logged in', () => {
    searchService.getSearchHistory.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))
    );
    
    renderComponent();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  test('displays empty state message when no history exists', async () => {
    searchService.getSearchHistory.mockResolvedValue({ data: [] });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/No search history found/i)).toBeInTheDocument();
    });
  });
  
  test('displays search history items', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'landscape',
        mediaType: 'images',
        timestamp: new Date().toISOString()
      },
      {
        _id: 'history2',
        query: 'piano',
        mediaType: 'audio',
        timestamp: new Date().toISOString()
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('landscape')).toBeInTheDocument();
      expect(screen.getByText('piano')).toBeInTheDocument();
      expect(screen.getByText('Images')).toBeInTheDocument();
      expect(screen.getByText('Audio')).toBeInTheDocument();
    });
  });
  
  test('calls onSelectHistory when an item is clicked', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'landscape',
        mediaType: 'images',
        timestamp: new Date().toISOString()
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('landscape')).toBeInTheDocument();
    });
    
    // Click on the history item
    fireEvent.click(screen.getByText('landscape'));
    
    expect(mockOnSelectHistory).toHaveBeenCalledWith(mockHistory[0]);
  });
  
  test('opens delete confirmation dialog when delete button is clicked', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'landscape',
        mediaType: 'images',
        timestamp: new Date().toISOString()
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('landscape')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Check if dialog is open
    expect(screen.getByText(/Are you sure you want to delete this search/i)).toBeInTheDocument();
  });
  
  test('deletes search history item when confirmed', async () => {
    const mockHistory = [
      {
        _id: 'history1',
        query: 'landscape',
        mediaType: 'images',
        timestamp: new Date().toISOString()
      }
    ];
    
    searchService.getSearchHistory.mockResolvedValue({ data: mockHistory });
    searchService.deleteSearch.mockResolvedValue({ success: true });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('landscape')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /^Delete$/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(searchService.deleteSearch).toHaveBeenCalledWith('history1');
    });
  });
});