// src/services/overpassService.js
import { CATEGORIES } from '../utils/constants';

// Overpass mirrors — essaye youn apre lòt si premye a echwe
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

/**
 * Run Overpass query with retry across mirrors
 */
async function runQuery(query) {
  let lastError;
  for (const url of OVERPASS_URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const res = await fetch(url, {
        method: 'POST',
        body: query,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 429 || res.status === 504) {
        lastError = new Error(`${res.status}`);
        continue; // essaye prochain mirror
      }
      if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      // si AbortError oswa network error, essaye prochain
      continue;
    }
  }
  throw lastError || new Error('All Overpass mirrors failed');
}

/**
 * Fetch nearby places of a given category around lat/lon within radius (meters)
 */
export async function fetchNearbyByCategory(lat, lon, categoryId, radius = 1500) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  const query = buildQuery(lat, lon, radius, cat.overpassKey, cat.overpassValue);
  const data = await runQuery(query);
  return (data.elements || []).map(el => normalizeElement(el, cat));
}

/**
 * Fetch multiple categories at once
 */
export async function fetchNearbyMultiCategory(lat, lon, categoryIds, radius = 1500) {
  const cats = CATEGORIES.filter(c => categoryIds.includes(c.id));
  if (!cats.length) return [];

  const unions = cats.map(cat =>
    `node["${cat.overpassKey}"="${cat.overpassValue}"](around:${radius},${lat},${lon});
     way["${cat.overpassKey}"="${cat.overpassValue}"](around:${radius},${lat},${lon});`
  ).join('\n');

  const query = `[out:json][timeout:20];(\n${unions}\n);out body center 40;`;
  const data = await runQuery(query);
  return (data.elements || []).map(el => {
    const matchedCat = cats.find(c => el.tags?.[c.overpassKey] === c.overpassValue) || cats[0];
    return normalizeElement(el, matchedCat);
  });
}

function buildQuery(lat, lon, radius, key, value) {
  return `[out:json][timeout:20];(
    node["${key}"="${value}"](around:${radius},${lat},${lon});
    way["${key}"="${value}"](around:${radius},${lat},${lon});
  );out body center 40;`;
}

function normalizeElement(el, cat) {
  const lat = el.lat || el.center?.lat;
  const lon = el.lon || el.center?.lon;
  const tags = el.tags || {};
  return {
    id: `osm_${el.type}_${el.id}`,
    name: tags.name || tags['name:en'] || `${cat.label} #${el.id}`,
    lat, lon,
    category: cat.id,
    categoryLabel: cat.label,
    categoryIcon: cat.emoji,
    categoryColor: cat.color,
    address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean).join(', '),
    phone: tags.phone || tags['contact:phone'] || '',
    website: tags.website || tags['contact:website'] || '',
    openingHours: tags.opening_hours || '',
    description: tags.description || '',
    source: 'overpass',
    osmType: el.type,
    osmId: el.id,
    tags
  };
}