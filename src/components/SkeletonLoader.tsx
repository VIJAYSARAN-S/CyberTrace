import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2s infinite',
  borderRadius: '6px'
};

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div style={{ ...shimmerStyle, ...style }} className={className} />
);

export const SkeletonCard: React.FC = () => (
  <div style={{
    background: '#ffffff',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    padding: '1.375rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Skeleton style={{ height: '10px', width: '80px' }} />
      <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
    </div>
    <Skeleton style={{ height: '40px', width: '70px', marginTop: '0.25rem' }} />
    <Skeleton style={{ height: '10px', width: '110px' }} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div style={{
    background: '#ffffff',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px',
    overflow: 'hidden'
  }}>
    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '0.75rem' }}>
      <Skeleton style={{ height: '32px', flex: 1, maxWidth: '240px' }} />
      <Skeleton style={{ height: '32px', width: '100px' }} />
    </div>
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Skeleton style={{ height: '12px', width: '80px' }} />
          <Skeleton style={{ height: '12px', flex: 1 }} />
          <Skeleton style={{ height: '12px', width: '70px' }} />
          <Skeleton style={{ height: '22px', width: '60px', borderRadius: '6px' }} />
          <Skeleton style={{ height: '12px', width: '60px' }} />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1.75rem' }}>
    {/* KPI cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1rem' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]" style={{ gap: '1.25rem' }}>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} style={{
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px',
          padding: '1.5rem'
        }}>
          <Skeleton style={{ height: '14px', width: '140px', marginBottom: '1.25rem' }} />
          <Skeleton style={{ height: '220px', width: '100%' }} />
        </div>
      ))}
    </div>
    {/* Table */}
    <SkeletonTable rows={4} />
  </div>
);

export default Skeleton;
