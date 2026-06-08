// src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMap, FiMenu, FiX, FiHeart, FiUser, FiLogOut, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import '../../styles/navbar.css';

export default function Navbar() {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <nav className="pf-navbar">
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="pf-logo" onClick={closeMenu}>
            <div className="pf-logo-icon">📍</div>
            <span className="pf-logo-text">PlacesFinder</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="pf-nav-links">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/search">Explore</NavLink></li>
            {currentUser && <li><NavLink to="/favorites"><FiHeart size={14} /> Favorites</NavLink></li>}
            {currentUser && <li><NavLink to="/profile"><FiUser size={14} /> Profile</NavLink></li>}
          </ul>

          {/* Actions */}
          <div className="pf-nav-actions">
            {currentUser ? (
              <>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="avatar" className="pf-user-avatar"
                    onClick={() => navigate('/profile')} />
                ) : (
                  <div className="pf-user-avatar-placeholder" onClick={() => navigate('/profile')}>
                    {initials}
                  </div>
                )}
                <button className="btn-ghost-pf" style={{ padding: '7px 14px', fontSize: 13 }} onClick={handleLogout}>
                  <FiLogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <div className="pf-nav-auth-links" style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn-ghost-pf" style={{ padding: '7px 18px', fontSize: 13 }}>Login</Link>
                <Link to="/register" className="btn-primary-pf" style={{ padding: '7px 18px', fontSize: 13 }}>Sign up</Link>
              </div>
            )}

            <button className="pf-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <FiX size={22} color="var(--text-primary)" /> : <FiMenu size={22} color="var(--text-primary)" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`pf-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu}>🏠 Home</NavLink>
        <NavLink to="/search" onClick={closeMenu}><FiSearch size={16} /> Explore</NavLink>
        {currentUser && <NavLink to="/favorites" onClick={closeMenu}><FiHeart size={16} /> Favorites</NavLink>}
        {currentUser && <NavLink to="/profile" onClick={closeMenu}><FiUser size={16} /> Profile</NavLink>}
        {!currentUser && (
          <>
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/register" onClick={closeMenu}>Sign up</NavLink>
          </>
        )}
        {currentUser && (
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '14px 16px', borderRadius: 'var(--r-md)', color: '#FF4757', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiLogOut size={16} /> Sign out
          </button>
        )}
      </div>
    </>
  );
}