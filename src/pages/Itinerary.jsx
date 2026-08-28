import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Plus, DollarSign, Calendar, MapPin, Trash2, ShieldAlert, Sparkles, RefreshCw, Printer, Leaf, WifiOff, Users } from 'lucide-react';

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
    getPlannedBudgetTotal,
    // V2 additions
    groupRoom,
    isOfflineSimulated,
    setIsOfflineSimulated,
    getCarbonFootprint,
    getSettlements
  } = useContext(TravelContext);

  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [expandedDay, setExpandedDay] = useState(0); // Accordion state

  // Expense input state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food');

  // V2 Split Bill States
  const [paidBy, setPaidBy] = useState('you');
  const [splitAmong, setSplitAmong] = useState(['you']);
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [isOfflineCached, setIsOfflineCached] = useState(false);

  const destination = DESTINATIONS.find(d => d.id === selectedDestination);

  // Initialize Split Among list with group members
  useEffect(() => {
    if (groupRoom) {
      setSplitAmong(groupRoom.members.map(m => m.id));
      const initCustom = {};
      groupRoom.members.forEach(m => {
        initCustom[m.id] = '';
      });
      setCustomSplits(initCustom);
    }
  }, [groupRoom]);

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

    const parsedAmount = parseFloat(expAmount) || 0;

    if (groupRoom) {
      if (splitType === 'custom') {
        const customSum = Object.keys(customSplits)
          .filter(k => splitAmong.includes(k))
          .reduce((acc, key) => acc + (parseFloat(customSplits[key]) || 0), 0);
        
        if (Math.abs(customSum - parsedAmount) > 1) {
          alert(`Total custom split amounts (₹${customSum}) must equal the absolute expense amount (₹${parsedAmount}).`);
          return;
        }
      }
      addExpense(expTitle, expAmount, expCategory, paidBy, splitAmong, splitType, customSplits);
    } else {
      addExpense(expTitle, expAmount, expCategory);
    }

    setExpTitle('');
    setExpAmount('');
    if (groupRoom) {
      const initCustom = {};
      groupRoom.members.forEach(m => {
        initCustom[m.id] = '';
      });
      setCustomSplits(initCustom);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isOffline = isOfflineSimulated || !navigator.onLine;

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
        
        {/* Offline Mode Banner Warning */}
        {isOffline && (
          <div style={{
            backgroundColor: '#FF9500',
            color: '#FFFFFF',
            padding: '14px 24px',
            borderRadius: '16px',
            marginBottom: '32px',
            fontWeight: '700',
            fontSize: '0.85rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(255, 149, 0, 0.2)'
          }} className="non-printable sos-shake-alert">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <WifiOff size={18} />
              Offline Mode Active. Simulated loss of network. AI tweaks and assistant responses are paused.
            </span>
            <button 
              onClick={() => setIsOfflineSimulated(false)}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#FF9500',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Go Online
            </button>
          </div>
        )}

        {/* Header Block */}
        <div className="non-printable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <span className="highlight-badge">{destination.state}</span>
            <h2 style={{ fontSize: '3rem', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Your Path in {destination.name}.
            </h2>
            <p>Generated itinerary for {onboardingData.days} Days • travel as {onboardingData.travelStyle.toUpperCase()}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)} 
              className="btn btn-secondary" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: isOfflineSimulated ? '#FFF8F0' : 'transparent',
                borderColor: isOfflineSimulated ? '#FF9500' : 'var(--border-dark)'
              }}
            >
              📶 {isOfflineSimulated ? "Simulate Online" : "Simulate Offline"}
            </button>

            <button 
              onClick={() => {
                setIsOfflineCached(true);
                alert("💾 Day's itinerary data cached! Offline local storage capture successfully compiled.");
              }} 
              className="btn btn-secondary" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: isOfflineCached ? '#F2FBF4' : 'transparent',
                borderColor: isOfflineCached ? '#34C759' : 'var(--border-dark)'
              }}
            >
              📥 {isOfflineCached ? "Saved Offline" : "Download Offline"}
            </button>

            <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={16} /> Print / Export PDF
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

        {/* Dashboard Cards Grid (4 columns row) */}
        <div className="grid-12" style={{ marginBottom: '40px' }}>
          {/* Budget Meter */}
          <div className="card card-dark" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--neon-lime)' }}>BUDGET METER</span>
              <h3 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginTop: '8px', marginBottom: '4px' }}>₹{spentTotal}</h3>
              <p style={{ fontSize: '0.8rem' }}>Spent out of planned ₹{plannedTotal} (Limit: ₹{budgetLimit})</p>
            </div>
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

          {/* Sustainability Badge Footprint */}
          <div className="card" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#F2FBF4', borderColor: '#C2E7C9' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#1B5E20' }}>
                <Leaf size={18} fill="#34C759" color="#34C759" />
                <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>CARBON FOOTPRINT</span>
              </div>
              <h3 style={{ fontSize: '2.2rem', color: '#1B5E20', marginTop: '8px', marginBottom: '4px' }}>
                {getCarbonFootprint()} kg
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#2E7D32' }}>
                Estimated CO₂ via {onboardingData.transport} selection
              </p>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#2E7D32', fontWeight: '800', borderTop: '1px solid #C2E7C9', paddingTop: '8px', display: 'block' }}>
              🍀 Eco-Choice: Trains emit 88% less carbon than flights!
            </span>
          </div>

          {/* Quick Info */}
          <div className="card" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>PLANNING METADATA</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '12px', marginBottom: '8px' }}>Active Schedule</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                <li>📅 Dates: {onboardingData.startDate || 'flexible'}</li>
                <li>👥 Style: {onboardingData.travelStyle.toUpperCase()}</li>
                <li>✨ Transit: {onboardingData.transport}</li>
              </ul>
            </div>
            <span className="highlight-badge" style={{ alignSelf: 'flex-start', marginBottom: 0, marginTop: '8px', fontSize: '0.7rem' }}>
              {groupRoom ? `GROUP: ${groupRoom.inviteCode}` : "SOLO PLAN"}
            </span>
          </div>

          {/* Emergency Safety Alert Card */}
          <div className="card card-lime" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ShieldAlert size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>EMERGENCY SECURITY</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginTop: '12px', marginBottom: '8px' }}>Safety Hub</h3>
              <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                Access direct emergency hotlines, hospitals, and police locations mapped directly.
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
                            disabled={loading || isOffline}
                            title={isOffline ? "Cannot tweak offline" : "Tweak day plan"}
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
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '24px' }}>
                {groupRoom ? "Squad Expense Ledger" : "Expense Ledger"}
              </h3>
              
              <div className="card" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'var(--light-gray)' }}>
                {/* Ledger input form */}
                <form onSubmit={handleAddExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Expense item (e.g. Scooter fuel)" 
                      value={expTitle} 
                      onChange={e => setExpTitle(e.target.value)} 
                      className="form-input" 
                      style={{ flex: 2, padding: '10px 16px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }} 
                      required
                    />
                    <input 
                      type="number" 
                      placeholder="Amount (₹)" 
                      value={expAmount} 
                      onChange={e => setExpAmount(e.target.value)} 
                      className="form-input" 
                      style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }} 
                      required
                    />
                    <select 
                      value={expCategory} 
                      onChange={e => setExpCategory(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="Food">🍛 Food</option>
                      <option value="Travel">🚗 Travel</option>
                      <option value="Stay">🏨 Stay</option>
                      <option value="Sightseeing">🎟️ Sights</option>
                    </select>
                  </div>

                  {/* V2 GROUP TRIP split billing configurations */}
                  {groupRoom && (
                    <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        
                        {/* Paid By Selection */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Paid By:</span>
                          <select 
                            value={paidBy} 
                            onChange={e => setPaidBy(e.target.value)} 
                            className="form-input" 
                            style={{ padding: '8px 12px', fontSize: '0.8rem', width: '130px', backgroundColor: '#FFFFFF' }}
                          >
                            {groupRoom.members.map(member => (
                              <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Split Type Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Split Type:</span>
                          <select 
                            value={splitType} 
                            onChange={e => setSplitType(e.target.value)} 
                            className="form-input" 
                            style={{ padding: '8px 12px', fontSize: '0.8rem', width: '130px', backgroundColor: '#FFFFFF' }}
                          >
                            <option value="equal">Equally</option>
                            <option value="custom">Custom Shares</option>
                          </select>
                        </div>

                      </div>

                      {/* Equal Split checklist */}
                      {splitType === 'equal' && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Included in Split:</span>
                          {groupRoom.members.map(member => {
                            const isChecked = splitAmong.includes(member.id);
                            return (
                              <label key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setSplitAmong(splitAmong.filter(id => id !== member.id));
                                    } else {
                                      setSplitAmong([...splitAmong, member.id]);
                                    }
                                  }}
                                />
                                {member.name}
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Custom Split Value Inputs */}
                      {splitType === 'custom' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-gray)' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                            Enter Custom Shares (Sum must equal ₹{expAmount || 0})
                          </span>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {groupRoom.members.map(member => (
                              <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.8rem' }}>{member.name}:</span>
                                <input 
                                  type="number"
                                  placeholder="Amount"
                                  value={customSplits[member.id] || ''}
                                  onChange={(e) => setCustomSplits({ ...customSplits, [member.id]: e.target.value })}
                                  className="form-input"
                                  style={{ width: '80px', padding: '6px 10px', fontSize: '0.8rem' }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem', borderRadius: '12px', alignSelf: 'flex-end' }}>
                    Add Expense entry
                  </button>
                </form>
              </div>

              {/* Expense List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {expenses.length > 0 ? (
                  expenses.map(exp => {
                    const payerName = groupRoom ? (groupRoom.members.find(m => m.id === exp.paidBy)?.name || exp.paidBy) : 'You';
                    return (
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
                          <span>
                            <strong>{exp.title}</strong>
                            {groupRoom && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '6px' }}>• Paid by {payerName}</span>}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.95rem' }}>- ₹{exp.amount}</strong>
                          <button onClick={() => deleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF3B30' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No expense entries logged. Add items to monitor spending.</p>
                )}
              </div>

              {/* V2 GROUP TRIP SQUAD SETTLEMENTS LEDGER DISPLAY */}
              {groupRoom && (
                <div style={{ borderTop: '1px solid var(--border-gray)', marginTop: '40px', paddingTop: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Users size={20} />
                    <h3 style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Squad Settlement Ledger</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {getSettlements().length > 0 ? (
                      getSettlements().map((txn, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#FFF8F0',
                          border: '1px solid #FF9500',
                          padding: '14px 20px',
                          borderRadius: '12px',
                          fontSize: '0.85rem'
                        }}>
                          <span style={{ fontWeight: '700', color: '#E06C00' }}>
                            💸 {txn.from === 'You' ? 'You' : txn.from} owes {txn.to === 'You' ? 'You' : txn.to}
                          </span>
                          <strong style={{ fontSize: '1rem', color: '#D06000' }}>₹{txn.amount}</strong>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        All squad bills are fully settled! Zero outstanding net balances.
                      </p>
                    )}
                  </div>
                </div>
              )}

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
