import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function DashboardLayout({ menuItems, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer automatically whenever the route changes
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  // Prevent body scroll behind the drawer while it's open
  useEffect(() => {
    document.body.style.overflow = (isMobile && drawerOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, drawerOpen]);

  const handleItemClick = (item) => {
    if (item.action) item.action();
    else navigate(item.path);
    setDrawerOpen(false);
  };

  const sidebarContent = (
    <>
      {menuItems.map((section, si) => (
        <div key={si}>
          <div style={{ padding:'16px 20px 8px', fontSize:'11px', fontWeight:'600', color:'#475569', textTransform:'uppercase', letterSpacing:'1px' }}>
            {section.section}
          </div>
          {section.items.map((item, ii) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={ii} onClick={() => handleItemClick(item)}
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
    </>
  );

  if (isMobile) {
    return (
      <div style={{ minHeight:'calc(100vh - 60px)' }}>
        {/* Mobile top bar with hamburger trigger */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'var(--brand)', position:'sticky', top:'60px', zIndex:90, borderBottom:'1px solid rgba(255,255,255,.08)' }}>
          <button onClick={() => setDrawerOpen(true)}
            style={{ background:'rgba(255,255,255,.08)', border:'none', borderRadius:'8px', width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}
            aria-label="Open menu">
            <span style={{ color:'#fff', fontSize:'18px' }}>☰</span>
          </button>
          <span style={{ color:'#fff', fontSize:'15px', fontWeight:'600' }}>Menu</span>
        </div>

        {/* Backdrop */}
        {drawerOpen && (
          <div onClick={() => setDrawerOpen(false)}
            style={{ position:'fixed', inset:0, top:'60px', background:'rgba(0,0,0,.5)', zIndex:95, animation:'rw-fade-in .2s ease' }} />
        )}

        {/* Slide-in drawer */}
        <aside style={{
          position:'fixed', top:'60px', left:0, bottom:0, width:'260px', maxWidth:'82vw',
          background:'var(--brand)', zIndex:100, overflowY:'auto',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform .28s ease', boxShadow: drawerOpen ? '8px 0 32px rgba(0,0,0,.3)' : 'none'
        }}>
          <div style={{ display:'flex', justifyContent:'flex-end', padding:'10px 14px' }}>
            <button onClick={() => setDrawerOpen(false)}
              style={{ background:'rgba(255,255,255,.08)', border:'none', borderRadius:'8px', width:'32px', height:'32px', color:'#fff', fontSize:'16px', cursor:'pointer' }}
              aria-label="Close menu">✕</button>
          </div>
          {sidebarContent}
        </aside>

        {/* Content */}
        <main style={{ padding:'20px 16px' }}>{children}</main>
      </div>
    );
  }

  // Desktop layout — unchanged two-column grid
  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'calc(100vh - 60px)' }}>
      <aside style={{ background:'var(--brand)', position:'sticky', top:'60px', height:'calc(100vh - 60px)', overflowY:'auto' }}>
        {sidebarContent}
      </aside>
      <main style={{ padding:'28px', overflowY:'auto' }}>{children}</main>
    </div>
  );
}
