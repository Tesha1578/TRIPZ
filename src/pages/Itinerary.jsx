import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Plus, DollarSign, Calendar, MapPin, Trash2, ShieldAlert, Sparkles, RefreshCw, Printer } from 'lucide-react';

// Fix Leaflet Default Icon bugs
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to dynamically adjust map center/bounds to show markers
function ChangeView({ center, stops }) {
  const map = useMap();
  useEffect(() => {
    if (stops && stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    } else {
      map.setView(center, 12);
    }
  }, [center, stops, map]);
  return null;
}

const Itinerary = () => {
  const navigate = useNavigate();
  const {
    onboardingData,
    selectedDestination,
    itinerary,
    loading,
    regenerateDay,
    expenses,
    addExpense,
    deleteExpense,
    getPlannedBudgetTotal
  } = useContext(TravelContext);

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [expandedDay, setExpandedDay] = useState(0); // Accordion state

  // Expense input state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Travel');

  const destination = DESTINATIONS.find(d => d.id === selectedDestination);

  // Redirection fallback
  if (!destination || !itinerary) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h3>No active trip plan.</h3>
        <p>Complete the onboarding flow to generate your itinerary.</p>
        <button onClick={() => navigate('/onboarding')} className="btn btn-primary" style={{ marginTop: '20px' }}>Start Onboarding</button>
      </div>
    );
  }

  const plannedTotal = getPlannedBudgetTotal();
  const spentTotal = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const budgetLimit = onboardingData.budget;

  const currentDayData = itinerary.days[activeDayIdx] || itinerary.days[0];
  const mapCenter = [destination.lat, destination.lng];

  // Leaflet map markers coordinates
  const stopsCoords = currentDayData?.stops || [];
  const polylineRoute = stopsCoords.map(s => [s.lat, s.lng]);

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    addExpense(expTitle, expAmount, expCategory);
    setExpTitle('');
    setExpAmount('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '60px', paddingBottom: '120px' }}>
      
      {/* Printable Area CSS Override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-itinerary, .printable-itinerary * {
            visibility: visible;
          }
          .printable-itinerary {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .non-printable {
            display: none !important;
          }
        }
      `}</style>

      <div className="container printable-itinerary">
        
        {/* Header Block */}
        <div className="non-printable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <span className="highlight-badge">{destination.state}</span>
            <h2 style={{ fontSize: '3rem', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Your Path in {destination.name}.
            </h2>
            <p>Generated itinerary for {onboardingData.days} Days • travel as {onboardingData.travelStyle}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={16} /> Export PDF / Print
            </button>
            <button onClick={() => navigate(`/destination/${destination.id}`)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={16} /> Detail Info
            </button>
          </div>
        </div>

        {/* PRINT ONLY Header */}
        <div style={{ display: 'none' }} className="printable-only-header">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>TRIPZ ITINERARY</h1>
          <h3>Destination: {destination.name}, {destination.state}</h3>
          <p>Duration: {onboardingData.days} Days | Budget Limit: ₹{budgetLimit}</p>
          <hr style={{ margin: '20px 0', borderColor: '#D8D8D8' }} />
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid-12" style={{ marginBottom: '40px' }}>
          {/* Budget Meter */}
          <div className="card card-dark" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--neon-lime)' }}>BUDGET METER</span>
              <h3 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginTop: '8px', marginBottom: '4px' }}>₹{spentTotal}</h3>
              <p style={{ fontSize: '0.8rem' }}>Spent out of planned ₹{plannedTotal} (Limit: ₹{budgetLimit})</p>
            </div>
            {/* Progress bar */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#202A2C', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (spentTotal / budgetLimit) * 100)}%`, 
                  height: '100%', 
                  backgroundColor: spentTotal > budgetLimit ? '#FF3B30' : 'var(--neon-lime)',
                  transition: 'var(--transition-smooth)'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: '#888888' }}>
                <span>0%</span>
                <span>Limit: ₹{budgetLimit}</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>PLANNING METADATA</span>
              <h3 style={{ fontSize: '1.6rem', marginTop: '12px', marginBottom: '8px' }}>Active Schedule</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <li>📅 Dates: {onboardingData.startDate || 'flexible'}</li>
                <li>👥 Style: {onboardingData.travelStyle.toUpperCase()}</li>
                <li>✨ Interests: {onboardingData.interests.join(', ')}</li>
              </ul>
            </div>
            <span className="highlight-badge" style={{ alignSelf: 'flex-start', marginBottom: 0 }}>ACTIVE PLAN</span>
          </div>

          {/* Emergency Safety Alert Card */}
          <div className="card card-lime" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ShieldAlert size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>EMERGENCY SECURITY</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginTop: '12px', marginBottom: '8px' }}>Safety Hub</h3>
              <p style={{ fontSize: '0.8rem', marginBottom: '16px' }}>
                Access direct emergency hotlines, hospitals, and police locations mapped directly to {destination.name}.
              </p>
            </div>
            <button onClick={() => navigate('/emergency')} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.75rem', borderRadius: '8px' }}>
              View Safety Shield
            </button>
          </div>
        </div>

        {/* Main Work Area Grid */}
        <div className="grid-12">
          
          {/* Left Column: Expandable Itinerary Schedule & Budget Ledger */}
          <div style={{ gridColumn: 'span 7' }}>
            
            {/* Day Switcher Tab bar */}
            <div className="non-printable" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', borderBottom: '1px solid var(--border-gray)', marginBottom: '32px' }}>
              {itinerary.days.map((d, index) => (
                <button
                  key={index}
                  onClick={() => { setActiveDayIdx(index); setExpandedDay(index); }}
                  className={`btn ${activeDayIdx === index ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '12px', whiteSpace: 'nowrap' }}
                >
                  Day {d.day} Map Route
                </button>
              ))}
            </div>

            {/* Daily Schedule List */}
            <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '24px' }}>Itinerary Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '60px' }}>
              {itinerary.days.map((d, index) => {
                const isExpanded = expandedDay === index;
                return (
                  <div 
                    key={index} 
                    className="card" 
                    style={{ 
                      padding: '24px', 
                      borderColor: activeDayIdx === index ? 'var(--text-primary)' : 'var(--border-gray)',
                      borderWidth: activeDayIdx === index ? '2px' : '1px'
                    }}
                  >
                    {/* Header */}
                    <div 
                      onClick={() => { setExpandedDay(isExpanded ? null : index); setActiveDayIdx(index); }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700' }}>DAY 0{d.day}</span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{d.date} Activities</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', backgroundColor: 'var(--light-gray)', padding: '4px 10px', borderRadius: '8px' }}>
                          Est: ₹{d.estimated_cost}
                        </span>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '1px solid var(--border-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: isExpanded ? 'rotate(45deg)' : 'none',
                          transition: 'var(--transition-smooth)',
                          backgroundColor: isExpanded ? 'var(--neon-lime)' : 'transparent'
                        }}>
                          <Plus size={14} />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    <div 
                      style={{ maxHeight: isExpanded ? '600px' : '0px', overflow: 'hidden', transition: 'max-height 0.4s ease' }}
                      hidden={!isExpanded ? "until-found" : undefined}
                    >
                      <div style={{ borderTop: '1px solid var(--border-gray)', marginTop: '20px', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>🌅 Morning</strong>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>{d.morning}</p>
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>☀️ Afternoon</strong>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>{d.afternoon}</p>
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>🌇 Evening</strong>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>{d.evening}</p>
                        </div>
                        
                        <div style={{ backgroundColor: 'var(--light-gray)', padding: '16px', borderRadius: '12px', fontSize: '0.8rem' }}>
                          <strong>💡 Transit & Notes:</strong> {d.travel_notes}
                        </div>

                        {/* Regenerate Action button */}
                        <div className="non-printable" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); regenerateDay(d.day); }} 
                            className="btn btn-secondary" 
                            style={{ display: 'inline-flex', gap: '8px', padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}
                            disabled={loading}
                          >
                            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Tweak Activities
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Budget Tracker Ledger Component */}
            <div className="non-printable" style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '24px' }}>Expense Ledger</h3>
              
              <div className="grid-12" style={{ marginBottom: '24px' }}>
                {/* Ledger input form */}
                <form onSubmit={handleAddExpenseSubmit} style={{ gridColumn: 'span 12', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Expense item (e.g. Scooter fuel)" 
                    value={expTitle} 
                    onChange={e => setExpTitle(e.target.value)} 
                    className="form-input" 
                    style={{ flex: 2, padding: '10px 16px', fontSize: '0.85rem' }} 
                  />
                  <input 
                    type="number" 
                    placeholder="Amount (₹)" 
                    value={expAmount} 
                    onChange={e => setExpAmount(e.target.value)} 
                    className="form-input" 
                    style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem' }} 
                  />
                  <select 
                    value={expCategory} 
                    onChange={e => setExpCategory(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem' }}
                  >
                    <option value="Travel">🚗 Travel</option>
                    <option value="Stay">🏨 Stay</option>
                    <option value="Food">🍛 Food</option>
                    <option value="Sightseeing">🎟️ Sights</option>
                  </select>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '12px' }}>
                    Add Expense
                  </button>
                </form>
              </div>

              {/* Expense List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {expenses.length > 0 ? (
                  expenses.map(exp => (
                    <div key={exp.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 20px',
                      border: '1px solid var(--border-gray)',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{exp.category.toUpperCase()}</span>
                        <span>{exp.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.95rem' }}>- ₹{exp.amount}</strong>
                        <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF3B30' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No expense entries logged. Add items to monitor spending.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Route Map View (Leaflet Container) */}
          <div className="non-printable" style={{ gridColumn: 'span 5', position: 'sticky', top: '100px', height: 'fit-content' }}>
            <span className="highlight-badge">ROUTE MAP</span>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Stops Route (Day {currentDayData.day})
            </h3>
            
            <div style={{ height: '360px', borderRadius: '24px', overflow: 'hidden', border: '2px solid var(--border-dark)' }}>
              <MapContainer 
                center={mapCenter} 
                zoom={12} 
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Dynamically adjust map center to fit current stops */}
                <ChangeView center={mapCenter} stops={stopsCoords} />

                {/* Day's stop Markers */}
                {stopsCoords.map((stop, sIdx) => (
                  <Marker key={sIdx} position={[stop.lat, stop.lng]}>
                    <Popup>
                      <strong>Stop {sIdx + 1}: {stop.name}</strong>
                    </Popup>
                  </Marker>
                ))}

                {/* Connecting Polyline Route */}
                {polylineRoute.length > 1 && (
                  <Polyline 
                    positions={polylineRoute} 
                    color="#080808" 
                    weight={4} 
                    dashArray="6 6"
                  />
                )}
              </MapContainer>
            </div>

            {/* List of stops */}
            <div style={{ marginTop: '20px', backgroundColor: 'var(--light-gray)', borderRadius: '16px', padding: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>Stops Sequence</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stopsCoords.map((stop, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', alignItems: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--neon-lime)',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {sIdx + 1}
                    </div>
                    <span>{stop.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Itinerary;
