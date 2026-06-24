import React from 'react';

/**
 * Skeleton primitives — animated shimmer placeholders shown while data loads.
 * Add the @keyframes once globally (see index.css) and reuse these blocks
 * anywhere a real component would otherwise render.
 */

const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--light) 25%, #e7eaf0 37%, var(--light) 63%)',
  backgroundSize: '400% 100%',
  animation: 'rw-shimmer 1.4s ease infinite',
  borderRadius: '8px',
};

export function SkeletonBlock({ width = '100%', height = '16px', radius = '8px', style = {} }) {
  return <div style={{ ...shimmerStyle, width, height, borderRadius: radius, ...style }} />;
}

// Mirrors VehicleCard layout exactly, so the page doesn't jump when real data arrives
export function SkeletonVehicleCard() {
  return (
    <div style={{ background:'var(--surface)', borderRadius:'20px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden' }}>
      <SkeletonBlock height="150px" radius="0" />
      <div style={{ padding:'20px' }}>
        <SkeletonBlock width="70%" height="16px" style={{ marginBottom:'10px' }} />
        <SkeletonBlock width="50%" height="12px" style={{ marginBottom:'8px' }} />
        <SkeletonBlock width="40%" height="12px" style={{ marginBottom:'14px' }} />
        <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid var(--border)' }}>
          <SkeletonBlock width="60px" height="20px" />
          <SkeletonBlock width="50px" height="14px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonVehicleGrid({ count = 6 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px' }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonVehicleCard key={i} />)}
    </div>
  );
}

// Mirrors StatCard layout
export function SkeletonStatCard() {
  return (
    <div style={{ background:'var(--surface)', borderRadius:'var(--radius)', padding:'20px', border:'1px solid var(--border)' }}>
      <SkeletonBlock width="40px" height="40px" radius="10px" style={{ marginBottom:'12px' }} />
      <SkeletonBlock width="60%" height="22px" style={{ marginBottom:'8px' }} />
      <SkeletonBlock width="80%" height="12px" />
    </div>
  );
}

export function SkeletonStatGrid({ count = 3 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${count},1fr)`, gap:'16px', marginBottom:'28px' }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonStatCard key={i} />)}
    </div>
  );
}

// Mirrors a Table row
export function SkeletonTableRows({ rows = 5, cols = 5 }) {
  return (
    <div style={{ borderRadius:'var(--radius)', border:'1px solid var(--border)', overflow:'hidden', background:'var(--surface)' }}>
      <div style={{ padding:'12px 16px', background:'var(--light)', borderBottom:'1px solid var(--border)' }}>
        <SkeletonBlock width="30%" height="12px" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display:'flex', gap:'24px', padding:'14px 16px', borderBottom: r < rows - 1 ? '1px solid var(--border)' : 'none' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBlock key={c} width={`${80 / cols}%`} height="14px" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Generic list-row skeleton (used for transactions/notifications style lists)
export function SkeletonListRows({ rows = 4 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 0', borderBottom: i < rows - 1 ? '1px solid var(--border)' : 'none' }}>
          <SkeletonBlock width="40px" height="40px" radius="10px" />
          <div style={{ flex:1 }}>
            <SkeletonBlock width="60%" height="13px" style={{ marginBottom:'6px' }} />
            <SkeletonBlock width="40%" height="11px" />
          </div>
          <SkeletonBlock width="60px" height="16px" />
        </div>
      ))}
    </div>
  );
}
