# TripPlanner

## Overview
TripPlanner is an AI-powered travel itinerary generator. Given a budget, time frame, and list of destinations, it uses Claude AI to create a detailed itinerary that includes activities, estimated costs, and budget-friendly suggestions.

## Features
- Input your budget in USD
- Select travel dates to determine trip duration
- Specify multiple destinations
- Receive a detailed day-by-day travel itinerary
- Get recommendations within your budget constraints
- View cost breakdowns and remaining budget estimates

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Anthropic API key for Claude

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/tripplanner.git
cd tripplanner
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your Anthropic API key to the `.env` file

```
ANTHROPIC_API_KEY=your_api_key_here
```

4. Start the development server
```
npm run dev
```

This will start both the frontend server (port 3000) and the backend server (port 3001).

## Usage
1. Visit http://localhost:3000 in your browser
2. Click "Get Started"
3. Enter your budget, dates, and destinations
4. Click "Generate Itinerary"
5. View your personalized travel plan!

## Built With
- React with TypeScript
- Express.js backend
- Claude AI by Anthropic
- Webpack

