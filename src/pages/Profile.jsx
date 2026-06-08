// src/pages/Profile.jsx
import { useState, useRef } from 'react';
import { FiUser, FiHeart, FiClock, FiEdit2, FiCamera, FiMail, FiSave } from 'react-icons/fi';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { updateUserProfile } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesList from '../components/profile/FavoritesList';
import SearchHistory from '../components/profile/SearchHistory';
import Footer from '../components/common/Footer';
import '../styles/responsive.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() || 'U';

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      await updateUserProfile(currentUser.uid, { displayName: displayName.trim() });
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: <FiHeart size={14} />, count: favorites.length },
    { id: 'history', label: 'History', icon: <FiClock size={14} /> },
    { id: 'settings', label: 'Settings', icon: <FiUser size={14} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 88 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Profile header */}
        <div className="profile-header" style={{ marginBottom: 28 }}>
          <div className="profile-avatar-wrap">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="avatar" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{initials}</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {editing ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  className="pf-input"
                  style={{ maxWidth: 260, borderRadius: 'var(--r-md)' }}
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
                <button className="btn-primary-pf" style={{ padding: '10px 18px', fontSize: 13 }} onClick={handleSave} disabled={saving}>
                  <FiSave size={13} /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button className="btn-ghost-pf" style={{ padding: '10px 14px', fontSize: 13 }} onClick={() => { setEditing(false); setDisplayName(currentUser?.displayName || ''); }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>
                    {currentUser?.displayName || 'Anonymous User'}
                  </h2>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }} onClick={() => setEditing(true)} title="Edit name">
                    <FiEdit2 size={15} />
                  </button>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 0' }}>
                  <FiMail size={13} /> {currentUser?.email}
                </p>
              </div>
            )}
            {saveMsg && (
              <div className={`pf-alert ${saveMsg.includes('Failed') ? 'error' : 'success'}`} style={{ marginTop: 12, maxWidth: 340 }}>
                <span>{saveMsg.includes('Failed') ? '⚠️' : '✅'}</span><span>{saveMsg}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>{favorites.length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Favorites</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pf-tabs" style={{ marginBottom: 28 }}>
          {tabs.map(tab => (
            <button key={tab.id} className={`pf-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
              {tab.count !== undefined && <span className="pf-badge" style={{ fontSize: 11, padding: '2px 7px', marginLeft: 4 }}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="fade-in" key={activeTab}>
          {activeTab === 'favorites' && <FavoritesList />}
          {activeTab === 'history' && <SearchHistory />}
          {activeTab === 'settings' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20 }}>Account Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label-pf">Display Name</label>
                  <input className="pf-input" style={{ borderRadius: 'var(--r-md)' }} value={displayName} onChange={e => setDisplayName(e.target.value)} />
                </div>
                <div>
                  <label className="form-label-pf">Email Address</label>
                  <input className="pf-input" style={{ borderRadius: 'var(--r-md)', opacity: 0.6, cursor: 'not-allowed' }} value={currentUser?.email || ''} disabled />
                </div>
                <button className="btn-primary-pf" style={{ alignSelf: 'flex-start' }} onClick={handleSave} disabled={saving}>
                  <FiSave size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {saveMsg && (
                  <div className={`pf-alert ${saveMsg.includes('Failed') ? 'error' : 'success'}`}>
                    <span>{saveMsg.includes('Failed') ? '⚠️' : '✅'}</span><span>{saveMsg}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 60 }}><Footer /></div>
    </div>
  );
}
