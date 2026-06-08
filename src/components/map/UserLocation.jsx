// src/components/map/UserLocation.jsx
import { Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

const userIcon = L.divIcon({
  html: `<div style="
    width:16px;height:16px;
    background:#00D4A8;
    border-radius:50%;
    border:3px solid #fff;
    box-shadow:0 0 0 4px rgba(0,212,168,0.3),0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export default function UserLocation({ location }) {
  if (!location?.lat || !location?.lon) return null;
  return (
    <>
      <Circle
        center={[location.lat, location.lon]}
        radius={200}
        pathOptions={{ color: '#00D4A8', fillColor: '#00D4A8', fillOpacity: 0.08, weight: 1.5 }}
      />
      <Marker position={[location.lat, location.lon]} icon={userIcon} />
    </>
  );
}
