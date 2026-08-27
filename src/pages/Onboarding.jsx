import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { ArrowRight, ArrowLeft, Key, Check } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { onboardingData, setOnboardingData, apiKey, setApiKey } = useContext(TravelContext);

  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(onboardingData.budget);
  const [startDate, setStartDate] = useState(onboardingData.startDate);
  const [endDate, setEndDate] = useState(onboardingData.endDate);
  const [days, setDays] = useState(onboardingData.days);
  const [travelStyle, setTravelStyle] = useState(onboardingData.travelStyle);
  const [selectedInterests, setSelectedInterests] = useState(onboardingData.interests);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

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
        travelStyle
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
