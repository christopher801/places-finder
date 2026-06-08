// src/pages/SearchResults.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiMap, FiList, FiFilter, FiNavigation } from 'react-icons/fi';
import { usePlaces } from '../hooks/usePlaces';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../context/AuthContext';
import { saveSearchHistory } from '../services/firestoreService';
import { fetchNearbyByCategory } from '../services/overpassService';
import PlaceCard from '../components/places/PlaceCard';
import MapView from '../components/map/MapContainer';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { CATEGORIES } from '../utils/constants';
import Footer from '../components/common/Footer';
import '../styles/responsive.css';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const nearbyParam = searchParams.get('nearby') === '1';

  const { places, placesLoading, placesError, search, fetchNearby } = usePlaces();
  const { location, getLocation, geoLoading, geoError } = useGeolocation();
  const { currentUser } = useAuth();

  const [viewMode, setViewMode] = useState('list');
  const [inputVal, setInputVal] = useState(query);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [mapCenter, setMapCenter] = useState(null);

  // Run search on mount / param change
  useEffect(() => {
    if (nearbyParam) {
      getLocation();
    } else if (categoryParam) {
      setActiveCategory(categoryParam);
    } else if (query) {
      runSearch(query);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearby(location.lat, location.lon, activeCategory || null);
      setMapCenter([location.lat, location.lon]);
    }
  }, [location]);

  const runSearch = async (q) => {
    search(q);
    if (currentUser) saveSearchHistory(currentUser.uid, q).catch(() => {});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchParams({ q: inputVal.trim() });
    setActiveCategory('');
    runSearch(inputVal.trim());
  };

  const handleCategory = (catId) => {
    const newCat = activeCategory === catId ? '' : catId;
    setActiveCategory(newCat);
    if (location) {
      fetchNearby(location.lat, location.lon, newCat || null);
    } else if (newCat) {
      setSearchParams({ category: newCat });
      getLocation();
    }
  };

  const handleNearby = () => {
    getLocation();
  };

  const handleMarkerClick = (place) => {
    if (place.lat && place.lon) setMapCenter([place.lat, place.lon]);
  };

  const mapPlaces = places.filter(p => p.lat && p.lon);

  return (
    <div className="search-page" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Search bar */}
        <div style={{ marginBottom: 28 }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: 700 }}>
            <FiSearch style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18, pointerEvents: 'none' }} />
            <input
              className="pf-input"
              style={{ paddingLeft: 50, paddingRight: 120, fontSize: 16 }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search places, cities, restaurants…"
            />
            <button type="submit" className="btn-primary-pf" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: '8px 18px', fontSize: 13 }}>
              Search
            </button>
          </form>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="search-sidebar">
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiFilter size={14} /> Filter by Category
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.id}
                    className={`pf-chip ${activeCategory === cat.id ? 'active' : ''}`}
                    style={{ justifyContent: 'flex-start', width: '100%', background: activeCategory === cat.id ? `${cat.color}15` : undefined, borderColor: activeCategory === cat.id ? cat.color : undefined, color: activeCategory === cat.id ? cat.color : undefined }}
                    onClick={() => handleCategory(cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              <hr className="pf-divider" style={{ margin: '20px 0' }} />

              <button className="btn-ghost-pf" style={{ width: '100%', justifyContent: 'center' }} onClick={handleNearby} disabled={geoLoading}>
                <FiNavigation size={14} /> {geoLoading ? 'Locating…' : 'Find Nearby'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-9">
            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
                {places.length > 0 ? `${places.length} result${places.length !== 1 ? 's' : ''}${query ? ` for "${query}"` : ''}` : query ? `Searching for "${query}"…` : 'Explore places'}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className={`pf-chip ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><FiList size={13} /> List</button>
                <button className={`pf-chip ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}><FiMap size={13} /> Map</button>
                <button className={`pf-chip ${viewMode === 'both' ? 'active' : ''}`} onClick={() => setViewMode('both')}>Both</button>
              </div>
            </div>

            {/* Errors */}
            {(geoError || placesError) && (
              <div className="pf-alert error" style={{ marginBottom: 20 }}>
                <span>⚠️</span><span>{geoError || placesError}</span>
              </div>
            )}

            {/* Map */}
            {(viewMode === 'map' || viewMode === 'both') && (
              <div style={{ marginBottom: 24 }}>
                <MapView
                  places={mapPlaces}
                  center={mapCenter || (location ? [location.lat, location.lon] : undefined)}
                  height="400px"
                  userLocation={location}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            )}

            {/* List */}
            {(viewMode === 'list' || viewMode === 'both') && (
              <>
                {placesLoading && <SkeletonGrid count={6} />}
                {!placesLoading && places.length === 0 && !geoLoading && (
                  <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)' }}>
                    <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>No places found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Try a different search term or explore a category.</p>
                  </div>
                )}
                {!placesLoading && places.length > 0 && (
                  <div className="row g-3">
                    {places.map(place => (
                      <div className="col-xl-4 col-md-6" key={place.id}>
                        <PlaceCard place={place} userLocation={location} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
