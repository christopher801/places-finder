// src/utils/constants.js

export const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurants', icon: '🍔', emoji: '🍔', overpassKey: 'amenity', overpassValue: 'restaurant', color: '#FF6B6B' },
  { id: 'hotel', label: 'Hotels', icon: '🏨', emoji: '🏨', overpassKey: 'tourism', overpassValue: 'hotel', color: '#4ECDC4' },
  { id: 'cafe', label: 'Cafes', icon: '☕', emoji: '☕', overpassKey: 'amenity', overpassValue: 'cafe', color: '#C8A26B' },
  { id: 'hospital', label: 'Hospitals', icon: '🏥', emoji: '🏥', overpassKey: 'amenity', overpassValue: 'hospital', color: '#FF4757' },
  { id: 'pharmacy', label: 'Pharmacies', icon: '💊', emoji: '💊', overpassKey: 'amenity', overpassValue: 'pharmacy', color: '#2ED573' },
  { id: 'bank', label: 'Banks', icon: '🏦', emoji: '🏦', overpassKey: 'amenity', overpassValue: 'bank', color: '#1E90FF' },
  { id: 'atm', label: 'ATMs', icon: '🏧', emoji: '🏧', overpassKey: 'amenity', overpassValue: 'atm', color: '#FFA502' },
  { id: 'fuel', label: 'Gas Stations', icon: '⛽', emoji: '⛽', overpassKey: 'amenity', overpassValue: 'fuel', color: '#747D8C' },
  { id: 'supermarket', label: 'Supermarkets', icon: '🛒', emoji: '🛒', overpassKey: 'shop', overpassValue: 'supermarket', color: '#7BED9F' },
  { id: 'school', label: 'Schools', icon: '🏫', emoji: '🏫', overpassKey: 'amenity', overpassValue: 'school', color: '#70A1FF' },
  { id: 'park', label: 'Parks', icon: '🌳', emoji: '🌳', overpassKey: 'leisure', overpassValue: 'park', color: '#6BCB77' },
  { id: 'attraction', label: 'Attractions', icon: '📍', emoji: '📍', overpassKey: 'tourism', overpassValue: 'attraction', color: '#FF6348' },
];

export const DEFAULT_MAP_CENTER = [18.4861, -69.9312]; // Santo Domingo, DR
export const DEFAULT_ZOOM = 13;
export const NEARBY_RADIUS = 1500; // meters
export const MAX_RESULTS = 20;

export const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
export const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';
