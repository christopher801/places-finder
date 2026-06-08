// src/pages/Favorites.jsx
import { FiHeart, FiMap } from 'react-icons/fi';
import { useState } from 'react';
import FavoritesList from '../components/profile/FavoritesList';
import MapView from '../components/map/MapContainer';
import { useFavorites } from '../context/FavoritesContext';
import Footer from '../components/common/Footer';

export default function Favorites() {
  const { favorites } = useFavorites();
  const [showMap, setShowMap] = useState(false);

  const mapPlaces = favorites
    .filter(f => f.latitude && f.longitude)
    .map(f => ({
      id: f.placeId,
      name: f.placeName,
      lat: f.latitude,
      lon: f.longitude,
      category: f.category,
      address: f.address
    }));

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label">Your saved places</p>
            <h1 className="section-title" style={{ fontSize: '2rem' }}>
              <FiHeart size={24} style={{ color: '#FF4757', verticalAlign: 'middle', marginRight: 10 }} />
              Favorites
            </h1>
          </div>
          {favorites.length > 0 && (
            <button className="btn-ghost-pf" onClick={() => setShowMap(v => !v)}>
              <FiMap size={14} /> {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          )}
        </div>

        {/* Map view */}
        {showMap && mapPlaces.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <MapView places={mapPlaces} height="360px" />
          </div>
        )}

        {/* List */}
        <FavoritesList />
      </div>
      <Footer />
    </div>
  );
}
