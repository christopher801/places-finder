// src/components/home/PopularPlaces.jsx
// Shows curated example places from famous cities
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';

const POPULAR_DESTINATIONS = [
  { name: 'Paris', country: 'France', emoji: '🗼', desc: 'The City of Light', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo', country: 'Japan', emoji: '🗾', desc: 'Where tradition meets tech', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'USA', emoji: '🗽', desc: 'The city that never sleeps', lat: 40.7128, lon: -74.0060 },
  { name: 'London', country: 'UK', emoji: '🎡', desc: 'Historic & cosmopolitan', lat: 51.5074, lon: -0.1278 },
  { name: 'Barcelona', country: 'Spain', emoji: '🏖️', desc: 'Art, food & beaches', lat: 41.3851, lon: 2.1734 },
  { name: 'Dubai', country: 'UAE', emoji: '🏙️', desc: 'The city of the future', lat: 25.2048, lon: 55.2708 },
];

export default function PopularPlaces() {
  const navigate = useNavigate();

  const explore = (dest) => {
    navigate(`/search?q=${encodeURIComponent(dest.name + ', ' + dest.country)}`);
  };

  return (
    <section style={{ padding: '0 0 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label">Get inspired</p>
            <h2 className="section-title">Popular Destinations</h2>
          </div>
          <button className="btn-ghost-pf" onClick={() => navigate('/search')}>
            Explore all <FiArrowRight size={14} />
          </button>
        </div>

        <div className="row g-3">
          {POPULAR_DESTINATIONS.map(dest => (
            <div className="col-6 col-md-4 col-lg-2" key={dest.name}>
              <div
                className="pf-card"
                style={{ padding: '20px 16px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => explore(dest)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && explore(dest)}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{dest.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{dest.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <FiMapPin size={10} /> {dest.country}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 0, lineHeight: 1.4 }}>{dest.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
