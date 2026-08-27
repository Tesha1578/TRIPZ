import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border-gray)',
      padding: '80px 0 40px 0',
      marginTop: '120px'
    }}>
      <div className="container">
        <div className="grid-12" style={{ marginBottom: '60px' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'var(--text-primary)',
                borderRadius: '3px',
                transform: 'rotate(45deg)'
              }}></div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>TRIPZ</span>
            </div>
            <p style={{ maxWidth: '280px', fontSize: '0.85rem' }}>
              Next-generation trip planner leveraging modular intelligence and clean aesthetic layouts. Made for modern exploration.
            </p>
          </div>

          {/* Links 1 */}
          <div style={{ gridColumn: 'span 3', paddingLeft: '24px' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.05em' }}>Navigator</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Home</Link></li>
              <li><Link to="/onboarding" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Trip Planner</Link></li>
              <li><Link to="/emergency" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Emergency Safety</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div style={{ gridColumn: 'span 3' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.05em' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Documentation</a></li>
              <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Interactive Map API</a></li>
              <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Open Weather API</a></li>
            </ul>
          </div>

          {/* Lime Accent Badge */}
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            <span className="highlight-badge">TRIPZ // V1.0</span>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border-gray)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#888888' }}>
            &copy; {new Date().getFullYear()} TRIPZ. Built for Hackathons & Social Impact.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ fontSize: '0.75rem', color: '#888888', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '0.75rem', color: '#888888', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
