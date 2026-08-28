import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS, HOTELS, RESTAURANTS } from '../data/mockData';
import { ArrowLeft, ArrowRight, Star, Calendar, Users, Utensils, Hotel, ArrowUpRight, Leaf, ShieldAlert, Award, Compass, Plus, MessageSquare } from 'lucide-react';

const DestinationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    onboardingData, 
    loading, 
    crowdCheckIns, 
    addCrowdCheckIn,
    localListings,
    addLocalListing 
  } = useContext(TravelContext);

  const destination = DESTINATIONS.find(d => d.id === id);

  // Form states for adding business listings
  const [showListForm, setShowListForm] = useState(false);
  const [bizName, setBizName] = useState('');
  const [bizType, setBizType] = useState('guide');
  const [bizDesc, setBizDesc] = useState('');
  const [bizPrice, setBizPrice] = useState('');
  const [bizContact, setBizContact] = useState('');

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

  // Filter listings by destination
  const listingsForDest = localListings.filter(l => l.destinationId === id);

  // Current month matching
  let travelMonth = '';
  if (onboardingData.startDate) {
    const date = new Date(onboardingData.startDate);
    travelMonth = date.toLocaleString('default', { month: 'long' });
  } else {
    travelMonth = 'December';
  }

  // --- CROWD LEVEL RESOLVER (Live vs Static) ---
  const recentCheckIns = crowdCheckIns.filter(c => c.destinationId === id && (Date.now() - c.timestamp) < 6 * 60 * 60 * 1000);
  const totalVotes = recentCheckIns.length;
  const busyCount = recentCheckIns.filter(c => c.level === 'high').length;
  const modCount = recentCheckIns.filter(c => c.level === 'medium').length;
  const quietCount = recentCheckIns.filter(c => c.level === 'low').length;
  
  let currentLiveCrowd = destination.crowd_level_by_month[travelMonth] || "Medium";
  let isLiveSignal = false;

  if (totalVotes > 0) {
    isLiveSignal = true;
    if (busyCount >= modCount && busyCount >= quietCount) {
      currentLiveCrowd = "High Density";
    } else if (quietCount >= busyCount && quietCount >= modCount) {
      currentLiveCrowd = "Low Density";
    } else {
      currentLiveCrowd = "Moderate Density";
    }
  }

  // Handle business submission
  const handleListBizSubmit = (e) => {
    e.preventDefault();
    if (!bizName || !bizDesc || !bizPrice || !bizContact) {
      alert("Please fill all details to register your local operator business.");
      return;
    }
    addLocalListing(id, {
      owner_name: bizName,
      type: bizType,
      description: bizDesc,
      price: parseFloat(bizPrice),
      contact: bizContact
    });
    
    setBizName('');
    setBizDesc('');
    setBizPrice('');
    setBizContact('');
    setShowListForm(false);
    alert("🎉 Listing submitted! It is now visible on the discoveries catalog.");
  };

  const getEcoAdvice = (score) => {
    if (score >= 90) return "Ultra-Sustainable. Zero plastic zone. Rent bicycles to explore routes.";
    if (score >= 80) return "Highly eco-conscious. Support local homestays and organic farm markets.";
    return "Medium footprint. Minimize motor usage. Prefer shared local transport services.";
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '60px', paddingBottom: '120px' }}>
      <div className="container">
        
        {/* Back Link */}
        <button onClick={() => navigate('/recommendations')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', padding: '8px 16px' }}>
          <ArrowLeft size={16} /> Back to Recommendations
        </button>

        {/* Hero Banner Grid */}
        <div className="grid-12" style={{ marginBottom: '60px' }}>
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
            <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
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
                  Crowd Density {isLiveSignal && <span style={{ color: '#34C759', fontWeight: '800', fontSize: '0.65rem' }}>● LIVE</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} />
                  <span style={{ fontWeight: '700', color: isLiveSignal ? 'var(--text-primary)' : 'inherit' }}>
                    {currentLiveCrowd}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Eco-Rating
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34C759' }}>
                  <Leaf size={18} fill="#34C759" />
                  <span style={{ fontWeight: '800' }}>{destination.eco_score}/100</span>
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
          <div style={{ gridColumn: 'span 5', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '100%',
              maxHeight: '280px',
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
            
            {/* Sustainability Badge advice Card */}
            <div style={{
              backgroundColor: '#F2FBF4',
              border: '1px solid #C2E7C9',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <Leaf size={20} color="#34C759" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#1B5E20' }}>Eco-Conscious Travel Tip</strong>
                <p style={{ fontSize: '0.8rem', color: '#2E7D32', marginTop: '2px' }}>
                  {getEcoAdvice(destination.eco_score)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Crowdsourced Check-In and Live Vote Widget */}
        <div style={{
          backgroundColor: 'var(--light-gray)',
          border: '1px solid var(--border-gray)',
          borderRadius: '24px',
          padding: '24px 32px',
          marginBottom: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>How busy is {destination.name} right now?</h3>
            <p style={{ fontSize: '0.8rem' }}>
              {totalVotes > 0 
                ? `Updated live by ${totalVotes} travelers nearby in the last 6 hours.`
                : "No check-ins logged recently. Be the first to report crowd signals!"
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => { addCrowdCheckIn(destination.id, 'low'); alert("Check-in reported: Quiet crowd level."); }}
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
            >
              🟢 Quiet
            </button>
            <button 
              onClick={() => { addCrowdCheckIn(destination.id, 'medium'); alert("Check-in reported: Moderate crowd level."); }}
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
            >
              🟡 Moderate
            </button>
            <button 
              onClick={() => { addCrowdCheckIn(destination.id, 'high'); alert("Check-in reported: Busy crowd level."); }}
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.75rem', backgroundColor: '#FFFFFF' }}
            >
              🔴 Busy
            </button>
          </div>
        </div>

        {/* Lodgings and Food matched (Static standard catalogs) */}
        <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '60px', marginBottom: '80px' }}>
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

        {/* Local Discoveries Marketplace (COMMISSION / MONETIZATION LAYER MOCK) */}
        <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={24} color="var(--text-primary)" />
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Local Discoveries Marketplace</h3>
            </div>
            
            <button 
              onClick={() => setShowListForm(!showListForm)} 
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.8rem' }}
            >
              <Plus size={16} /> List Your Business
            </button>
          </div>

          {/* Slide down List your Business form */}
          {showListForm && (
            <div style={{
              backgroundColor: 'var(--light-gray)',
              border: '1.5px solid var(--border-dark)',
              borderRadius: '24px',
              padding: '32px',
              marginBottom: '40px',
              animation: 'fadeIn 0.3s ease'
            }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Register Local Operator Listing</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Join the TRIPZ partner program. Get discovered directly by Gen Z travelers planning their vibes.
              </p>

              <form onSubmit={handleListBizSubmit} className="grid-12">
                <div style={{ gridColumn: 'span 4' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>BUSINESS NAME</label>
                  <input type="text" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="e.g. Raju's Coracle Tours" className="form-input" required />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>BUSINESS TYPE</label>
                  <select value={bizType} onChange={e => setBizType(e.target.value)} className="form-input" style={{ padding: '14px 16px' }}>
                    <option value="guide">👤 Certified Local Guide</option>
                    <option value="homestay">🏡 Cozy Homestay</option>
                    <option value="experience">🧗 Adventure Experience</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>PRICE / RATE (₹ INR)</label>
                  <input type="number" value={bizPrice} onChange={e => setBizPrice(e.target.value)} placeholder="e.g. 1500" className="form-input" required />
                </div>
                <div style={{ gridColumn: 'span 8' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>SERVICE DESCRIPTION</label>
                  <input type="text" value={bizDesc} onChange={e => setBizDesc(e.target.value)} placeholder="Briefly describe what makes this service unique..." className="form-input" required />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>CONTACT / WHATSAPP</label>
                  <input type="text" value={bizContact} onChange={e => setBizContact(e.target.value)} placeholder="e.g. +91 99999 88888" className="form-input" required />
                </div>
                <div style={{ gridColumn: 'span 12', display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.8rem' }}>Register Listing</button>
                  <button type="button" onClick={() => setShowListForm(false)} className="btn btn-secondary" style={{ padding: '10px 24px', fontSize: '0.8rem' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Directory Grid */}
          <div className="grid-12">
            {listingsForDest.length > 0 ? (
              listingsForDest.map(listing => (
                <div key={listing.id} className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px' }}>
                  <div>
                    {/* Header tags */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{
                        backgroundColor: listing.type === 'guide' ? '#007AFF' : listing.type === 'homestay' ? '#5856D6' : '#FF9500',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {listing.type}
                      </span>
                      {listing.verified ? (
                        <span style={{ color: '#34C759', fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Award size={12} /> VERIFIED
                        </span>
                      ) : (
                        <span style={{ color: '#888888', fontSize: '0.65rem', fontWeight: '800' }}>COMMUNITY</span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{listing.owner_name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: '1.5' }}>
                      {listing.description}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>CHARGES</span>
                      <strong style={{ fontSize: '1.15rem' }}>₹{listing.price}{listing.type === 'homestay' ? '/night' : '/day'}</strong>
                    </div>
                    
                    <button 
                      onClick={() => alert(`💬 WhatsApp enquiry packet generated and routed to ${listing.owner_name} (${listing.contact}). They will contact you shortly!`)}
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MessageSquare size={12} /> Contact
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border-gray)', borderRadius: '20px' }}>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>No local marketplace listings cataloged for this destination yet.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Be the first operator to list your guiding or homestay service above!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DestinationDetail;
