import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaDetailsComponent from '../components/MediaDetailsComponent';
import { getMediaDetails } from '../services/searchService';

// Mock the searchService
jest.mock('../services/searchService', () => ({
  getMediaDetails: jest.fn()
}));

// Mock audio functionality
const mockAudioPlay = jest.fn();
const mockAudioPause = jest.fn();
const mockAudio = {
  play: mockAudioPlay,
  pause: mockAudioPause
};

// Mock data
const mockImageDetails = {
  data: {
    id: 'image-1',
    title: 'Test Image',
    creator: 'Test Creator',
    url: 'https://example.com/image.jpg',
    license: 'CC-BY',
    description: 'Test image description',
    tags: [{ name: 'tag1' }, { name: 'tag2' }],
    source: 'https://example.com/source'
  }
};

const mockAudioDetails = {
  data: {
    id: 'audio-1',
    title: 'Test Audio',
    creator: 'Test Creator',
    url: 'https://example.com/audio.mp3',
    license: 'CC-BY',
    duration: 120,
    tags: [{ name: 'tag1' }, { name: 'tag2' }],
    source: 'https://example.com/source'
  }
};

describe('MediaDetailsComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock createRef for audio element
    HTMLMediaElement.prototype.play = mockAudioPlay;
    HTMLMediaElement.prototype.pause = mockAudioPause;
  });

  test('displays loading state initially', () => {
    getMediaDetails.mockResolvedValue({});
    
    render(<MediaDetailsComponent mediaId="image-1" mediaType="images" onClose={jest.fn()} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when loading fails', async () => {
    getMediaDetails.mockRejectedValue(new Error('Failed to load'));
    
    render(<MediaDetailsComponent mediaId="image-1" mediaType="images" onClose={jest.fn()} />);
    
    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/Failed to load media details/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays image details correctly', async () => {
    getMediaDetails.mockResolvedValue(mockImageDetails);
    
    render(<MediaDetailsComponent mediaId="image-1" mediaType="images" onClose={jest.fn()} />);
    
    // Wait for the title to appear
    const title = await screen.findByText('Test Image');
    expect(title).toBeInTheDocument();
    
    // Check other image details
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
    expect(screen.getByText('CC-BY')).toBeInTheDocument();
    expect(screen.getByText('Test image description')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('displays audio details correctly', async () => {
    getMediaDetails.mockResolvedValue(mockAudioDetails);
    
    render(<MediaDetailsComponent mediaId="audio-1" mediaType="audio" onClose={jest.fn()} />);
    
    // Wait for the title to appear
    const title = await screen.findByText('Test Audio');
    expect(title).toBeInTheDocument();
    
    // Check audio specific elements
    expect(screen.getByText('Duration: 2:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  test('toggles audio playback when play button is clicked', async () => {
    getMediaDetails.mockResolvedValue(mockAudioDetails);
    
    render(<MediaDetailsComponent mediaId="audio-1" mediaType="audio" onClose={jest.fn()} />);
    
    // Wait for loading to complete
    await screen.findByText('Test Audio');
    
    // Click play button
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    
    // Check if audio play was called
    expect(mockAudioPlay).toHaveBeenCalled();
  });
});