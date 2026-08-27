import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS, EMERGENCY_CONTACTS } from '../data/mockData';
import { 
  ArrowRight, Compass, ShieldAlert, Sparkles, MapPin, Activity, HelpCircle, 
  X, Check, AlertCircle, Phone, HeartPulse, Shield, DollarSign, Plus, Trash2, Languages
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { toggleChat } = useContext(TravelContext);
  
  // State for interactive homepage preview modules
  const [activePreview, setActivePreview] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // States for Mini Onboarding Module
  const [miniBudget, setMiniBudget] = useState(15000);
  const [miniStyle, setMiniStyle] = useState('solo');
  const [miniInterests, setMiniInterests] = useState(['beach']);

  // States for Mini Recommendations Module
  const [recoBudget, setRecoBudget] = useState(25000);
  const [recoInterest, setRecoInterest] = useState('adventure');

  // States for Mini Planner Module
  const [planDay, setPlanDay] = useState(1);

  // States for Mini Safety Module
  const [safetyCity, setSafetyCity] = useState('goa');

  // States for Mini Budget Module
  const [miniExpenses, setMiniExpenses] = useState([
    { id: 1, title: 'Zostel Stay', amount: 800, category: 'Stay' },
    { id: 2, title: 'Scooter Rental', amount: 350, category: 'Travel' }
  ]);
  const [miniExpName, setMiniExpName] = useState('');
  const [miniExpAmount, setMiniExpAmount] = useState('');

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const services = [
    {
      id: "onboarding",
      num: "01",
      title: "Smart Onboarding",
      desc: "Customize your budget, duration, preferred travel style, and interests seamlessly inside a multi-step dynamic onboarding flow.",
      theme: "light",
      icon: <Compass size={24} />
    },
    {
      id: "recommendations",
      num: "02",
      title: "Recommendation Engine",
      desc: "Our automated filtering system overlays weather statistics, average budgets, and monthly crowd levels to recommend the perfect fit.",
      theme: "lime",
      icon: <Sparkles size={24} />
    },
    {
      id: "planner",
      num: "03",
      title: "AI Daily Planner",
      desc: "Generates custom day-by-day itineraries including hotels, restaurants, local sights, and coordinates for map navigation.",
      theme: "dark",
      icon: <Activity size={24} />
    },
    {
      id: "safety",
      num: "04",
      title: "Safety Shield",
      desc: "Access emergency numbers, hospital grids, police stations, and helplines mapped specifically to your selected destination.",
      theme: "light",
      icon: <ShieldAlert size={24} />
    },
    {
      id: "chat",
      num: "05",
      title: "Chat & Translator",
      desc: "Persistent helper chatbot converts prompts into local dialects (Konkani, Malayalam, Ladakhi) with pronunciation guides.",
      theme: "lime",
      icon: <HelpCircle size={24} />
    },
    {
      id: "budget",
      num: "06",
      title: "Budget Tracker",
      desc: "Live ledger showing planned costs vs actual expenses, helping travelers monitor their budget limit in real-time.",
      theme: "dark",
      icon: <MapPin size={24} />
    }
  ];

  const processSteps = [
    { num: "01", title: "Select Parameters", desc: "Input your budget limit, trip length, and interests (beaches, waterfalls, mountains, etc.) during onboarding." },
    { num: "02", title: "Receive Recommendations", desc: "Compare destinations using crowd index graphs and weather charts to pick your dream spot." },
    { num: "03", title: "Generate & Tweak", desc: "Create an interactive itinerary with custom stops. Tweak individual day plans or regenerate activities." },
    { num: "04", title: "Travel Safely", desc: "Utilize local language translator sheets and quick-access tap-to-call emergency safety contacts offline." }
  ];

  // Helper function to handle Mini Budget Ledger add
  const handleAddMiniExpense = (e) => {
    e.preventDefault();
    if (!miniExpName || !miniExpAmount) return;
    setMiniExpenses([
      ...miniExpenses,
      {
        id: Date.now(),
        title: miniExpName,
        amount: parseFloat(miniExpAmount),
        category: 'Food'
      }
    ]);
    setMiniExpName('');
    setMiniExpAmount('');
  };

  // Helper function to handle Mini Budget Ledger delete
  const handleDeleteMiniExpense = (id) => {
    setMiniExpenses(miniExpenses.filter(item => item.id !== id));
  };

  // Get matching destination count for Reco Engine Preview
  const getRecoMatchCount = () => {
    return DESTINATIONS.filter(dest => {
      const matchInterest = dest.tags.includes(recoInterest);
      const matchBudget = (dest.avg_daily_budget * 3) <= recoBudget;
      return matchInterest && matchBudget;
    });
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={{ paddingTop: '80px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="grid-12" style={{ alignItems: 'center' }}>
            {/* Left Side: Headline & CTA */}
            <div style={{ gridColumn: 'span 6', paddingRight: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <span className="highlight-badge">TRIPZ // Autonomous travel system</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                letterSpacing: '-0.04em',
                lineHeight: '0.95',
                color: 'var(--text-primary)',
                marginBottom: '32px'
              }}>
                Navigating the<br />
                digital landscape<br />
                for discovery
              </h1>
              <p style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                marginBottom: '40px',
                maxWidth: '460px',
                lineHeight: '1.6'
              }}>
                An AI-driven companion matching budgets, seasons, and personal interests into a single, cohesive travel experience. Ditch the multiple browser tabs.
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button onClick={() => navigate('/onboarding')} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                  Plan My Trip <ArrowRight size={18} />
                </button>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ color: 'var(--text-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Right Side: Unique Editorial Custom Illustration Card */}
            <div style={{ gridColumn: 'span 6', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                width: '100%',
                maxWidth: '460px',
                height: '460px',
                backgroundColor: 'var(--light-gray)',
                borderRadius: '32px',
                border: '2px solid var(--border-dark)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="/hero-tripz.jpg" 
                  alt="Tripz Journey Illustration" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Floating Elements Overlapping */}
                <div className="animate-float" style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border-dark)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  zIndex: '5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#34C759', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>GPS TRACKING ON</span>
                </div>
                <div className="animate-float-delayed" style={{
                  backgroundColor: 'var(--neon-lime)',
                  border: '1.5px solid var(--border-dark)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  zIndex: '5',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}>
                  <MapPin size={18} color="var(--text-primary)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Logo / Brand Strip */}
      <section className="logo-strip">
        <div className="logo-track">
          <span className="logo-item">TRIPZ.AI</span>
          <span className="logo-item">EXPLORE</span>
          <span className="logo-item">NORTHBOUND</span>
          <span className="logo-item">HORIZON PLANNER</span>
          <span className="logo-item">STUDIO WANDER</span>
          <span className="logo-item">WANDERLUST</span>
          <span className="logo-item">TRIPZ.AI</span>
          <span className="logo-item">EXPLORE</span>
          <span className="logo-item">NORTHBOUND</span>
          <span className="logo-item">HORIZON PLANNER</span>
          <span className="logo-item">STUDIO WANDER</span>
          <span className="logo-item">WANDERLUST</span>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', marginBottom: '60px' }}>
            <span style={{ display: 'inline-block', backgroundColor: 'var(--neon-lime)', color: 'var(--text-primary)', padding: '4px 12px', fontSize: '0.85rem', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
              INTERACTIVE DEMO SERVICES
            </span>
            <h2 style={{ fontSize: '3rem', letterSpacing: '-0.03em', marginBottom: '20px' }}>
              One application.<br />Complete modular coordination.
            </h2>
            <p>
              We consolidate the travel planning lifecycle. Click any card below to launch its <strong>relatable interactive TRIPZ module</strong> live.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid-12" style={{ marginBottom: '60px' }}>
            {services.map((srv, idx) => {
              const cardClass = srv.theme === 'lime' ? 'card card-lime' : srv.theme === 'dark' ? 'card card-dark' : 'card';
              const isSelected = activePreview === srv.id;

              const handleCardClick = () => {
                if (srv.id === "chat") {
                  toggleChat(true);
                  setActivePreview('chat');
                } else {
                  setActivePreview(isSelected ? null : srv.id);
                }
              };

              return (
                <div 
                  key={idx} 
                  className={cardClass} 
                  onClick={handleCardClick}
                  style={{ 
                    gridColumn: 'span 4', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    minHeight: '260px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    border: isSelected ? '3px solid var(--text-primary)' : undefined,
                    transform: isSelected ? 'translateY(-8px)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: srv.theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: srv.theme === 'lime' ? '#080808' : srv.theme === 'dark' ? 'var(--neon-lime)' : 'transparent',
                      color: srv.theme === 'lime' ? 'var(--neon-lime)' : srv.theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)'
                    }}>
                      {srv.icon}
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem' }}>[{srv.num}]</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: srv.theme === 'dark' ? '#FFFFFF' : 'var(--text-primary)' }}>{srv.title}</h3>
                    <p style={{ fontSize: '0.85rem' }}>{srv.desc}</p>
                    <div style={{ 
                      marginTop: '16px', 
                      fontSize: '0.75rem', 
                      fontWeight: '800', 
                      textTransform: 'uppercase',
                      color: srv.theme === 'dark' ? 'var(--neon-lime)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{isSelected ? "Active View" : "Launch Module"}</span> <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC RELATABLE PREVIEW MODULE DETAILS */}
          {activePreview && activePreview !== 'chat' && (
            <div style={{
              border: '2px solid var(--border-dark)',
              borderRadius: '24px',
              padding: '40px',
              backgroundColor: '#FFFFFF',
              position: 'relative',
              boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
              animation: 'float 6s ease-in-out infinite'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => setActivePreview(null)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <X size={22} />
              </button>

              {/* 1. Smart Onboarding Module */}
              {activePreview === 'onboarding' && (
                <div>
                  <span className="highlight-badge">TRIPZ MINI-ONBOARDING MODULE</span>
                  <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>Interactive Parameters Configuration</h3>
                  <p style={{ marginBottom: '32px' }}>Adjust inputs in real-time to preview dynamic TRIPZ generation models.</p>

                  <div className="grid-12">
                    {/* Inputs */}
                    <div style={{ gridColumn: 'span 6' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Select Budget (₹{miniBudget})
                        </label>
                        <input 
                          type="range" 
                          min="5000" 
                          max="50000" 
                          step="1000" 
                          value={miniBudget}
                          onChange={e => setMiniBudget(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--text-primary)' }}
                        />
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Travel Style
                        </label>
                        <select 
                          value={miniStyle}
                          onChange={e => setMiniStyle(e.target.value)}
                          className="form-input"
                          style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                        >
                          <option value="solo">Solo Traveler</option>
                          <option value="couple">Couple Escape</option>
                          <option value="friends">Friends Reunion</option>
                          <option value="family">Family Adventure</option>
                        </select>
                      </div>
                    </div>

                    {/* Output Preview */}
                    <div style={{ gridColumn: 'span 6', backgroundColor: 'var(--light-gray)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>Live Target Path</h4>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          🗺️ {miniStyle.toUpperCase()} TRIPZ PATH
                        </div>
                        <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                          Calculated for a ₹{miniBudget} ceiling. We'll balance safety standards, local transit rates, and stays near sightseeing.
                        </p>
                      </div>
                      <button onClick={() => navigate('/onboarding')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', alignSelf: 'flex-start', marginTop: '20px' }}>
                        Launch Complete Onboarding <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Recommendation Engine Module */}
              {activePreview === 'recommendations' && (
                <div>
                  <span className="highlight-badge">TRIPZ RECOMMENDATIONS SELECTOR</span>
                  <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>Live Crowd & Budget Overlap Scoring</h3>
                  <p style={{ marginBottom: '32px' }}>Score matches instantly before running API processes.</p>

                  <div className="grid-12">
                    <div style={{ gridColumn: 'span 6' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Ceiling Budget: ₹{recoBudget}
                        </label>
                        <input 
                          type="range" 
                          min="10000" 
                          max="40000" 
                          step="2000" 
                          value={recoBudget}
                          onChange={e => setRecoBudget(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Target Interest
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {['beach', 'adventure', 'heritage', 'food'].map(item => (
                            <button
                              key={item}
                              onClick={() => setRecoInterest(item)}
                              className={`btn ${recoInterest === item ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                              {item.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ gridColumn: 'span 6', backgroundColor: 'var(--light-gray)', borderRadius: '16px', padding: '24px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>Matching Destinations</h4>
                      <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {getRecoMatchCount().length} Match(es)
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {getRecoMatchCount().map(d => (
                          <span key={d.id} className="highlight-badge" style={{ marginBottom: 0 }}>{d.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. AI Daily Planner Module */}
              {activePreview === 'planner' && (
                <div>
                  <span className="highlight-badge">TRIPZ DAILY PLANNER ENGINE</span>
                  <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>Curated Schedule Preview</h3>
                  <p style={{ marginBottom: '24px' }}>Examine daily stops, sightseeing schedules, and transit structures.</p>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <button onClick={() => setPlanDay(1)} className={`btn ${planDay === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}>Day 1 Schedule</button>
                    <button onClick={() => setPlanDay(2)} className={`btn ${planDay === 2 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}>Day 2 Schedule</button>
                  </div>

                  <div className="card" style={{ padding: '24px' }}>
                    {planDay === 1 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                        <div>🌅 <strong>Morning:</strong> Arrive, check-in, breakfast at Artjuna Cafe, and relax on Anjuna Beach.</div>
                        <div>☀️ <strong>Afternoon:</strong> Walk to Chapora Fort (heritage site) and try Goan Fish Thali at Vinayak.</div>
                        <div>🌇 <strong>Evening:</strong> Watch the sunset over Vagator cliffs, dinner at Curlies shack.</div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                        <div>🌅 <strong>Morning:</strong> Swim at Calangute Beach, explore local markets.</div>
                        <div>☀️ <strong>Afternoon:</strong> Visit Latin Quarters of Fontainhas in Panjim for heritage photos.</div>
                        <div>🌇 <strong>Evening:</strong> Mandovi River sunset cruise and dinner at Gunpowder.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Safety Shield Module */}
              {activePreview === 'safety' && (
                <div>
                  <span className="highlight-badge" style={{ backgroundColor: '#FF3B30', color: '#FFFFFF' }}>TRIPZ SAFETY SHIELD LOOKUP</span>
                  <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>Offline Safety Helpline Lookups</h3>
                  <p style={{ marginBottom: '24px' }}>Immediate helpline access maps mapped for secure domestic exploration.</p>

                  <div className="grid-12">
                    <div style={{ gridColumn: 'span 4' }}>
                      <label style={{ display: 'block', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Pick City</label>
                      <select 
                        value={safetyCity}
                        onChange={e => setSafetyCity(e.target.value)}
                        className="form-input"
                        style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                      >
                        <option value="goa">Goa</option>
                        <option value="munnar">Munnar</option>
                        <option value="udaipur">Udaipur</option>
                        <option value="manali">Manali</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 8', backgroundColor: '#FFF2F2', border: '1.5px solid #FF3B30', borderRadius: '16px', padding: '24px' }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#FF3B30', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <ShieldAlert size={18} /> Emergency Contact Sheets
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                        <div>🚨 <strong>Police Command:</strong> {EMERGENCY_CONTACTS[safetyCity]?.police || '100'}</div>
                        <div>🏥 <strong>Nearest Hospital:</strong> {EMERGENCY_CONTACTS[safetyCity]?.hospitals[0]?.name || 'Govt Clinic'} ({EMERGENCY_CONTACTS[safetyCity]?.hospitals[0]?.phone})</div>
                        <div>⚠️ <strong>Tourist Helpline:</strong> {EMERGENCY_CONTACTS[safetyCity]?.helpline || '112'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Budget Tracker Module */}
              {activePreview === 'budget' && (
                <div>
                  <span className="highlight-badge">TRIPZ BUDGET LEDGER CALCULATOR</span>
                  <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>Interactive Planned vs Spent Ledger</h3>
                  <p style={{ marginBottom: '24px' }}>Add items below to simulate budget limits updates instantly.</p>

                  <div className="grid-12">
                    <div style={{ gridColumn: 'span 6' }}>
                      <form onSubmit={handleAddMiniExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input 
                          type="text" 
                          placeholder="Expense title (e.g. Biryani lunch)"
                          value={miniExpName}
                          onChange={e => setMiniExpName(e.target.value)}
                          className="form-input"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        />
                        <input 
                          type="number" 
                          placeholder="Amount (₹)"
                          value={miniExpAmount}
                          onChange={e => setMiniExpAmount(e.target.value)}
                          className="form-input"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '0.85rem' }}>
                          Add to Ledger
                        </button>
                      </form>
                    </div>

                    <div style={{ gridColumn: 'span 6', backgroundColor: 'var(--light-gray)', borderRadius: '16px', padding: '24px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>Simulated Spent Balance</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto', marginBottom: '12px' }}>
                        {miniExpenses.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid var(--border-gray)', paddingBottom: '4px' }}>
                            <span>{item.title}</span>
                            <span style={{ fontWeight: '700' }}>₹{item.amount} <Trash2 size={12} onClick={() => handleDeleteMiniExpense(item.id)} style={{ cursor: 'pointer', color: '#FF3B30', marginLeft: '6px', display: 'inline' }} /></span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <strong>Total Spent:</strong>
                        <strong style={{ color: 'var(--text-primary)' }}>₹{miniExpenses.reduce((acc, i) => acc + i.amount, 0)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </section>

      {/* Dark Technology Section */}
      <section style={{ backgroundColor: 'var(--bg-dark)', color: '#FFFFFF', padding: '120px 0' }}>
        <div className="container">
          <div className="grid-12" style={{ alignItems: 'center' }}>
            <div style={{ gridColumn: 'span 6' }}>
              <span className="highlight-badge" style={{ backgroundColor: 'var(--neon-lime)', color: 'var(--text-primary)' }}>
                TRIPZ ARCHITECTURE
              </span>
              <h2 style={{ fontSize: '3rem', color: '#FFFFFF', marginBottom: '28px', lineHeight: '1.1' }}>
                Built for the<br />next digital<br />generation.
              </h2>
              <p style={{ color: '#A0A0A0', marginBottom: '40px', maxWidth: '480px' }}>
                Our modular pipeline matches budget, interests, and season indicators against local coordinates, translating dialects on the fly to yield accessible travel paths.
              </p>
              <button onClick={() => navigate('/onboarding')} className="btn btn-lime">
                Initialize Plan <ArrowRight size={18} />
              </button>
            </div>

            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#0C1315', border: '1px solid #1E282B', borderRadius: '18px', padding: '24px', display: 'flex', gap: '20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-lime)', fontWeight: '800', fontSize: '1.25rem' }}>[⚡]</div>
                <div>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '8px' }}>Predictive Filtering</h4>
                  <p style={{ color: '#888888', fontSize: '0.85rem' }}>Dynamic overlap checks run on-client to score destinations before calling AI models, minimizing API overhead.</p>
                </div>
              </div>
              <div style={{ backgroundColor: '#0C1315', border: '1px solid #1E282B', borderRadius: '18px', padding: '24px', display: 'flex', gap: '20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-lime)', fontWeight: '800', fontSize: '1.25rem' }}>[🎯]</div>
                <div>
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '8px' }}>Structured Output</h4>
                  <p style={{ color: '#888888', fontSize: '0.85rem' }}>AI itineraries conform strictly to a structural data model rather than freeform text, guaranteeing render reliability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Process / Methodology Section */}
      <section id="how-it-works" style={{ padding: '120px 0' }}>
        <div className="container">
          <div className="grid-12">
            <div style={{ gridColumn: 'span 5' }}>
              <span className="highlight-badge">METHODOLOGY</span>
              <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>How we execute.</h2>
              <p style={{ maxWidth: '380px' }}>
                An elegant process structured step-by-step to guarantee optimal matching parameters for solo travelers, groups, or families.
              </p>
            </div>

            <div style={{ gridColumn: 'span 7' }}>
              {processSteps.map((step, idx) => {
                const isOpen = activeAccordion === idx;
                return (
                  <div key={idx} className={`accordion-row ${isOpen ? 'open' : ''}`} onClick={() => toggleAccordion(isOpen ? null : idx)}>
                    <div className="accordion-header">
                      <span className="accordion-number">{step.num}</span>
                      <span className="accordion-title">{step.title}</span>
                      <div className="accordion-icon">
                        <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>+</span>
                      </div>
                    </div>
                    {/* ACCORDION ACCESSIBILITY: hidden="until-found" behavior styled with height transition */}
                    <div 
                      className="accordion-content" 
                      style={{ maxHeight: isOpen ? '120px' : '0px' }}
                      hidden={!isOpen ? "until-found" : undefined}
                    >
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-gray)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            letterSpacing: '-0.04em',
            marginBottom: '16px'
          }}>
            Let's make something happen.
          </h2>
          <p style={{ maxWidth: '520px', margin: '0 auto 40px auto' }}>
            Ready to explore? Build a custom-designed path fitting your specific budget and travel interests in minutes.
          </p>
          <button onClick={() => navigate('/onboarding')} className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
            Begin Onboarding
          </button>
        </div>
      </section>

    </div>
  );
};

export default Landing;
