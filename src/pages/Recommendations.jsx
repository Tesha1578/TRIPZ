import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { ArrowRight, Flame, CloudSun, Users, CheckCircle, ArrowLeft } from 'lucide-react';

const Recommendations = () => {
  const navigate = useNavigate();
  const { getRecommendations, onboardingData, setSelectedDestination, generateItinerary } = useContext(TravelContext);

  const recommendations = getRecommendations();

  // Find travel month if date is provided
  let travelMonth = '';
  if (onboardingData.startDate) {
    const date = new Date(onboardingData.startDate);
    travelMonth = date.toLocaleString('default', { month: 'long' });
  } else {
    travelMonth = 'December'; // fallback
  }

  const handleSelectDestination = (id) => {
    setSelectedDestination(id);
    generateItinerary(id); // launches background simulation or API call
    navigate(`/destination/${id}`); // first show details page, from there they view itinerary
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '80px', paddingBottom: '120px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '60px' }}>
          <div>
            <span className="highlight-badge">RESULTS</span>
            <h2 style={{ fontSize: '3rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Your matched paths.
            </h2>
            <p style={{ maxWidth: '520px' }}>
              Scored based on interests ({onboardingData.interests.join(', ')}), budget limit (₹{onboardingData.budget}), and seasonal conditions in {travelMonth}.
            </p>
          </div>
          <button onClick={() => navigate('/onboarding')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Re-configure
          </button>
        </div>

        {/* Results grid */}
        <div className="grid-12">
          {recommendations.length > 0 ? (
            recommendations.map(dest => {
              // Convert score to percentage representation
              const scorePct = Math.min(100, Math.max(10, dest.score + 50));
              const crowdLevel = dest.crowd_level_by_month[travelMonth] || "Medium";
              const totalEst = dest.avg_daily_budget * onboardingData.days;
              const fitsBudget = totalEst <= onboardingData.budget;

              return (
                <div key={dest.id} className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                  {/* Image cover */}
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={dest.image_url} 
                      alt={dest.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
                      className="dest-card-img"
                    />
                    {/* Match Score Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--neon-lime)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--neon-lime)'
                    }}>
                      {scorePct}% MATCH
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px', flexGrow: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{dest.name}</h3>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{dest.state}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dest.description}
                      </p>

                      {/* Climate & Crowd indicators */}
                      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-gray)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                          <CloudSun size={16} />
                          <span>{travelMonth}: Best Month</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                          <Users size={16} />
                          <span>Crowd: <strong style={{ color: crowdLevel === 'High' ? '#FF3B30' : crowdLevel === 'Low' ? '#34C759' : '#FF9500' }}>{crowdLevel}</strong></span>
                        </div>
                      </div>

                      {/* Checklist / Reasons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                        {dest.reasons.map((reason, rIdx) => (
                          <div key={rIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                            <CheckCircle size={14} color="var(--text-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-secondary)' }}>ESTIMATED TOTAL</span>
                        <strong style={{ fontSize: '1.2rem', color: fitsBudget ? 'var(--text-primary)' : '#FF9500' }}>
                          ₹{totalEst}
                        </strong>
                      </div>
                      <button onClick={() => handleSelectDestination(dest.id)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
                        Explore <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: '60px 0' }}>
              <h3>No recommendations found matching your criteria.</h3>
              <p>Try expanding your budget or choosing different interests.</p>
              <button onClick={() => navigate('/onboarding')} className="btn btn-primary" style={{ marginTop: '20px' }}>Re-plan</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Recommendations;
