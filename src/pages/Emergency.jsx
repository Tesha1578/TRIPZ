import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { DESTINATIONS, EMERGENCY_CONTACTS } from '../data/mockData';
import { Phone, Shield, ShieldAlert, MapPin, HeartPulse, HelpCircle, ArrowLeft } from 'lucide-react';

const Emergency = () => {
  const navigate = useNavigate();
  const { selectedDestination } = useContext(TravelContext);
  const [activeDestId, setActiveDestId] = useState(selectedDestination || 'goa');

  const destination = DESTINATIONS.find(d => d.id === activeDestId) || DESTINATIONS[0];
  const contacts = EMERGENCY_CONTACTS[activeDestId] || {
    police: "100",
    hospitals: [{ name: "Local Government Clinic", phone: "102", location: "Town Center" }],
    helpline: "112"
  };

  // Unique local safety tips to show social impact in student/hackathon pitch
  const safetyGuidelines = {
    goa: [
      "🌊 Avoid swimming at beaches after sunset or under red flags.",
      "⚠️ Hire verified taxi drivers or use GoaMiles official app for transport.",
      "🦟 Watch out for mosquito-borne illnesses; carry repellent.",
      "📞 Women safety helpline is 1091 - reachable 24/7."
    ],
    munnar: [
      "⛰️ Avoid mountain roads during heavy monsoons (landslide risks).",
      "❄️ Carry warm clothing; temperatures drop severely at night.",
      "🧗 Avoid venturing into deep tea-estate forests alone (wild elephant crossings).",
      "📞 Forest Department Help Desk: 04865-230010."
    ],
    udaipur: [
      "🛶 Ensure life jackets are secure during Lake Pichola boat rides.",
      "☀️ Udaipur gets hot during afternoon; carry sunscreen and hydration.",
      "🏰 Avoid purchasing historical artifacts from unauthorized vendors.",
      "📞 Tourist Police Helpline: 0294-2410313."
    ],
    manali: [
      "🏔️ Watch out for altitude sickness (AMS) in high passes like Rohtang.",
      "❄️ Rent certified snow gear only from government-approved shops.",
      "🛶 River rafting should be done only with certified operators.",
      "📞 Tourism Office: 01902-252175."
    ],
    ladakh: [
      "🏔️ MANDATORY: Rest completely for the first 24-48 hours to acclimatize to high altitude.",
      "☀️ Extremely high UV indices; wear high-SPF sunscreen and sunglasses.",
      "💧 Carry refillable water bottles; drink at least 3-4 liters daily.",
      "📞 Leh Tourist Information: 01982-252541."
    ],
    hampi: [
      "🪨 Boulder climbing can be slippery; wear robust grip footwear.",
      "🐊 Coracle rides (circular boats) must have government-certified life jackets.",
      "☀️ Extreme dry heat; carry electrolyte powders.",
      "📞 Archaeological Survey Help Desk: 08394-241220."
    ],
    rishikesh: [
      "🌊 River currents in the Ganges are extremely strong; swim only in designated safe ghats.",
      "🧘 Ensure Yoga/Rafting centers are registered with Uttarakhand Tourism.",
      "🐒 Avoid carrying exposed food items in public to prevent monkey encounters.",
      "📞 Rafting Association: 0135-2430110."
    ],
    pondicherry: [
      "🌊 Rocky Beach has deep underwater drops; swimming is strictly prohibited there.",
      "🛵 Ensure helmet rules are strictly followed when renting scooters.",
      "🍷 Avoid purchasing liquor from unlicensed local vendors.",
      "📞 Tourism Help Desk: 0413-2330503."
    ]
  };

  const currentGuidelines = safetyGuidelines[activeDestId] || [
    "⚠️ Check local government bulletins before traveling.",
    "📞 Keep emergency helplines stored on your phone offline.",
    "🛡️ Share your live coordinates with family members regularly."
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '60px', paddingBottom: '120px' }}>
      <div className="container">
        
        {/* Navigation back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          
          {/* Dropdown to switch destination safety info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Select Destination:</span>
            <select 
              value={activeDestId} 
              onChange={e => setActiveDestId(e.target.value)} 
              className="form-input" 
              style={{ width: '180px', padding: '8px 12px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Header Title */}
        <div style={{ maxWidth: '640px', marginBottom: '60px' }}>
          <span className="highlight-badge" style={{ backgroundColor: '#FF3B30', color: '#FFFFFF' }}>
            SAFETY & EMERGENCY
          </span>
          <h2 style={{ fontSize: '3rem', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Emergency Hub for {destination.name}.
          </h2>
          <p>
            Quick access helplines, hospital grids, and local safety rules. Tap the panels to dial directly on mobile devices.
          </p>
        </div>

        {/* Hotlines Panels Grid */}
        <div className="grid-12" style={{ marginBottom: '64px' }}>
          {/* Police Hotline */}
          <div style={{ gridColumn: 'span 4' }}>
            <a href={`tel:${contacts.police.split(' ')[0]}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ 
                border: '2px solid #FF3B30', 
                backgroundColor: '#FFF2F2', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '40px 24px',
                transition: 'var(--transition-smooth)'
              }} className="card-hover-red">
                <Shield size={36} color="#FF3B30" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Police Department</h3>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FF3B30' }}>
                  {contacts.police.split(' ')[0]}
                </span>
                <p style={{ fontSize: '0.75rem', marginTop: '12px', color: 'var(--text-secondary)' }}>
                  Tap to Dial Police (Alt: {contacts.police.split(' ')[2] || 'Direct'})
                </p>
              </div>
            </a>
          </div>

          {/* National Helpline */}
          <div style={{ gridColumn: 'span 4' }}>
            <a href={`tel:${contacts.helpline.split(' ')[0]}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ 
                border: '2px solid #FF9500', 
                backgroundColor: '#FFF8F0', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '40px 24px',
                transition: 'var(--transition-smooth)'
              }}>
                <ShieldAlert size={36} color="#FF9500" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Universal Help</h3>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FF9500' }}>
                  {contacts.helpline.split(' ')[0]}
                </span>
                <p style={{ fontSize: '0.75rem', marginTop: '12px', color: 'var(--text-secondary)' }}>
                  Ganga/Tourism Emergency Response Team
                </p>
              </div>
            </a>
          </div>

          {/* Ambulance/Hospital General */}
          <div style={{ gridColumn: 'span 4' }}>
            <a href="tel:108" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ 
                border: '2px solid #34C759', 
                backgroundColor: '#F2FBF4', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '40px 24px',
                transition: 'var(--transition-smooth)'
              }}>
                <HeartPulse size={36} color="#34C759" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Ambulance Support</h3>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34C759' }}>
                  108
                </span>
                <p style={{ fontSize: '0.75rem', marginTop: '12px', color: 'var(--text-secondary)' }}>
                  National Medical Emergency Lifeline
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Detailed Hospital and Guidelines Split Grid */}
        <div className="grid-12">
          {/* Hospital Grids */}
          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <HeartPulse size={20} />
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Local Hospital Grids</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contacts.hospitals.map((hosp, idx) => (
                <div key={idx} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{hosp.name}</h4>
                    <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <MapPin size={12} /> Area: {hosp.location}
                    </p>
                  </div>
                  <a href={`tel:${hosp.phone}`} className="btn btn-secondary" style={{ display: 'flex', gap: '6px', padding: '8px 16px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    <Phone size={12} /> Call Desk
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Advisories */}
          <div style={{ gridColumn: 'span 5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <HelpCircle size={20} />
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Safety Advisories</h3>
            </div>
            
            <div style={{ backgroundColor: 'var(--light-gray)', border: '1px solid var(--border-gray)', borderRadius: '24px', padding: '32px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px', color: 'var(--text-primary)' }}>
                {destination.name} Travel Warning Rules
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentGuidelines.map((tip, idx) => (
                  <p key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Emergency;
