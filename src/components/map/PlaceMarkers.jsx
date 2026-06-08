// src/components/map/PlaceMarkers.jsx
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { CATEGORIES } from '../../utils/constants';

function createIcon(emoji, color) {
  const html = `
    <div style="
      width:36px;height:36px;
      background:${color || '#00D4A8'};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:3px solid #fff;
      box-shadow:0 4px 12px rgba(0,0,0,0.25);
      font-size:14px;
    ">
      <span style="transform:rotate(45deg)">${emoji || '📍'}</span>
    </div>`;
  return L.divIcon({ html, className: '', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] });
}

export default function PlaceMarkers({ places, onMarkerClick }) {
  if (!places?.length) return null;

  return places.map(place => {
    if (!place.lat || !place.lon) return null;
    const cat = CATEGORIES.find(c => c.id === place.category);
    const icon = createIcon(cat?.emoji || '📍', cat?.color || '#00D4A8');

    return (
      <Marker
        key={place.id}
        position={[place.lat, place.lon]}
        icon={icon}
        eventHandlers={{ click: () => onMarkerClick && onMarkerClick(place) }}
      >
        <Popup>
          <div className="map-popup-body">
            <div className="map-popup-name">{place.name || 'Unnamed'}</div>
            <div className="map-popup-cat">
              {cat?.emoji} {cat?.label || place.category || 'Place'}
            </div>
            {place.address && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                {place.address.split(',').slice(0, 2).join(',')}
              </p>
            )}
            <Link
              to={`/place/${encodeURIComponent(place.id)}`}
              state={{ place }}
              className="map-popup-link"
            >
              View Details →
            </Link>
          </div>
        </Popup>
      </Marker>
    );
  });
}
