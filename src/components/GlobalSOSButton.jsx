import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TravelContext } from '../context/TravelContext';
import { ShieldAlert, X, MapPin, Phone, CheckCircle, RefreshCw } from 'lucide-react';

const GlobalSOSButton = () => {
  const {
    selectedDestination,
    sosStatus,
    triggerSOS,
    resolveSOS,
    emergencyContacts
  } = useContext(TravelContext);

  const locationState = useLocation();

  // Hold-to-confirm states
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);

  // Simulated GPS details
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Simulated dispatch logs
  const [dispatchLogs, setDispatchLogs] = useState([]);
  const [logIndex, setLogIndex] = useState(0);

  // Only render if a destination has been selected and we are not on the landing or onboarding page
  const shouldRender = selectedDestination && 
                       locationState.pathname !== '/' && 
                       locationState.pathname !== '/onboarding';

  // Handle GPS location query
  const fetchCoordinates = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6))
          };
          setGpsCoords(coords);
          setGpsLoading(false);
          triggerSOS(coords.lat, coords.lng);
        },
        (error) => {
          console.warn("Geolocation failed, using simulated fallback coordinates.", error);
          // Fallback coordinates (simulate Goa / local center)
          const fallback = { lat: 15.4989, lng: 73.8278 };
          setGpsCoords(fallback);
          setGpsLoading(false);
          triggerSOS(fallback.lat, fallback.lng);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const fallback = { lat: 15.4989, lng: 73.8278 };
      setGpsCoords(fallback);
      setGpsLoading(false);
      triggerSOS(fallback.lat, fallback.lng);
    }
  };

  // SOS Hold mechanics
  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    
    // Clear any residual triggers
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);

    // Interval to increment visual progress (approx 30 increments over 3 seconds)
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          return 100;
        }
        return prev + 3.33; // ~100% in 3 seconds
      });
    }, 100);

    // Timeout to trigger actual SOS after 3 seconds
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(false);
      setHoldProgress(0);
      clearInterval(holdIntervalRef.current);
      fetchCoordinates();
    }, 3000);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
  };

  // Run dispatch log updates when SOS becomes active
  useEffect(() => {
    if (sosStatus.active) {
      setLogIndex(0);
      setDispatchLogs([
        { time: new Date().toLocaleTimeString(), text: "Initiating emergency payload handshake...", status: "PENDING" }
      ]);
    } else {
      setDispatchLogs([]);
    }
  }, [sosStatus.active]);

  useEffect(() => {
    if (!sosStatus.active) return;
    
    const logsData = [
      { time: new Date().toLocaleTimeString(), text: `GPS ping established at: Lat ${gpsCoords?.lat || 15.4989}, Lng ${gpsCoords?.lng || 73.8278}`, status: "SUCCESS" },
      { time: new Date().toLocaleTimeString(), text: `Encrypting payload with user profile metadata...`, status: "PENDING" },
      { time: new Date().toLocaleTimeString(), text: `Notifying universal helpline (Universal Help: 112)...`, status: "DISPATCHED" },
      { time: new Date().toLocaleTimeString(), text: `SMS Alert dispatched to saved Emergency Contact: ${emergencyContacts.name} (${emergencyContacts.phone})`, status: "DISPATCHED" },
      { time: new Date().toLocaleTimeString(), text: `Local police precinct notified of distress signal. Guardian Active.`, status: "SUCCESS" }
    ];

    if (logIndex < logsData.length) {
      const timer = setTimeout(() => {
        setDispatchLogs(prev => [...prev, logsData[logIndex]]);
        setLogIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sosStatus.active, logIndex, gpsCoords, emergencyContacts]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Floating Red SOS Button */}
      {!sosStatus.active && (
        <div 
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          className="non-printable"
        >
          {isHolding && (
            <div style={{
              backgroundColor: 'rgba(5, 9, 10, 0.9)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              marginBottom: '10px',
              border: '1px solid #FF3B30',
              animation: 'pulse 1s infinite'
            }}>
              HOLD 3S: {Math.min(100, Math.round(holdProgress))}%
            </div>
          )}
          
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={(e) => { e.preventDefault(); startHold(); }}
            onTouchEnd={endHold}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#FF3B30',
              color: '#FFFFFF',
              border: '2px solid #080808',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isHolding 
                ? `0 0 0 ${holdProgress * 0.3}px rgba(255, 59, 48, 0.4), 0 8px 32px rgba(255,59,48,0.4)`
                : '0 8px 30px rgba(255, 59, 48, 0.3)',
              transform: isHolding ? 'scale(0.95)' : 'none',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            title="Hold for 3 seconds to trigger SOS"
          >
            {/* Visual Hold Progress Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${holdProgress}%`,
              backgroundColor: 'rgba(8, 8, 8, 0.25)',
              transition: 'height 0.1s linear',
              pointerEvents: 'none'
            }}></div>
            
            <ShieldAlert size={26} style={{ position: 'relative', zIndex: 2 }} />
          </button>
          <span style={{ fontSize: '0.65rem', fontWeight: '800', marginTop: '6px', color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SOS</span>
        </div>
      )}

      {/* Screen Shake & CSS Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes red-flash {
          0% { background-color: rgba(255, 59, 48, 0.04); }
          50% { background-color: rgba(255, 59, 48, 0.12); }
          100% { background-color: rgba(255, 59, 48, 0.04); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, -1px); }
          20%, 40%, 60%, 80% { transform: translate(2px, 1px); }
        }
        .sos-active-overlay {
          animation: red-flash 1.5s infinite ease-in-out;
        }
        .sos-shake-alert {
          animation: shake 0.5s infinite;
        }
      `}</style>

      {/* Fullscreen SOS Guardian Interface */}
      {sosStatus.active && (
        <div 
          className="sos-active-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 9, 10, 0.98)',
            color: '#FFFFFF',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            overflowY: 'auto'
          }}
        >
          <div 
            className="card card-dark" 
            style={{ 
              maxWidth: '680px', 
              width: '100%', 
              borderColor: '#FF3B30', 
              borderWidth: '2px', 
              padding: '40px',
              borderRadius: '28px',
              backgroundColor: 'rgba(8, 8, 8, 0.95)',
              boxShadow: '0 20px 80px rgba(255, 59, 48, 0.2)'
            }}
          >
            {/* Header Alert banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }} className="sos-shake-alert">
              <div style={{
                backgroundColor: '#FF3B30',
                color: '#FFFFFF',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px #FF3B30'
              }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FF3B30', letterSpacing: '0.1em' }}>TOURIST GUARDIAN SHIELD ACTIVE</span>
                <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginTop: '4px' }}>SOS Alert Dispatched</h2>
              </div>
            </div>

            <p style={{ color: '#CCCCCC', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Your emergency signal was registered. Coordinates have been logged and distress packets are routing to local police databases and your designated emergency contacts.
            </p>

            {/* Coordinates widget */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              backgroundColor: '#121212',
              border: '1px solid #333333',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '32px'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#888888', fontWeight: '800' }}>GPS LATITUDE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <MapPin size={16} color="#FF3B30" />
                  <strong style={{ fontSize: '1.15rem', color: '#FFFFFF', fontFamily: 'monospace' }}>
                    {sosStatus.location?.lat || "15.498900"}
                  </strong>
                </div>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#888888', fontWeight: '800' }}>GPS LONGITUDE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <MapPin size={16} color="#FF3B30" />
                  <strong style={{ fontSize: '1.15rem', color: '#FFFFFF', fontFamily: 'monospace' }}>
                    {sosStatus.location?.lng || "73.827800"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Simulated Logs terminal */}
            <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Real-time Dispatch Log Feed
            </h4>
            
            <div style={{
              backgroundColor: '#050505',
              border: '1px solid #222222',
              borderRadius: '16px',
              padding: '20px',
              height: '180px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#34C759',
              marginBottom: '36px'
            }}>
              {dispatchLogs.map((log, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '6px' }}>
                  <span>
                    <span style={{ color: '#888888', marginRight: '8px' }}>[{log.time}]</span>
                    {log.text}
                  </span>
                  <span style={{ 
                    color: log.status === 'SUCCESS' ? '#34C759' : log.status === 'PENDING' ? '#FF9500' : '#007AFF', 
                    fontWeight: '700' 
                  }}>
                    {log.status}
                  </span>
                </div>
              ))}
              {logIndex < 5 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888888' }}>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Streaming dispatch signals...</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#888888' }}>
                <CheckCircle size={16} color="#34C759" />
                <span>Guardian beacon active</span>
              </div>
              
              <button 
                onClick={resolveSOS}
                className="btn btn-lime"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.9rem',
                  borderRadius: '9999px',
                  backgroundColor: '#34C759',
                  borderColor: '#34C759',
                  color: '#FFFFFF',
                  fontWeight: '700'
                }}
              >
                Resolve & Close SOS Shield
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSOSButton;
