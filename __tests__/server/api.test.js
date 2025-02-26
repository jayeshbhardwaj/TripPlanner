const axios = require('axios');
const express = require('express');
const request = require('supertest');
const dotenv = require('dotenv');

// Mock axios
jest.mock('axios');

// Load server code
let app;

describe('Server API Endpoints', () => {
  beforeEach(() => {
    // Reset modules between tests
    jest.resetModules();
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
    process.env.PORT = '3001';
    
    // Load express app
    const { app: expressApp } = require('../../server/index.js');
    app = expressApp;
  });
  
  test('POST /api/claude returns error when prompt is missing', async () => {
    const response = await request(app)
      .post('/api/claude')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Prompt is required');
  });
  
  test('POST /api/claude calls Claude API and returns response', async () => {
    // Mock axios response
    axios.post.mockResolvedValue({
      data: {
        content: [{ text: '# Test Itinerary' }]
      }
    });
    
    const response = await request(app)
      .post('/api/claude')
      .send({ prompt: 'Generate a trip itinerary' });
    
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: 'Generate a trip itinerary' }]
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        })
      })
    );
    
    expect(response.status).toBe(200);
    expect(response.body.content).toBe('# Test Itinerary');
  });
  
  test('POST /api/claude handles API errors gracefully', async () => {
    // Mock axios error
    axios.post.mockRejectedValue(new Error('API Error'));
    
    const response = await request(app)
      .post('/api/claude')
      .send({ prompt: 'Generate a trip itinerary' });
    
    // Should still return 200 with mock data
    expect(response.status).toBe(200);
    expect(response.body.content).toContain('Itinerary');
  });
  
  test('POST /api/claude uses mock data when API key is missing', async () => {
    // Unset API key
    process.env.ANTHROPIC_API_KEY = '';
    
    const response = await request(app)
      .post('/api/claude')
      .send({ prompt: 'Generate a 3-day trip to Paris with a budget of $1000' });
    
    // Should return mock data
    expect(response.status).toBe(200);
    expect(response.body.content).toContain('Paris');
    expect(axios.post).not.toHaveBeenCalled();
  });
});