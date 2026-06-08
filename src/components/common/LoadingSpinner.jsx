// src/components/common/LoadingSpinner.jsx
export default function LoadingSpinner({ fullPage = false, size = 'md', text = '' }) {
  const sz = size === 'sm' ? 24 : size === 'lg' ? 56 : 38;
  const stroke = size === 'sm' ? 2.5 : 3;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <svg width={sz} height={sz} viewBox="0 0 50 50" style={{ animation: 'spin 0.8s linear infinite' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <circle cx="25" cy="25" r="20" fill="none" stroke="var(--border-strong)" strokeWidth={stroke} />
        <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray="60 80" />
      </svg>
      {text && <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
}
