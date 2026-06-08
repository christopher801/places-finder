// src/hooks/usePlaces.js
import { useState, useCallback } from 'react';
import { searchPlaces } from '../services/nominatimService';
import { fetchNearbyByCategory, fetchNearbyMultiCategory } from '../services/overpassService';
import { CATEGORIES } from '../utils/constants';

export function usePlaces() {
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query?.trim()) return;
    setPlacesLoading(true);
    setPlacesError(null);
    try {
      const results = await searchPlaces(query);
      setPlaces(results);
    } catch (err) {
      setPlacesError('Search failed. Please check your connection and try again.');
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  const fetchNearby = useCallback(async (lat, lon, categoryId = null, radius = 1500) => {
    setPlacesLoading(true);
    setPlacesError(null);
    try {
      let results;
      if (categoryId) {
        results = await fetchNearbyByCategory(lat, lon, categoryId, radius);
      } else {
        const defaultCats = ['restaurant', 'cafe', 'hotel', 'attraction'];
        results = await fetchNearbyMultiCategory(lat, lon, defaultCats, radius);
      }
      setPlaces(results);
    } catch (err) {
      setPlacesError('Could not load nearby places. Please try again.');
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  const clearPlaces = useCallback(() => {
    setPlaces([]);
    setPlacesError(null);
  }, []);

  return { places, placesLoading, placesError, search, fetchNearby, clearPlaces };
}
