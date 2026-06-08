// src/services/nominatimService.js
import { NOMINATIM_BASE_URL } from '../utils/constants';

const HEADERS = { 'Accept-Language': 'en' };

/**
 * Search places by text query
 */
export async function searchPlaces(query, limit = 20) {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: 1,
    limit,
    extratags: 1,
    namedetails: 1
  });
  const res = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.map(normalizeNominatim);
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat, lon) {
  const params = new URLSearchParams({ lat, lon, format: 'json', addressdetails: 1 });
  const res = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error('Reverse geocode failed');
  return await res.json();
}

/**
 * Normalize Nominatim result to internal format
 */
function normalizeNominatim(item) {
  return {
    id: `nom_${item.place_id}`,
    name: item.namedetails?.name || item.display_name.split(',')[0],
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    category: item.type || item.class || 'place',
    address: item.display_name,
    addressObj: item.address,
    type: item.type,
    class: item.class,
    importance: item.importance,
    source: 'nominatim'
  };
}
