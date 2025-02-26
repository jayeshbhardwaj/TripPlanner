const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if API key is set
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_api_key_here' || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      console.log('Missing or invalid API key. Please set your ANTHROPIC_API_KEY in the .env file.');
      
      // For demo purposes, return mock data instead of failing
      const mockItinerary = generateMockItinerary(prompt);
      return res.json({ content: mockItinerary });
    }
    
    console.log('Using API key:', process.env.ANTHROPIC_API_KEY);

    // Make request to Claude API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract Claude's response
    const claudeResponse = response.data.content[0].text;
    
    res.json({ content: claudeResponse });
  } catch (error) {
    console.error('Error calling Claude API:', error.response?.data || error.message);
    
    // For demo purposes, return mock data on API error
    const mockItinerary = generateMockItinerary(req.body.prompt);
    return res.json({ content: mockItinerary });
  }
});

// Function to generate mock itinerary data for demo purposes
function generateMockItinerary(prompt) {
  // Extract relevant info from prompt
  const durationMatch = prompt.match(/(\d+)-day/);
  const destinationsMatch = prompt.match(/trip to ([^with]+)/);
  const budgetMatch = prompt.match(/budget of \$([0-9,]+)/);
  
  const duration = durationMatch ? durationMatch[1] : "3";
  const destinations = destinationsMatch ? destinationsMatch[1].trim() : "Paris";
  const budget = budgetMatch ? budgetMatch[1] : "3000";

  return `# ${duration}-Day Trip to ${destinations} - Itinerary

## Trip Overview
- **Duration**: ${duration} days
- **Budget**: $${budget} USD
- **Destinations**: ${destinations}

## Day 1: Arrival and Exploration

### Morning
- Arrive at ${destinations} airport/station
- Check in at hotel/accommodation ($120)
- Breakfast at local café ($15)

### Afternoon
- Walking tour of city center (Free or $25 for guided tour)
- Visit main attractions like Central Park/Museum ($20)
- Light lunch at local restaurant ($18)

### Evening
- Dinner at popular local restaurant ($40)
- Evening stroll through historic district (Free)

## Day 2: Cultural Immersion

### Morning
- Breakfast at hotel (included)
- Visit to famous museum/landmark ($25)
- Shopping at local market (variable)

### Afternoon
- Lunch at authentic local eatery ($20)
- Visit to secondary attraction ($15)
- Coffee break at scenic spot ($5)

### Evening
- Traditional dinner experience ($50)
- Local entertainment or show ($35)

## Day 3: Nature and Relaxation

### Morning
- Breakfast at local bakery ($10)
- Day trip to nearby natural attraction ($40)
- Picnic lunch ($15)

### Afternoon
- Beach/park relaxation time (Free)
- Souvenir shopping ($50)

### Evening
- Farewell dinner at upscale restaurant ($60)
- Evening entertainment ($30)

## Budget Breakdown
- **Accommodation**: ~$360 (3 nights)
- **Food**: ~$250
- **Activities/Attractions**: ~$240
- **Transport**: ~$100
- **Shopping/Miscellaneous**: ~$100

## Remaining Budget
Approximately $${Math.floor(parseInt(budget.replace(/,/g, '')) * 0.3)} USD remaining for unexpected expenses or additional activities.

## Budget-Friendly Tips
1. Use public transportation instead of taxis
2. Visit free attractions like parks and public monuments
3. Have lunch at local markets instead of restaurants
4. Look for accommodation with breakfast included
5. Use city passes for multiple attractions

Enjoy your trip to ${destinations}!`;
}

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for testing
module.exports = { app };