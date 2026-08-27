import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS, HOTELS, RESTAURANTS } from '../data/mockData';
import { ArrowLeft, ArrowRight, Star, ExternalLink, Calendar, Users, Utensils, Hotel, ArrowUpRight } from 'lucide-react';

const DestinationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { onboardingData, loading } = useContext(TravelContext);

  const destination = DESTINATIONS.find(d => d.id === id);

  if (!destination) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h3>Destination not found.</h3>
        <button onClick={() => navigate('/recommendations')} className="btn btn-primary" style={{ marginTop: '20px' }}>Back</button>
      </div>
    );
  }

  const destinationHotels = HOTELS[id] || [];
  const destinationRestaurants = RESTAURANTS[id] || [];

  // Current month matching
  let travelMonth = '';
  if (onboardingData.startDate) {
    const date = new Date(onboardingData.startDate);
    travelMonth = date.toLocaleString('default', { month: 'long' });
  } else {
    travelMonth = 'December';
  }

  const crowdLevel = destination.crowd_level_by_month[travelMonth] || "Medium";

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '60px', paddingBottom: '120px' }}>
      <div className="container">
        
        {/* Back Link */}
        <button onClick={() => navigate('/recommendations')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', padding: '8px 16px' }}>
          <ArrowLeft size={16} /> Back to Recommendations
        </button>

        {/* Hero Banner Grid */}
        <div className="grid-12" style={{ marginBottom: '80px' }}>
          {/* Details */}
          <div style={{ gridColumn: 'span 7' }}>
            <span className="highlight-badge">{destination.state}</span>
            <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.03em', marginBottom: '24px' }}>
              Explore {destination.name}.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '580px', lineHeight: '1.6' }}>
              {destination.description}
            </p>

            {/* Quick stats block */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Weather in {travelMonth}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} />
                  <span style={{ fontWeight: '700' }}>Perfect Season</span>
                </div>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Crowd Density
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} />
                  <span style={{ fontWeight: '700' }}>{crowdLevel} Crowd</span>
                </div>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Avg. Cost / Day
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '800' }}>₹{destination.avg_daily_budget}</span>
                </div>
              </div>
            </div>

            {/* Big Launch button */}
            <button 
              onClick={() => navigate('/itinerary')} 
              className="btn btn-primary animate-float"
              style={{ padding: '18px 36px', fontSize: '1.05rem', backgroundColor: 'var(--text-primary)', color: '#FFFFFF', border: '1px solid var(--border-dark)' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2.5px solid var(--neon-lime)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin-slow 1s linear infinite'
                  }}></div>
                  AI Planning in progress...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Generate Day-by-Day Itinerary <ArrowRight size={18} />
                </span>
              )}
            </button>

          </div>

          {/* Large Image Cover */}
          <div style={{ gridColumn: 'span 5', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxHeight: '380px',
              borderRadius: '24px',
              border: '2px solid var(--border-dark)',
              overflow: 'hidden'
            }}>
              <img 
                src={destination.image_url} 
                alt={destination.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Hotels and Food Section */}
        <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '60px' }}>
          <div className="grid-12">
            
            {/* Hotels Grid */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                <Hotel size={22} />
                <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Lodging Matches</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {destinationHotels.length > 0 ? (
                  destinationHotels.map(hotel => (
                    <div key={hotel.id} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{
                            backgroundColor: hotel.price_range === 'Budget' ? 'var(--neon-lime)' : 'var(--text-primary)',
                            color: hotel.price_range === 'Budget' ? 'var(--text-primary)' : '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {hotel.price_range.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '700' }}>
                            <Star size={12} fill="#FFCC00" color="#FFCC00" /> {hotel.rating}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{hotel.name}</h4>
                        <p style={{ fontSize: '0.8rem' }}>Est. Room Charge: <strong style={{ color: 'var(--text-primary)' }}>₹{hotel.price}/night</strong></p>
                      </div>
                      <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.75rem', borderRadius: '8px' }}>
                        Book <ArrowUpRight size={12} />
                      </a>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic' }}>No registered hotels available. Fallback to generic booking portals.</p>
                )}
              </div>
            </div>

            {/* Restaurants Grid */}
            <div style={{ gridColumn: 'span 6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                <Utensils size={22} />
                <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Food Stops</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {destinationRestaurants.length > 0 ? (
                  destinationRestaurants.map(rest => (
                    <div key={rest.id} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{
                            backgroundColor: rest.veg_nonveg === 'Veg' ? '#34C759' : '#FF3B30',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {rest.veg_nonveg.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '700' }}>
                            <Star size={12} fill="#FFCC00" color="#FFCC00" /> {rest.rating}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• {rest.price_range}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{rest.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cuisine: {rest.cuisine_type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic' }}>No registered restaurants available. Fallback to local street cafes.</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DestinationDetail;
