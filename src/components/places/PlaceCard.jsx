// src/components/places/PlaceCard.jsx
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiNavigation } from 'react-icons/fi';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../utils/constants';
import { formatDistance, calculateDistance } from '../../utils/helpers';
import '../../styles/cards.css';

export default function PlaceCard({ place, userLocation, showDistance = true }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toggleFavorite, isPlaceFavorite } = useFavorites();

  const cat = CATEGORIES.find(c => c.id === place.category);
  const isFav = currentUser && isPlaceFavorite(place.id);

  const distance = userLocation && place.lat && place.lon
    ? calculateDistance(userLocation.lat, userLocation.lon, place.lat, place.lon)
    : null;

  const handleFav = async (e) => {
    e.stopPropagation();
    if (!currentUser) { navigate('/login'); return; }
    await toggleFavorite(place);
  };

  const handleCard = () => {
    navigate(`/place/${encodeURIComponent(place.id)}`, { state: { place } });
  };

  return (
    <div className="place-card" onClick={handleCard} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleCard()}>
      <div className="place-card-img">
        <div className="place-card-img-placeholder">
          {cat?.emoji || '📍'}
        </div>
        {cat && (
          <span className="place-card-category-badge" style={{ background: cat.color }}>
            {cat.emoji} {cat.label}
          </span>
        )}
        {currentUser !== undefined && (
          <button className={`place-card-fav ${isFav ? 'active' : ''}`} onClick={handleFav} aria-label="Favorite">
            <FiHeart size={15} style={{ fill: isFav ? '#FF4757' : 'none', color: isFav ? '#FF4757' : 'var(--text-secondary)' }} />
          </button>
        )}
      </div>
      <div className="place-card-body">
        <div className="place-card-name">{place.name || 'Unnamed Place'}</div>
        {(place.address || place.displayName) && (
          <div className="place-card-addr">
            <FiMapPin size={11} style={{ marginRight: 4, flexShrink: 0 }} />
            {place.address || place.displayName}
          </div>
        )}
        <div className="place-card-meta">
          {showDistance && distance !== null && (
            <span className="place-card-dist">
              <FiNavigation size={11} /> {formatDistance(distance)}
            </span>
          )}
          {place.openingHours && (
            <span className="pf-badge" style={{ fontSize: 11 }}>Open</span>
          )}
        </div>
      </div>
    </div>
  );
}
