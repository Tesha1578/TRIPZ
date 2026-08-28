import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { ArrowRight, ArrowLeft, Key, Check } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { 
    onboardingData, 
    setOnboardingData, 
    apiKey, 
    setApiKey,
    groupRoom,
    createGroupRoom,
    joinGroupRoom,
    leaveGroupRoom
  } = useContext(TravelContext);

  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(onboardingData.budget);
  const [startDate, setStartDate] = useState(onboardingData.startDate);
  const [endDate, setEndDate] = useState(onboardingData.endDate);
  const [days, setDays] = useState(onboardingData.days);
  const [travelStyle, setTravelStyle] = useState(onboardingData.travelStyle);
  const [selectedInterests, setSelectedInterests] = useState(onboardingData.interests);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [transport, setTransport] = useState(onboardingData.transport || 'Bus');

  const interestsList = [
    { id: "beach", label: "🏖️ Beach" },
    { id: "waterfall", label: "🌊 Waterfall" },
    { id: "hill station", label: "⛰️ Hill Station" },
    { id: "heritage", label: "🏰 Heritage" },
    { id: "adventure", label: "🧗 Adventure" },
    { id: "food", label: "🍛 Local Food" },
    { id: "nightlife", label: "🍷 Nightlife" }
  ];

  const travelStylesList = [
    { id: "solo", label: "Solo Traveler", desc: "For single wanderers exploring paths." },
    { id: "couple", label: "Romantic Couple", desc: "For dual escapes with aesthetic scenery." },
    { id: "family", label: "Family Trip", desc: "Comfortable and safe routes for everyone." },
    { id: "friends", label: "Friends Group", desc: "Vibrant and activity-heavy social plans." }
  ];

  // Auto-calculate days based on dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setDays(diffDays);
      }
    }
  }, [startDate, endDate]);

  const handleInterestToggle = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(item => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(tempKey);
    setShowKeyInput(false);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save all parameters to context
      setOnboardingData({
        budget: parseInt(budget, 10),
        days,
        interests: selectedInterests,
        startDate,
        endDate,
        travelStyle,
        transport,
        groupCode: groupRoom ? groupRoom.inviteCode : ''
      });
      // Redirect to Recommendations
      navigate('/recommendations');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '80px', paddingBottom: '120px' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map(num => (
              <div key={num} style={{
                width: '32px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: step >= num ? 'var(--text-primary)' : 'var(--border-gray)',
                transition: 'var(--transition-smooth)'
              }}></div>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.85rem' }}>
            STEP 0{step} OF 03
          </span>
        </div>

        {/* Form Steps */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Define your budget & travel dates.
            </h2>
            <p style={{ marginBottom: '40px' }}>
              We match destination average rates, lodging, and logistics against your parameters.
            </p>

            {/* Budget Input */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                Total Trip Budget (₹ INR)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '16px', fontWeight: '800', fontSize: '1.25rem' }}>₹</span>
                <input 
                  type="number" 
                  className="form-input" 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)} 
                  placeholder="e.g. 15000"
                  style={{ paddingLeft: '36px', fontSize: '1.25rem', fontWeight: '700' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button onClick={() => setBudget(10000)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>₹10k (Budget)</button>
                <button onClick={() => setBudget(25000)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>₹25k (Medium)</button>
                <button onClick={() => setBudget(50000)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>₹50k (Premium)</button>
              </div>
            </div>

            {/* Dates Inputs */}
            <div className="grid-12" style={{ marginBottom: '32px' }}>
              <div style={{ gridColumn: 'span 6' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Start Date
                </label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div style={{ gridColumn: 'span 6' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                  End Date
                </label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>

            {startDate && endDate && (
              <div style={{
                backgroundColor: 'var(--light-gray)',
                border: '1px solid var(--border-gray)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Calculated Trip Duration:</span>
                <span className="highlight-badge" style={{ marginBottom: 0 }}>{days} Days</span>
              </div>
            )}

            {/* Transport Preference */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                Primary Transport Mode
              </label>
              <select 
                className="form-input" 
                value={transport} 
                onChange={(e) => setTransport(e.target.value)}
                style={{ fontSize: '1rem', padding: '14px 16px' }}
              >
                <option value="Bus">🚌 Public Bus (Low Carbon)</option>
                <option value="Train">🚆 Railway Train (Ultra-Low Carbon)</option>
                <option value="Car">🚗 Petrol/Diesel Car (Medium Carbon)</option>
                <option value="Eco-Car">🔌 Electric Eco-Car (Low Carbon)</option>
                <option value="Flight">✈️ Commercial Flight (High Carbon)</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Used to compute the environmental carbon footprint of your daily stops.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Select your travel style.
            </h2>
            <p style={{ marginBottom: '40px' }}>
              We optimize lodging proximity and evening schedules to match your companion layout.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {travelStylesList.map(styleItem => {
                const isSelected = travelStyle === styleItem.id;
                return (
                  <div 
                    key={styleItem.id} 
                    onClick={() => setTravelStyle(styleItem.id)}
                    style={{
                      border: isSelected ? '2px solid var(--text-primary)' : '1px solid var(--border-gray)',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--neon-lime)' : '#FFFFFF',
                      transition: 'var(--transition-smooth)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {styleItem.label}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: isSelected ? 'rgba(8, 8, 8, 0.7)' : 'var(--text-secondary)' }}>
                        {styleItem.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--neon-lime)'
                      }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Group Room Interface */}
            {travelStyle === 'friends' && (
              <div style={{
                backgroundColor: 'var(--light-gray)',
                border: '1.5px solid var(--border-dark)',
                borderRadius: '20px',
                padding: '28px',
                marginTop: '32px',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  👥 TRIPZ Group Room
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Generate an invite link for your squad. We will automatically merge budgets and find matching tags!
                </p>

                {groupRoom ? (
                  <div>
                    {/* Active Group Info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-gray)',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800' }}>INVITE CODE</span>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '1px', marginTop: '2px' }}>
                          {groupRoom.inviteCode}
                        </h4>
                      </div>
                      <button 
                        onClick={leaveGroupRoom} 
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#FF3B30', color: '#FF3B30' }}
                      >
                        Leave Room
                      </button>
                    </div>

                    {/* Group Vibe summary */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Squad Members & Preferences
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {groupRoom.members.map((member, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-gray)',
                            fontSize: '0.8rem'
                          }}>
                            <div>
                              <strong style={{ color: 'var(--text-primary)' }}>{member.name}</strong>
                              <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                                Budget: ₹{member.budget}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {member.interests.map(t => (
                                <span key={t} style={{ fontSize: '0.65rem', backgroundColor: 'var(--light-gray)', padding: '2px 6px', borderRadius: '4px' }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Squad profile alignment indicator */}
                    <div style={{
                      backgroundColor: 'var(--neon-lime)',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-dark)',
                      fontSize: '0.8rem'
                    }}>
                      <strong>⚡ Vibe Alignment: 88%</strong>
                      <p style={{ fontSize: '0.75rem', marginTop: '4px', color: 'rgba(8,8,8,0.8)' }}>
                        Budget ceiling is computed at ₹{Math.round(groupRoom.members.reduce((a,b)=>a+b.budget, 0)/groupRoom.members.length)}/person. Intersecting tags: <strong>food, adventure, beach</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => createGroupRoom('You (Host)')} 
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px 16px', fontSize: '0.8rem' }}
                    >
                      Create Group Room
                    </button>
                    <button 
                      onClick={() => {
                        const code = prompt("Enter Invite Code (e.g. TRIPZ-ABCD):");
                        if (code) joinGroupRoom(code, 'You');
                      }} 
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '10px 16px', fontSize: '0.8rem' }}
                    >
                      Join Room Code
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Choose your interests.
            </h2>
            <p style={{ marginBottom: '40px' }}>
              Select at least 2 interests to align sights, outdoor routes, and culinary cards.
            </p>

            {/* Interest Badges Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '40px'
            }}>
              {interestsList.map(interest => {
                const isChecked = selectedInterests.includes(interest.id);
                return (
                  <div key={interest.id}>
                    <input 
                      type="checkbox"
                      id={`chk-${interest.id}`}
                      className="interest-checkbox"
                      checked={isChecked}
                      onChange={() => handleInterestToggle(interest.id)}
                    />
                    <label htmlFor={`chk-${interest.id}`} className="interest-label">
                      {interest.label}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* API Key configuration toggle */}
            <div style={{
              borderTop: '1px solid var(--border-gray)',
              paddingTop: '24px',
              marginBottom: '24px'
            }}>
              <div 
                onClick={() => setShowKeyInput(!showKeyInput)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                <Key size={16} /> 
                <span>{apiKey ? "🔑 Anthropic API Key Configured (Click to change)" : "Configure Optional AI API Key (For Custom Generation)"}</span>
              </div>

              {showKeyInput && (
                <div style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '1.5px solid var(--border-dark)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginTop: '16px'
                }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Anthropic Claude API Key</h4>
                  <p style={{ fontSize: '0.75rem', marginBottom: '16px' }}>
                    Paste your Claude Key to generate customized itineraries instead of rich simulated templates. Key is stored locally in your browser.
                  </p>
                  <input 
                    type="password"
                    className="form-input"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="sk-ant-..."
                    style={{ marginBottom: '16px' }}
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSaveApiKey} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Save Key</button>
                    <button onClick={() => setShowKeyInput(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons footer */}
        <div style={{
          borderTop: '1px solid var(--border-gray)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '40px'
        }}>
          {step > 1 ? (
            <button onClick={handleBack} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div></div> // empty spacer
          )}
          
          <button 
            onClick={handleNext} 
            className="btn btn-primary"
            disabled={step === 1 && (!startDate || !endDate || budget <= 0)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: (step === 1 && (!startDate || !endDate || budget <= 0)) ? 0.5 : 1,
              cursor: (step === 1 && (!startDate || !endDate || budget <= 0)) ? 'not-allowed' : 'pointer'
            }}
          >
            {step === 3 ? "Get Recommendations" : "Continue"} <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
