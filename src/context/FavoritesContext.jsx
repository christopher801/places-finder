// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getUserFavorites, addFavorite, removeFavorite, isFavorite } from '../services/firestoreService';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!currentUser) { setFavorites([]); return; }
    setFavLoading(true);
    try {
      const data = await getUserFavorites(currentUser.uid);
      setFavorites(data);
    } catch (err) {
      console.error('Load favorites error:', err);
    } finally {
      setFavLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const toggleFavorite = useCallback(async (place) => {
    if (!currentUser) return false;
    const existing = favorites.find(f => f.placeId === place.id);
    if (existing) {
      await removeFavorite(existing.docId);
      setFavorites(prev => prev.filter(f => f.docId !== existing.docId));
    } else {
      const docId = await addFavorite(currentUser.uid, place);
      setFavorites(prev => [...prev, {
        docId, userId: currentUser.uid, placeId: place.id,
        placeName: place.name, category: place.category,
        latitude: place.lat, longitude: place.lon
      }]);
    }
    return true;
  }, [currentUser, favorites]);

  const isPlaceFavorite = useCallback((placeId) => {
    return favorites.some(f => f.placeId === placeId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, favLoading, toggleFavorite, isPlaceFavorite, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
