import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      height: '80px',
      borderBottom: '1px solid var(--border-gray)',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      position: 'sticky',
      top: '0',
      zIndex: '100'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: 'var(--text-primary)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--text-primary)',
            borderRadius: '4px',
            transform: 'rotate(45deg)'
          }}></div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '1.25rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            TRIPZ
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'var(--transition-fast)'
          }} className="nav-link">Home</Link>
          <Link to="/onboarding" style={{
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'var(--transition-fast)'
          }} className="nav-link">Plan Trip</Link>
          <Link to="/emergency" style={{
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'var(--transition-fast)'
          }} className="nav-link">Emergency Contacts</Link>
        </div>

        {/* CTA Button */}
        <button onClick={() => navigate('/onboarding')} className="btn" style={{
          padding: '8px 18px',
          fontSize: '0.85rem'
        }}>
          Let's Plan
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
