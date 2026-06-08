// src/utils/helpers.js

/**
 * Calculate distance between two coordinates in km (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

/**
 * Format address from Nominatim result
 */
export function formatAddress(address) {
  if (!address) return 'Address unavailable';
  const parts = [
    address.road,
    address.suburb || address.neighbourhood,
    address.city || address.town || address.village,
    address.country
  ].filter(Boolean);
  return parts.join(', ') || 'Address unavailable';
}

/**
 * Get category info by id
 */
export function getCategoryById(categories, id) {
  return categories.find(c => c.id === id) || null;
}

/**
 * Truncate text
 */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/**
 * Generate a unique place ID from coordinates + name
 */
export function generatePlaceId(lat, lon, name) {
  return `${lat.toFixed(5)}_${lon.toFixed(5)}_${(name || '').replace(/\s+/g, '_').toLowerCase()}`;
}

/**
 * Format timestamp
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
