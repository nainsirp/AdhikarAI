import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const clickOutside = () => setDropdownOpen(false);
    document.addEventListener('click', clickOutside);
    return () => document.removeEventListener('click', clickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name: string) => {
    return (name || 'U')[0].toUpperCase();
  };

  const isHome = location.pathname === '/';

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-adhikar">Adhikar</span>
          <span className="logo-ai">AI</span>
        </Link>
        
        <nav className="nav-links">
          {isHome ? (
            <>
              <a href="#home" className="nav-link">Home</a>
              <a href="#about" className="nav-link">About</a>
              <Link to="/how-it-works" className="nav-link">How it works</Link>
              <a href="#features" className="nav-link">Features</a>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/how-it-works" className="nav-link">How it works</Link>
              {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
            </>
          )}
        </nav>

        <div className="nav-actions">
          {!user ? (
            <>
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          ) : (
            <div className="user-profile">
              <button 
                className="user-avatar-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                aria-label="User profile"
              >
                <span>{getInitials(user.name)}</span>
              </button>
              
              <div className={`profile-dropdown ${dropdownOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="profile-header">
                  <div className="profile-avatar-lg">
                    <span>{getInitials(user.name)}</span>
                  </div>
                  <div className="profile-info">
                    <p className="profile-name">{user.name}</p>
                    <p className="profile-email">{user.email}</p>
                  </div>
                </div>
                
                <div className="profile-divider"></div>
                
                <Link to="/evidence-vault" className="profile-menu-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Evidence Vault
                </Link>
                
                <Link to="/ask-ai" className="profile-menu-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Legal Q&A Chat
                </Link>

                <Link to="/draft-notices" className="profile-menu-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Draft Notice
                </Link>

                <div className="profile-divider"></div>
                
                <button className="profile-signout" onClick={handleSignOut}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          className="hamburger" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {isHome ? (
          <>
            <a href="#home" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</a>
            <a href="#about" className="mobile-link" onClick={() => setMobileOpen(false)}>About</a>
            <Link to="/how-it-works" className="mobile-link" onClick={() => setMobileOpen(false)}>How it works</Link>
            <a href="#features" className="mobile-link" onClick={() => setMobileOpen(false)}>Features</a>
          </>
        ) : (
          <>
            <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="mobile-link" onClick={() => setMobileOpen(false)}>How it works</Link>
          </>
        )}
        {!user ? (
          <>
            <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Log In</Link>
            <Link to="/signup" className="mobile-link signup-mobile" onClick={() => setMobileOpen(false)}>Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <button className="mobile-link signout-mobile" onClick={() => { setMobileOpen(false); handleSignOut(); }}>Sign Out</button>
          </>
        )}
      </div>
    </header>
  );
};
export default Navbar;
