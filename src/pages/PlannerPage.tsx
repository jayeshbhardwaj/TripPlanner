import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateItinerary } from '../services/claudeService';

interface TripFormData {
  budget: string;
  startDate: string;
  endDate: string;
  destinations: string;
}

interface PlannerPageProps {
  onBack: () => void;
}

const PlannerPage: React.FC<PlannerPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<TripFormData>({
    budget: '',
    startDate: '',
    endDate: '',
    destinations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get the duration in days
      const duration = getDurationInDays();
      
      // Create request options for Claude API
      const options = {
        budget: formData.budget,
        duration,
        destinations: formData.destinations
      };
      
      // Call Claude API through our service
      const response = await generateItinerary(options);
      setItinerary(response);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate itinerary. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDurationInDays = (): number => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end date
    }
    return 0;
  };

  return (
    <div className="planner-page">
      <div className="container">
        <button className="btn btn-back" onClick={onBack}>
          ← Back to Home
        </button>
        
        <h1>Plan Your Trip</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!itinerary ? (
          <div className="planner-form-container">
            <form onSubmit={handleSubmit} className="planner-form">
              <div className="form-group">
                <label htmlFor="budget">Budget (USD)</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter your budget in USD"
                  required
                />
              </div>
              
              <div className="form-group date-inputs">
                <div>
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="destinations">Destinations</label>
                <textarea
                  id="destinations"
                  name="destinations"
                  value={formData.destinations}
                  onChange={handleInputChange}
                  placeholder="Enter destinations separated by commas (e.g., Paris, London, Rome)"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Generating Itinerary with AI...' : 'Generate Itinerary'}
              </button>
            </form>
            
            <div className="form-info">
              <h3>Trip Details</h3>
              {formData.startDate && formData.endDate && (
                <p><strong>Duration:</strong> {getDurationInDays()} days</p>
              )}
              {formData.budget && (
                <p><strong>Budget:</strong> ${formData.budget} USD</p>
              )}
              {formData.destinations && (
                <p><strong>Destinations:</strong> {formData.destinations}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="itinerary-container">
            <h2>Your Personalized Itinerary</h2>
            <div className="itinerary-content">
              <ReactMarkdown>{itinerary}</ReactMarkdown>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={() => setItinerary(null)}
            >
              Plan Another Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerPage;