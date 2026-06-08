// src/pages/PlacePage.jsx
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FiMapPin, FiPhone, FiGlobe, FiClock, FiNavigation,
  FiArrowLeft, FiShare2, FiExternalLink
} from 'react-icons/fi';
import FavoriteButton from '../components/places/FavoriteButton';
import PlaceReviews from '../components/places/PlaceReviews';
import MapView from '../components/map/MapContainer';
import { CATEGORIES } from '../utils/constants';
import Footer from '../components/common/Footer';
import '../styles/responsive.css';

export default function PlacePage() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  // Place comes from router state (passed from PlaceCard / search results)
  const place = state?.place || null;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!place) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center', padding: '120px 24px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 10 }}>Place not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>This place may no longer be available or the link has expired.</p>
        <button className="btn-primary-pf" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === place.category);

  const getDirectionsUrl = () => {
    if (!place.lat || !place.lon) return '#';
    return `https://www.openstreetmap.org/directions?from=&to=${place.lat},${place.lon}`;
  };

  const handleShare = async () => {
    const shareData = { title: place.name, url: window.location.href };
    if (navigator.share) await navigator.share(shareData);
    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
        {/* Back button */}
        <button
          className="btn-ghost-pf"
          style={{ marginBottom: 24, padding: '8px 16px', fontSize: 13 }}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft size={14} /> Back
        </button>

        <div className="row g-4">
          {/* Left column */}
          <div className="col-lg-7">
            {/* Hero image / placeholder */}
            <div className="place-detail-hero-placeholder" style={{ marginBottom: 24, position: 'relative' }}>
              <span>{cat?.emoji || '📍'}</span>
              {/* Category badge */}
              {cat && (
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  background: cat.color, color: '#fff',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                  padding: '5px 12px', borderRadius: 999,
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {cat.emoji} {cat.label}
                </span>
              )}
            </div>

            {/* Title + actions */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: 6 }}>
                  {place.name || 'Unnamed Place'}
                </h1>
                {(place.address || place.displayName) && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiMapPin size={13} />
                    {place.address || place.displayName}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <FavoriteButton place={place} />
                <button className="btn-ghost-pf" style={{ padding: '10px 14px' }} onClick={handleShare} title="Share">
                  <FiShare2 size={15} />
                </button>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="pf-tabs" style={{ marginBottom: 28 }}>
              {['info', 'map', 'reviews'].map(tab => (
                <button key={tab} className={`pf-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'info' && (
              <div className="fade-in">
                {/* Info rows */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '4px 20px', marginBottom: 24 }}>
                  {place.phone && (
                    <div className="info-row">
                      <FiPhone className="info-icon" />
                      <div>
                        <div className="info-label">Phone</div>
                        <a href={`tel:${place.phone}`} className="info-value" style={{ color: 'var(--accent)' }}>{place.phone}</a>
                      </div>
                    </div>
                  )}
                  {place.website && (
                    <div className="info-row">
                      <FiGlobe className="info-icon" />
                      <div>
                        <div className="info-label">Website</div>
                        <a href={place.website} target="_blank" rel="noopener noreferrer" className="info-value" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          {place.website.replace(/^https?:\/\//, '').split('/')[0]} <FiExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  )}
                  {place.openingHours && (
                    <div className="info-row">
                      <FiClock className="info-icon" />
                      <div>
                        <div className="info-label">Opening Hours</div>
                        <div className="info-value">{place.openingHours}</div>
                      </div>
                    </div>
                  )}
                  <div className="info-row">
                    <FiMapPin className="info-icon" />
                    <div>
                      <div className="info-label">Coordinates</div>
                      <div className="info-value" style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {place.lat?.toFixed(5)}, {place.lon?.toFixed(5)}
                      </div>
                    </div>
                  </div>
                  {place.description && (
                    <div className="info-row">
                      <span className="info-icon">📝</span>
                      <div>
                        <div className="info-label">Description</div>
                        <div className="info-value">{place.description}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Source tags */}
                {place.tags && Object.keys(place.tags).length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Additional Info
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {Object.entries(place.tags)
                        .filter(([k]) => !['name', 'amenity', 'shop', 'tourism', 'leisure'].includes(k))
                        .slice(0, 10)
                        .map(([k, v]) => (
                          <span key={k} className="pf-chip" style={{ fontSize: 12 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{k}:</span> {v}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'map' && (
              <div className="fade-in">
                {place.lat && place.lon ? (
                  <MapView
                    places={[place]}
                    center={[place.lat, place.lon]}
                    zoom={16}
                    height="400px"
                  />
                ) : (
                  <div className="pf-alert warning">
                    <span>⚠️</span><span>No coordinates available for this place.</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="fade-in">
                <PlaceReviews placeId={place.id} />
              </div>
            )}
          </div>

          {/* Right column - sticky sidebar */}
          <div className="col-lg-5">
            <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Map preview */}
              {place.lat && place.lon && (
                <MapView
                  places={[place]}
                  center={[place.lat, place.lon]}
                  zoom={15}
                  height="260px"
                />
              )}

              {/* Actions card */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Get There</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-pf"
                    style={{ justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <FiNavigation size={15} /> Get Directions
                  </a>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-pf"
                    style={{ justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <FiExternalLink size={14} /> View on OSM
                  </a>
                </div>
              </div>

              {/* Quick info */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Quick Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cat && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</div>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)', marginTop: 1 }}>{cat.label}</div>
                      </div>
                    </div>
                  )}
                  {place.source && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🗂️</span>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data Source</div>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)', marginTop: 1, textTransform: 'capitalize' }}>{place.source}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 60 }}><Footer /></div>
    </div>
  );
}
