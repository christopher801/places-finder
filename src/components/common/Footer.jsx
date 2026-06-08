// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { FiMap, FiHeart, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="pf-footer">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="pf-logo-icon">📍</div>
              <span className="footer-logo-text" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>PlacesFinder</span>
            </Link>
            <p className="footer-tagline">Discover amazing places around you. Search, explore, and save your favorite spots anywhere in the world.</p>
          </div>
          <div className="col-lg-2 col-md-3 col-6">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Explore</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['/', '/search', '/favorites'].map((path, i) => (
                <li key={path}><Link to={path} style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {['Home', 'Search Places', 'Favorites'][i]}
                </Link></li>
              ))}
            </ul>
          </div>
          <div className="col-lg-2 col-md-3 col-6">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Account</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['/login', '/register', '/profile'].map((path, i) => (
                <li key={path}><Link to={path} style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {['Login', 'Register', 'Profile'][i]}
                </Link></li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4 col-md-6">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Powered by</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['OpenStreetMap', 'Nominatim API', 'Overpass API', 'Firebase'].map(s => (
                <span key={s} style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--accent)' }}>•</span> {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr className="pf-divider" />
        <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            © {new Date().getFullYear()} PlacesFinder. Built with <FiHeart size={12} style={{ color: '#FF4757', verticalAlign: 'middle' }} /> using React & Firebase.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Map data © OpenStreetMap contributors</p>
        </div>
      </div>
    </footer>
  );
}
