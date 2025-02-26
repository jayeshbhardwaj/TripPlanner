import { generateItinerary } from '../../services/claudeService';

describe('Claude Service', () => {

  test('generateItinerary calls API with correct parameters', async () => {
    // Mock fetch request to spy on request body
    const mockFetch = jest.fn();
    global.fetch = mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ content: '# Test Itinerary' })
    });

    // Options for the API call
    const options = {
      budget: '1000',
      duration: 3,
      destinations: 'Paris'
    };

    await generateItinerary(options);

    // Check that fetch was called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith('/api/claude', expect.any(Object));
    
    // Check the request body
    const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(requestBody.prompt).toContain('3-day travel itinerary');
    expect(requestBody.prompt).toContain('Paris');
    expect(requestBody.prompt).toContain('budget of $1000 USD');
  });

  test('generateItinerary returns API response content', async () => {
    // Restore the original fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: '# Test Itinerary for Paris' })
    });

    const result = await generateItinerary({
      budget: '1000',
      duration: 3,
      destinations: 'Paris'
    });

    expect(result).toBe('# Test Itinerary for Paris');
  });

  test('generateItinerary handles API errors', async () => {
    // Mock API error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await generateItinerary({
      budget: '1000',
      duration: 3,
      destinations: 'Paris'
    });

    expect(result).toContain('Sorry, there was an error generating your itinerary');
    expect(result).toContain('Network error');
  });
});