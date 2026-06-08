// src/services/firestoreService.js
import {
  collection, doc, addDoc, getDoc, getDocs,
  deleteDoc, query, where, orderBy, limit,
  serverTimestamp, updateDoc, setDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// ─── FAVORITES ───────────────────────────────────────────────────────────────

export async function addFavorite(userId, place) {
  const ref = await addDoc(collection(db, 'favorites'), {
    userId,
    placeId: place.id,
    placeName: place.name || '',
    category: place.category || '',
    latitude: place.lat,
    longitude: place.lon,
    address: place.address || '',
    createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function removeFavorite(favoriteId) {
  await deleteDoc(doc(db, 'favorites', favoriteId));
}

export async function getUserFavorites(userId) {
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
}

export async function isFavorite(userId, placeId) {
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId),
    where('placeId', '==', placeId)
  );
  const snap = await getDocs(q);
  return snap.empty ? null : { docId: snap.docs[0].id, ...snap.docs[0].data() };
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export async function addReview(userId, placeId, rating, comment, displayName) {
  return await addDoc(collection(db, 'reviews'), {
    userId,
    placeId,
    rating,
    comment,
    displayName: displayName || 'Anonymous',
    createdAt: serverTimestamp()
  });
}

export async function getPlaceReviews(placeId) {
  const q = query(
    collection(db, 'reviews'),
    where('placeId', '==', placeId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteReview(reviewId) {
  await deleteDoc(doc(db, 'reviews', reviewId));
}

export async function updateReview(reviewId, rating, comment) {
  await updateDoc(doc(db, 'reviews', reviewId), { rating, comment });
}

// ─── SEARCH HISTORY ──────────────────────────────────────────────────────────

export async function saveSearchHistory(userId, query_text) {
  await addDoc(collection(db, 'search_history'), {
    userId,
    query: query_text,
    createdAt: serverTimestamp()
  });
}

export async function getSearchHistory(userId) {
  const q = query(
    collection(db, 'search_history'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteSearchHistory(historyId) {
  await deleteDoc(doc(db, 'search_history', historyId));
}

export async function clearAllSearchHistory(userId) {
  const q = query(collection(db, 'search_history'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const deletes = snap.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletes);
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

export async function getUserProfile(userId) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(userId, data) {
  await setDoc(doc(db, 'users', userId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
