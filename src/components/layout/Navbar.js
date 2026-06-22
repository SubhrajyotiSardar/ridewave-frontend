import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link to={to} style={{ color: active ? 'var(--accent)' : '#CBD5E1', fontSize:'14px', padding:'8px 14px', borderRadius:'8px', background: active ? 'rgba(16,185,129,.15)' : 'transparent', fontWeight: active ? '500' : '400', transition:'.2s' }}
        onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='rgba(255,255,255,.08)'; }}
        onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent'; }}>
        {label}
      </Link>
    );
  };

  return (
    <nav style={{ background:'var(--brand)', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', position:'sticky', top:0, zIndex:1000, boxShadow:'0 1px 0 rgba(255,255,255,.06)' }}>
      {/* Logo */}
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px', fontFamily:'Space Grotesk,sans-serif', fontSize:'20px', fontWeight:'700', color:'#fff', letterSpacing:'-0.5px' }}>
        <span style={{ width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg,var(--accent),#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'17px', boxShadow:'0 4px 12px rgba(16,185,129,.35)' }}>🚲</span>
        Ride<span style={{ color:'var(--accent)' }}>Wave</span>
      </Link>

      {/* Links */}
      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
        {navLink('/', 'Home')}
        {navLink('/map', '🗺️ Map')}
        {navLink('/vehicles', 'Vehicles')}

        {user ? (
          <>
            {user.role === 'user' && navLink('/dashboard', 'Dashboard')}
            {user.role === 'renter' && navLink('/renter', 'My Fleet')}
            {user.role === 'admin' && navLink('/admin', 'Admin')}
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
    </nav>
  );
}
