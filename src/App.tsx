import React, { useState } from 'react';
import travelImage from './images/luca-bravo-O453M2Liufs-unsplash.jpg';
import PlannerPage from './pages/PlannerPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'planner'>('home');

  const navigateToPlanner = () => {
    setCurrentPage('planner');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const renderHomePage = () => (
    <>
      <header className="header">
        <div className="container">
          <h1>Trip Planner</h1>
          <p>Plan your perfect trip with AI assistance</p>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          <div className="hero">
            <div className="hero-content">
              <h2>Your Next Adventure Awaits</h2>
              <p>Create personalized itineraries based on your budget, timeline, and destinations</p>
              <button className="btn btn-primary" onClick={navigateToPlanner}>Get Started</button>
            </div>
            <div className="hero-image">
              <img 
                src={travelImage} 
                alt="Scenic mountain landscape" 
                className="travel-img" 
              />
            </div>
          </div>
          
          <section className="features">
            <h2>How It Works</h2>
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Set Your Budget</h3>
                <p>Tell us how much you want to spend</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h3>Pick Your Dates</h3>
                <p>Choose how many days you'll be traveling</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Select Destinations</h3>
                <p>Add the places you want to visit</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✨</div>
                <h3>Get Your Itinerary</h3>
                <p>Receive AI-powered recommendations</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Trip Planner - AI-Powered Travel Itineraries</p>
        </div>
      </footer>
    </>
  );

  return (
    <div className="app">
      {currentPage === 'home' ? (
        renderHomePage()
      ) : (
        <PlannerPage onBack={navigateToHome} />
      )}
    </div>
  );
};

export default App;