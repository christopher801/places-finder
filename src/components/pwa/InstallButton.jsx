// src/components/pwa/InstallButton.jsx
// Reusable inline install button — drop it anywhere in the UI
import { useState, useEffect } from 'react';
import { FiDownload, FiCheckCircle } from 'react-icons/fi';

export default function InstallButton({ style = {}, className = '' }) {
  const [prompt, setPrompt]     = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }
    const handler = e => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Don't render if browser doesn't support install or already installed
  if (!prompt && !installed) return null;

  const handleClick = async () => {
    if (installed || !prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={installed}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '10px 20px',
        borderRadius: 9999,
        border: installed ? '1.5px solid #00D4A8' : '1.5px solid rgba(0,0,0,0.15)',
        background: installed ? 'rgba(0,212,168,0.08)' : '#FFFFFF',
        color: installed ? '#00b894' : '#1A1A18',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        cursor: installed ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {installed
        ? <><FiCheckCircle size={15} /> Installed</>
        : <><FiDownload size={15} /> Install App</>
      }
    </button>
  );
}