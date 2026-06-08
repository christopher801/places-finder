// src/components/places/FavoriteButton.jsx
import { FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

export default function FavoriteButton({ place, size = 'md' }) {
  const { currentUser } = useAuth();
  const { toggleFavorite, isPlaceFavorite } = useFavorites();
  const navigate = useNavigate();
  const isFav = currentUser && isPlaceFavorite(place.id);

  const handleClick = async () => {
    if (!currentUser) { navigate('/login'); return; }
    await toggleFavorite(place);
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: size === 'sm' ? '7px 14px' : '10px 20px',
    borderRadius: 'var(--r-full)',
    border: '1.5px solid',
    borderColor: isFav ? '#FF4757' : 'var(--border-strong)',
    background: isFav ? 'rgba(255,71,87,0.08)' : 'var(--bg-card)',
    color: isFav ? '#FF4757' : 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: size === 'sm' ? 13 : 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <button style={btnStyle} onClick={handleClick}>
      <FiHeart size={iconSize} style={{ fill: isFav ? '#FF4757' : 'none' }} />
      {isFav ? 'Saved' : 'Save'}
    </button>
  );
}
