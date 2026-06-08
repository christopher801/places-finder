// src/components/places/PlaceReviews.jsx
import { useState, useEffect } from 'react';
import { FiStar, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { addReview, getPlaceReviews, deleteReview, updateReview } from '../../services/firestoreService';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

function StarRating({ value, onChange, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 2 }}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}>
          <FiStar size={size} style={{
            fill: star <= (hovered || value) ? '#FFC107' : 'none',
            color: star <= (hovered || value) ? '#FFC107' : 'var(--border-strong)',
            transition: 'all 0.1s'
          }} />
        </button>
      ))}
    </div>
  );
}

export default function PlaceReviews({ placeId }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const load = async () => {
    setLoading(true);
    try { setReviews(await getPlaceReviews(placeId)); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [placeId]);

  const handleSubmit = async () => {
    if (!comment.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      await addReview(currentUser.uid, placeId, rating, comment, currentUser.displayName);
      setComment(''); setRating(5);
      await load();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await deleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleEdit = async (r) => {
    if (editingId === r.id) {
      await updateReview(r.id, editRating, editComment);
      setEditingId(null);
      await load();
    } else {
      setEditingId(r.id); setEditRating(r.rating); setEditComment(r.comment);
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      {/* Summary */}
      {avgRating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-raised)', borderRadius: 'var(--r-md)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{avgRating}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>
          <StarRating value={Math.round(avgRating)} size={22} />
        </div>
      )}

      {/* Write review */}
      {currentUser && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Write a Review</p>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 10 }}>Your rating:</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            className="pf-input"
            style={{ borderRadius: 'var(--r-md)', resize: 'vertical', minHeight: 80 }}
            placeholder="Share your experience..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button className="btn-primary-pf" style={{ marginTop: 12 }} onClick={handleSubmit} disabled={submitting || !comment.trim()}>
            {submitting ? 'Posting…' : 'Post Review'}
          </button>
        </div>
      )}

      {/* Reviews list */}
      {loading ? <LoadingSpinner text="Loading reviews..." /> : reviews.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No reviews yet. Be the first!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                    {r.displayName || 'Anonymous'}
                  </div>
                  <StarRating value={editingId === r.id ? editRating : r.rating} onChange={editingId === r.id ? setEditRating : null} size={14} />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(r.createdAt)}</span>
                  {currentUser?.uid === r.userId && (
                    <>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 4 }} onClick={() => handleEdit(r)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF4757', padding: 4 }} onClick={() => handleDelete(r.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId === r.id ? (
                <div style={{ marginTop: 10 }}>
                  <textarea className="pf-input" style={{ borderRadius: 'var(--r-md)', resize: 'vertical', minHeight: 70 }}
                    value={editComment} onChange={e => setEditComment(e.target.value)} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn-primary-pf" style={{ padding: '7px 16px', fontSize: 13 }} onClick={() => handleEdit(r)}>Save</button>
                    <button className="btn-ghost-pf" style={{ padding: '7px 16px', fontSize: 13 }} onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
