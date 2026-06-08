// src/components/common/SkeletonCard.jsx
import '../../styles/cards.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: '70%' }} />
        <div className="skeleton skeleton-line" style={{ width: '90%' }} />
        <div className="skeleton skeleton-line" style={{ width: '50%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <div className="skeleton skeleton-line" style={{ width: 60, height: 22, borderRadius: 999 }} />
          <div className="skeleton skeleton-line" style={{ width: 80, height: 22, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-xl-4 col-md-6" key={i}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}
