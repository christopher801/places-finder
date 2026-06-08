// src/components/pwa/InstallBanner.jsx
// Shows a sticky banner at the bottom on mobile when app is installable
import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [prompt, setPrompt]   = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('pf_install_dismissed') === '1'
  );

  useEffect(() => {
    if (dismissed) return;
    const handler = e => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  // Hide if already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches) return null;
  if (!visible || dismissed) return null;

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('pf_install_dismissed', '1');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 2000,
      background: '#FFFFFF',
      borderTop: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      animation: 'slideUp 0.3s ease',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: '#00D4A8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,212,168,0.3)'
      }}>
        📍
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#1A1A18' }}>
          Install PlacesFinder
        </div>
        <div style={{ fontSize: 12, color: '#9B9B97', marginTop: 2 }}>
          Add to home screen for fast access
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 99, padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: '#5C5C58', fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          style={{ background: '#00D4A8', border: 'none', borderRadius: 99, padding: '7px 16px', fontSize: 13, cursor: 'pointer', color: '#0F0F0E', fontFamily: 'var(--font-display)', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,212,168,0.3)' }}
        >
          Install
        </button>
      </div>
    </div>
  );
}