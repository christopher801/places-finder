// src/pages/NotFound.jsx
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center', background: 'var(--bg)'
    }}>
      <div style={{ maxWidth: 480 }}>
        {/* Big 404 */}
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(80px, 20vw, 140px)',
          lineHeight: 1, color: 'var(--border-strong)',
          letterSpacing: '-0.05em', marginBottom: 8
        }}>404</div>

        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: 10 }}>
          Page not found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
          Looks like this location doesn't exist on our map. It may have moved or been removed.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-ghost-pf" onClick={() => navigate(-1)}>
            <FiArrowLeft size={14} /> Go Back
          </button>
          <Link to="/" className="btn-primary-pf">
            🏠 Go Home
          </Link>
          <Link to="/search" className="btn-ghost-pf">
            <FiSearch size={14} /> Search Places
          </Link>
        </div>
      </div>
    </div>
  );
}
