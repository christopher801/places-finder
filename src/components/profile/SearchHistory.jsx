// src/components/profile/SearchHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getSearchHistory, deleteSearchHistory, clearAllSearchHistory } from '../../services/firestoreService';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

export default function SearchHistory() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getSearchHistory(currentUser.uid).then(setHistory).finally(() => setLoading(false));
  }, [currentUser]);

  const handleDelete = async (id) => {
    await deleteSearchHistory(id);
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all search history?')) return;
    await clearAllSearchHistory(currentUser.uid);
    setHistory([]);
  };

  if (loading) return <LoadingSpinner text="Loading history…" />;

  if (!history.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)' }}>
        <FiClock size={40} style={{ color: 'var(--border-strong)', marginBottom: 16 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>No Search History</h3>
        <p style={{ color: 'var(--text-muted)' }}>Your recent searches will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn-ghost-pf" style={{ padding: '7px 14px', fontSize: 13, color: '#FF4757', borderColor: 'rgba(255,71,87,0.3)' }} onClick={handleClearAll}>
          <FiTrash2 size={13} /> Clear All
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {history.map(h => (
          <div key={h.id} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', transition: 'background 0.15s'
          }}
            onClick={() => navigate(`/search?q=${encodeURIComponent(h.query)}`)}
          >
            <FiClock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{h.query}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(h.createdAt)}</span>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}
              onClick={e => { e.stopPropagation(); handleDelete(h.id); }}
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
