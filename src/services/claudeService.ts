// Service to call Claude API

interface ClaudeRequestOptions {
  budget: string;
  duration: number;
  destinations: string;
}

export const generateItinerary = async (options: ClaudeRequestOptions): Promise<string> => {
  try {
    const { budget, duration, destinations } = options;
    
    // Create prompt for Claude
    const prompt = `Generate a detailed ${duration}-day travel itinerary for a trip to ${destinations} with a budget of $${budget} USD.

Please include:
1. Day-by-day breakdown with morning, afternoon, and evening activities
2. Estimated costs for major expenses (accommodation, transportation, activities, meals)
3. Budget-friendly tips and alternatives
4. Remaining budget estimate
5. Any must-see attractions or experiences

Make the itinerary realistic based on the budget provided and the destinations selected.
Format the response in a clean, readable way using markdown.`;

    // Call Claude API using server-side proxy
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate itinerary');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return `Sorry, there was an error generating your itinerary. Please try again later.

Error details: ${error instanceof Error ? error.message : String(error)}`;
  }
};