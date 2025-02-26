import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('App Component', () => {
  test('renders homepage initially', () => {
    render(<App />);
    
    // Check if the homepage elements are rendered
    expect(screen.getByText('Trip Planner')).toBeInTheDocument();
    expect(screen.getByText('Plan your perfect trip with AI assistance')).toBeInTheDocument();
    expect(screen.getByText('Your Next Adventure Awaits')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('navigates to planner page when Get Started button is clicked', () => {
    render(<App />);
    
    // Find and click the Get Started button
    const getStartedButton = screen.getByText('Get Started');
    fireEvent.click(getStartedButton);
    
    // Check if the planner page is rendered
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });

  test('navigates back to homepage from planner page', () => {
    render(<App />);
    
    // Navigate to planner page
    const getStartedButton = screen.getByText('Get Started');
    fireEvent.click(getStartedButton);
    
    // Find and click the Back button
    const backButton = screen.getByText('← Back to Home');
    fireEvent.click(backButton);
    
    // Check if the homepage is rendered again
    expect(screen.getByText('Trip Planner')).toBeInTheDocument();
    expect(screen.getByText('Your Next Adventure Awaits')).toBeInTheDocument();
  });
});