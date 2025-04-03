import React from 'react';
import { useUser } from '../../contexts/UserContext';
import '../../styles/HomePage.css';

const HomePage: React.FC = () => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <header className="header">
        <h1>FixItMixit</h1>
        <p>Structured conflict resolution for better relationships</p>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Resolve conflicts with clarity and purpose</h2>
          <p>
            FixItMixit provides a structured approach to conflict resolution,
            helping you and your partner communicate effectively and reach
            meaningful resolutions.
          </p>

          {currentUser ? (
            <div className="cta-buttons">
              <button type="button" className="primary-button">Start New Session</button>
              <button type="button" className="secondary-button">View Past Sessions</button>
            </div>
          ) : (
            <div className="cta-buttons">
              <button type="button" className="primary-button">Sign Up</button>
              <button type="button" className="secondary-button">Learn More</button>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>1. Agree on the Issue</h3>
            <p>Start by clearly defining the specific issue you want to resolve.</p>
          </div>

          <div className="feature-card">
            <h3>2. Understand Each Other</h3>
            <p>Demonstrate that you understand your partner's perspective before sharing your own.</p>
          </div>

          <div className="feature-card">
            <h3>3. Structured Discussion</h3>
            <p>Engage in a point-by-point discussion with AI assistance to identify unproductive patterns.</p>
          </div>

          <div className="feature-card">
            <h3>4. Reach Resolution</h3>
            <p>Work together to find a mutually agreeable resolution to the issue.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
