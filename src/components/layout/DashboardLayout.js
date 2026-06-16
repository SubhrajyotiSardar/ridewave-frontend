import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout({ menuItems, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <aside style={{ background:'var(--brand)', position:'sticky', top:'60px', height:'calc(100vh - 60px)', overflowY:'auto' }}>
        {menuItems.map((section, si) => (
          <div key={si}>
            <div style={{ padding:'16px 20px 8px', fontSize:'11px', fontWeight:'600', color:'#475569', textTransform:'uppercase', letterSpacing:'1px' }}>
              {section.section}
            </div>
            {section.items.map((item, ii) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={ii} onClick={() => item.action ? item.action() : navigate(item.path)}
                  style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 20px', color: isActive ? 'var(--accent)' : '#CBD5E1', fontSize:'14px', cursor:'pointer', transition:'.2s', borderLeft:`3px solid ${isActive ? 'var(--accent)' : 'transparent'}`, background: isActive ? 'rgba(16,185,129,.1)' : 'transparent' }}
                  onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background='rgba(255,255,255,.05)'; e.currentTarget.style.color='#fff'; }}}
                  onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#CBD5E1'; }}}>
                  <span style={{ fontSize:'18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </aside>
      {/* Content */}
      <main style={{ padding:'28px', overflowY:'auto' }}>{children}</main>
    </div>
  );
}
