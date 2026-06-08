// src/components/home/Categories.jsx
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import '../../styles/cards.css';

export default function Categories() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <p className="section-label">Browse by type</p>
          <h2 className="section-title">Explore Categories</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 10, maxWidth: 480 }}>
            Discover thousands of places across different categories, all powered by OpenStreetMap data.
          </p>
        </div>

        <div className="row g-3">
          {CATEGORIES.map(cat => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={cat.id}>
              <div
                className="category-card"
                onClick={() => navigate(`/search?category=${cat.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/search?category=${cat.id}`)}
              >
                <div className="category-icon" style={{ background: `${cat.color}18`, color: cat.color }}>
                  {cat.emoji}
                </div>
                <span className="category-name">{cat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
