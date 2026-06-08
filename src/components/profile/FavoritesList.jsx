// src/components/profile/FavoritesList.jsx
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTrash2, FiMap } from 'react-icons/fi';
import { useFavorites } from '../../context/FavoritesContext';
import { CATEGORIES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FavoritesList() {
  const { favorites, favLoading, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (favLoading) return <LoadingSpinner text="Loading favorites…" />;

  if (!favorites.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)' }}>
        <FiHeart size={40} style={{ color: 'var(--border-strong)', marginBottom: 16 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>No Favorites Yet</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Start exploring and save places you love.</p>
        <button className="btn-primary-pf" onClick={() => navigate('/search')}>
          Explore Places
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {favorites.map(fav => {
        const cat = CATEGORIES.find(c => c.id === fav.category);
        return (
          <div key={fav.docId} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 16,
            transition: 'all 0.2s ease'
          }}>
            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--r-md)', flexShrink: 0,
              background: cat ? `${cat.color}18` : 'var(--bg-raised)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
            }}>
              {cat?.emoji || '📍'}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {fav.placeName || 'Unnamed Place'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <FiMapPin size={11} />
                {cat?.label || fav.category || 'Place'}
                {fav.address && ` · ${fav.address.split(',')[0]}`}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', background: 'var(--bg-raised)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 15 }}
                onClick={() => navigate(`/place/${encodeURIComponent(fav.placeId)}`, {
                  state: { place: { id: fav.placeId, name: fav.placeName, lat: fav.latitude, lon: fav.longitude, category: fav.category } }
                })}
                title="View details"
              >
                <FiMap size={15} />
              </button>
              <button
                style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4757', fontSize: 15 }}
                onClick={() => toggleFavorite({ id: fav.placeId, name: fav.placeName, lat: fav.latitude, lon: fav.longitude, category: fav.category })}
                title="Remove favorite"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
