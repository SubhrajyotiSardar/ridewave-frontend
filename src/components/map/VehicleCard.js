import React from 'react';
import { Badge } from '../ui';

const typeEmoji = { bike: '🚲', scooter: '🛵', electric_scooter: '⚡' };

export default function VehicleCard({ vehicle, onClick }) {
  const v = vehicle;
  const stars = '★'.repeat(Math.round(v.rating || 0)) + '☆'.repeat(5 - Math.round(v.rating || 0));

  return (
    <div onClick={onClick}
      style={{ background:'var(--surface)', borderRadius:'20px', border:'1px solid var(--border)', boxShadow:'var(--shadow)', overflow:'hidden', cursor:'pointer', transition:'all .3s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,.14)'; e.currentTarget.querySelector('.veh-emoji').style.transform = 'scale(1.15) rotate(-4deg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.querySelector('.veh-emoji').style.transform = 'scale(1) rotate(0)'; }}>

      {/* Image area */}
      <div style={{
        height:'150px', position:'relative',
        background: v.images?.[0] ? `url(${v.images[0]}) center/cover no-repeat` : 'linear-gradient(135deg,#0F172A,#1E3A5F)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'72px'
      }}>
        {!v.images?.[0] && (
          <span className="veh-emoji" style={{ display:'inline-block', transition:'transform .3s ease' }}>{typeEmoji[v.type] || '🚲'}</span>
        )}
        <div style={{ position:'absolute', top:'12px', right:'12px' }}>
          <Badge status={v.status} />
        </div>
        {v.type === 'electric_scooter' && (
          <div style={{ position:'absolute', bottom:'10px', left:'12px', background:'rgba(0,0,0,.5)', borderRadius:'999px', padding:'3px 10px', fontSize:'12px', color:'#fff' }}>
            ⚡ {v.batteryLevel}%
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'20px' }}>
        <h3 style={{ fontSize:'15px', marginBottom:'3px' }}>{v.name}</h3>
        <p style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'6px' }}>{v.model} · {v.brand}</p>
        <p style={{ fontSize:'12px', color:'var(--muted)', marginBottom:'8px' }}>📍 {v.locationName || '—'}</p>
        <div style={{ fontSize:'13px', color:'#F59E0B', marginBottom:'10px' }}>
          {stars} <span style={{ color:'var(--muted)' }}>({v.ratingCount || 0})</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px solid var(--border)' }}>
          <div>
            <span style={{ fontSize:'18px', fontWeight:'700', color:'var(--accent)', fontFamily:'Space Grotesk,sans-serif' }}>₹{v.pricePerHour}</span>
            <span style={{ fontSize:'12px', color:'var(--muted)' }}>/hr</span>
          </div>
          <span style={{ fontSize:'13px', color:'var(--muted)' }}>₹{v.pricePerDay}/day</span>
        </div>
      </div>
    </div>
  );
}
