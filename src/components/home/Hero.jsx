// src/components/home/Hero.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiNavigation, FiMapPin } from 'react-icons/fi';
import { useGeolocation } from '../../hooks/useGeolocation';
import '../../styles/responsive.css';

export default function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { getLocation, geoLoading } = useGeolocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLocation = () => {
    getLocation();
    navigate('/search?nearby=1');
  };

  return (
    <section className="pf-hero">
      {/* Bg blobs */}
      <div className="hero-bg-blob" style={{ width: 600, height: 600, background: 'rgba(0,212,168,0.07)', top: -200, right: -100 }} />
      <div className="hero-bg-blob" style={{ width: 400, height: 400, background: 'rgba(0,212,168,0.05)', bottom: -100, left: -80 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div className="row align-items-center g-5">
          <div className="col-lg-6 hero-content fade-in">
            <div className="pf-badge" style={{ marginBottom: 20, fontSize: 12 }}>
              <FiMapPin size={12} /> Discover the world around you
            </div>
            <h1 className="hero-title">
              Find <span className="accent-word">Amazing</span><br />
              Places Near You
            </h1>
            <p className="hero-sub" style={{ marginTop: 18 }}>
              Search restaurants, hotels, cafes, hospitals and more. Explore interactive maps and save your favorite spots.
            </p>

            <form className="hero-search-wrap" onSubmit={handleSearch}>
              <FiSearch className="hero-search-icon" />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search places, cities, restaurants…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">Search</button>
            </form>

            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <button className="btn-ghost-pf" onClick={handleLocation} disabled={geoLoading}>
                <FiNavigation size={14} /> {geoLoading ? 'Locating…' : 'Use My Location'}
              </button>
            </div>

            <div className="hero-stats">
              {[['12+', 'Categories'], ['Free', 'Always'], ['Maps', 'Interactive']].map(([num, label]) => (
                <div key={label}>
                  <div className="hero-stat-num">{num}</div>
                  <div className="hero-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block fade-in" style={{ animationDelay: '0.15s' }}>
            <div style={{ position: 'relative' }}>
              {/* Map preview card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                aspectRatio: '4/3'
              }}>
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, var(--bg-raised) 0%, var(--bg-card) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 16, position: 'relative'
                }}>
                  {/* Decorative grid */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--text-primary)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Pin markers decoration */}
                  {[
                    { top: '25%', left: '30%', emoji: '🍔', color: '#FF6B6B', delay: '0s' },
                    { top: '45%', left: '60%', emoji: '☕', color: '#C8A26B', delay: '0.3s' },
                    { top: '65%', left: '25%', emoji: '🏨', color: '#4ECDC4', delay: '0.6s' },
                    { top: '30%', left: '70%', emoji: '📍', color: '#00D4A8', delay: '0.2s' },
                  ].map(({ top, left, emoji, color, delay }) => (
                    <div key={emoji} style={{
                      position: 'absolute', top, left,
                      animation: `float 3s ease-in-out ${delay} infinite`,
                      zIndex: 2
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50% 50% 50% 0',
                        background: color, transform: 'rotate(-45deg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                        border: '3px solid white',
                        fontSize: 18
                      }}>
                        <span style={{ transform: 'rotate(45deg)' }}>{emoji}</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', margin: 0 }}>Interactive Map</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Explore places visually</p>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', padding: '14px 18px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <span style={{ fontSize: 24 }}>📍</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>Your Location</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ready to explore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
