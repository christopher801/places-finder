// src/components/map/MapContainer.jsx
import { useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import { FiMaximize, FiNavigation } from 'react-icons/fi';
import PlaceMarkers from './PlaceMarkers';
import UserLocation from './UserLocation';
import 'leaflet/dist/leaflet.css';
import '../../styles/map.css';

// Fix Leaflet default marker icons in Vite
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

function FlyToUser({ location }) {
  const map = useMap();
  if (location) map.flyTo([location.lat, location.lon], 14, { animate: true, duration: 1.2 });
  return null;
}

export default function MapView({
  places = [],
  center,
  zoom = 13,
  height = '480px',
  userLocation = null,
  onMarkerClick = null,
  flyTo = null
}) {
  const defaultCenter = center || [18.4861, -69.9312];

  return (
    <div className="pf-map-wrapper" style={{ height }}>
      <LeafletMap
        center={defaultCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {/* Markers */}
        <PlaceMarkers places={places} onMarkerClick={onMarkerClick} />

        {/* User location */}
        {userLocation && <UserLocation location={userLocation} />}

        {/* Fly-to effect */}
        {flyTo && <FlyToUser location={flyTo} />}
      </LeafletMap>
    </div>
  );
}
