// src/components/home/NearbyPlaces.jsx
import { useState, useEffect } from 'react';
import { FiNavigation } from 'react-icons/fi';
import { useGeolocation } from '../../hooks/useGeolocation';
import { usePlaces } from '../../hooks/usePlaces';
import PlaceCard from '../places/PlaceCard';
import { SkeletonGrid } from '../common/SkeletonCard';

export default function NearbyPlaces() {
  const { location, geoLoading, geoError, getLocation } = useGeolocation();
  const { places, placesLoading, fetchNearby } = usePlaces();
  const [asked, setAsked] = useState(false);

  const handleGetNearby = () => {
    setAsked(true);
    getLocation();
  };

  useEffect(() => {
    if (location) fetchNearby(location.lat, location.lon);
  }, [location]);

  return (
    <section style={{ padding: '0 0 80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label">Around you</p>
            <h2 className="section-title">Nearby Places</h2>
          </div>
          {!asked && (
            <button className="btn-ghost-pf" onClick={handleGetNearby} disabled={geoLoading}>
              <FiNavigation size={14} /> {geoLoading ? 'Locating…' : 'Use My Location'}
            </button>
          )}
        </div>

        {!asked && !location && (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>Discover What's Nearby</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
              Allow location access to find restaurants, cafes, hotels and more near you.
            </p>
            <button className="btn-primary-pf" onClick={handleGetNearby}>
              <FiNavigation size={14} /> Enable Location
            </button>
          </div>
        )}

        {geoError && (
          <div className="pf-alert error">
            <span>⚠️</span>
            <span>{geoError}</span>
          </div>
        )}

        {(placesLoading) && <SkeletonGrid count={6} />}

        {!placesLoading && places.length > 0 && (
          <div className="row g-3">
            {places.slice(0, 6).map(place => (
              <div className="col-xl-4 col-md-6" key={place.id}>
                <PlaceCard place={place} userLocation={location} />
              </div>
            ))}
          </div>
        )}

        {!placesLoading && asked && places.length === 0 && !geoError && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>
            No places found nearby. Try expanding the search radius.
          </p>
        )}
      </div>
    </section>
  );
}
