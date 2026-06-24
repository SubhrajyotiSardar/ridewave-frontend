import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const MOBILE_BREAKPOINT = 860;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu whenever the route changes
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false); };

  const navLink = (to, label, mobile = false) => {
    const active = location.pathname === to;
    return (
      <Link to={to} onClick={() => mobile && setMenuOpen(false)}
        style={{
          color: active ? 'var(--accent)' : '#CBD5E1', fontSize: mobile ? '15px' : '14px',
          padding: mobile ? '13px 18px' : '8px 14px', borderRadius: mobile ? '0' : '8px',
          background: active ? 'rgba(16,185,129,.15)' : 'transparent', fontWeight: active ? '500' : '400',
          transition:'.2s', display: mobile ? 'block' : 'inline-block',
          borderLeft: mobile ? `3px solid ${active ? 'var(--accent)' : 'transparent'}` : 'none'
        }}
        onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='rgba(255,255,255,.08)'; }}
        onMouseLeave={e=>{ if(!active) e.currentTarget.style.background = active ? 'rgba(16,185,129,.15)' : 'transparent'; }}>
        {label}
      </Link>
    );
  };

  const roleLink = user?.role === 'user' ? ['/dashboard', 'Dashboard']
    : user?.role === 'renter' ? ['/renter', 'My Fleet']
    : user?.role === 'admin' ? ['/admin', 'Admin']
    : null;

  return (
    <nav style={{ background:'var(--brand)', padding: isMobile ? '0 14px' : '0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', position:'sticky', top:0, zIndex:1000, boxShadow:'0 1px 0 rgba(255,255,255,.06)' }}>
      {/* Logo */}
      <Link to="/" onClick={() => setMenuOpen(false)} style={{ display:'flex', alignItems:'center', gap:'10px', fontFamily:'Space Grotesk,sans-serif', fontSize: isMobile ? '17px' : '20px', fontWeight:'700', color:'#fff', letterSpacing:'-0.5px' }}>
        <span style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg,var(--accent),#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', boxShadow:'0 4px 12px rgba(16,185,129,.35)', flexShrink:0 }}>🚲</span>
        Ride<span style={{ color:'var(--accent)' }}>Wave</span>
      </Link>

      {isMobile ? (
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          {user && <NotificationBell />}
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background:'rgba(255,255,255,.08)', border:'none', borderRadius:'8px', width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
            aria-label="Toggle menu">
            <span style={{ color:'#fff', fontSize:'18px' }}>{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      ) : (
        /* Desktop links — unchanged */
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          {navLink('/', 'Home')}
          {navLink('/map', '🗺️ Map')}
          {navLink('/vehicles', 'Vehicles')}

          {user ? (
            <>
              {roleLink && navLink(roleLink[0], roleLink[1])}
              <NotificationBell />
              <div style={{ width:'1px', height:'20px', background:'rgba(255,255,255,.15)', margin:'0 6px' }}/>
              <span style={{ color:'#94A3B8', fontSize:'13px', marginRight:'4px' }}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout}
                style={{ background:'rgba(239,68,68,.15)', color:'#FCA5A5', border:'none', padding:'7px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:'500', cursor:'pointer', transition:'.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,.25)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,.15)'}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color:'#CBD5E1', fontSize:'14px', padding:'8px 14px', borderRadius:'8px' }}>Sign In</Link>
              <Link to="/register"
                style={{ background:'var(--accent)', color:'#fff', fontSize:'14px', padding:'8px 16px', borderRadius:'8px', fontWeight:'500', marginLeft:'4px', transition:'.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--accent2)'}
                onMouseLeave={e=>e.currentTarget.style.background='var(--accent)'}>
                Register
              </Link>
            </>
          )}
        </div>
      )}

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, top:'60px', background:'rgba(0,0,0,.45)', zIndex:998 }} />
          <div style={{ position:'fixed', top:'60px', left:0, right:0, background:'var(--brand)', zIndex:999, boxShadow:'0 12px 32px rgba(0,0,0,.35)', maxHeight:'calc(100vh - 60px)', overflowY:'auto' }}>
            {navLink('/', 'Home', true)}
            {navLink('/map', '🗺️ Map', true)}
            {navLink('/vehicles', 'Vehicles', true)}
            {user && roleLink && navLink(roleLink[0], roleLink[1], true)}

            <div style={{ height:'1px', background:'rgba(255,255,255,.1)', margin:'8px 0' }} />

            {user ? (
              <>
                <div style={{ padding:'10px 18px', color:'#94A3B8', fontSize:'13px' }}>Signed in as <strong style={{ color:'#fff' }}>{user.name}</strong></div>
                <div onClick={handleLogout} style={{ padding:'13px 18px', color:'#FCA5A5', fontSize:'15px', cursor:'pointer' }}>Logout</div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'13px 18px', color:'#CBD5E1', fontSize:'15px' }}>Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'13px 18px', color:'var(--accent)', fontSize:'15px', fontWeight:'600' }}>Register</Link>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
