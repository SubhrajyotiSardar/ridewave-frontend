import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import VehicleCard from '../../components/map/VehicleCard';

export default function Home() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get('/vehicles?status=available').then(r => setVehicles((r.data.vehicles || []).slice(0, 6))).catch(() => {});
  }, []);

  const stats = [
    { icon:'🚲', value:'50+',    label:'Vehicles Available', bg:'#D1FAE5' },
    { icon:'📍', value:'8',      label:'Pickup Locations',   bg:'#DBEAFE' },
    { icon:'⚡', value:'₹50/hr', label:'Starting Price',     bg:'#FEF3C7' },
  ];

  const steps = [
    { icon:'🔍', title:'Find a Vehicle', desc:'Browse the live map to find bikes and scooters near you in real time' },
    { icon:'📅', title:'Book & Pay',     desc:'Select your time slot and pay securely via UPI, Card or Wallet' },
    { icon:'🚀', title:'Ride!',          desc:'Pick up the vehicle from the listed location and enjoy your ride' },
  ];

  return (
    <div style={{ overflow:'hidden' }}>
      {/* ───────────── HERO ───────────── */}
      <div style={{ position:'relative', background:'linear-gradient(135deg,#0F172A 0%,#13294B 50%,#0F172A 100%)', color:'#fff', padding:'100px 24px 110px', textAlign:'center', overflow:'hidden' }}>
        {/* Decorative glow blobs */}
        <div style={{ position:'absolute', top:'-120px', left:'-100px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,.25), transparent 70%)', filter:'blur(10px)' }} />
        <div style={{ position:'absolute', bottom:'-140px', right:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,.2), transparent 70%)', filter:'blur(10px)' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Eyebrow badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.3)', borderRadius:'999px', padding:'7px 18px', fontSize:'13px', fontWeight:'600', color:'#34D399', marginBottom:'24px' }}>
            <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#34D399', display:'inline-block', boxShadow:'0 0 0 4px rgba(52,211,153,.2)' }} />
            Live in 8 locations across Kolkata
          </div>

          <h1 style={{ fontSize:'56px', fontWeight:'700', letterSpacing:'-1.5px', marginBottom:'18px', lineHeight:1.08 }}>
            Find Your Perfect <span style={{ color:'var(--accent)' }}>Ride</span>
          </h1>
          <p style={{ fontSize:'18px', color:'#94A3B8', maxWidth:'540px', margin:'0 auto 40px', lineHeight:1.6 }}>
            Rent bikes and scooters by the hour or day. Real-time availability, instant booking, secure payments — unlock and go.
          </p>

          <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <HeroButton primary icon="🗺️" label="Browse on Map" onClick={() => navigate('/map')} />
            <HeroButton icon="🚲" label="View All Vehicles" onClick={() => navigate('/vehicles')} />
          </div>
        </div>

        {/* Bottom wave fade into page bg */}
        <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:'80px', background:'linear-gradient(to bottom, transparent, var(--bg))' }} />
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px 80px' }}>

        {/* ───────────── STATS ───────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', maxWidth:'780px', margin:'-56px auto 64px', position:'relative', zIndex:2 }}>
          {stats.map((s, i) => <StatCardHover key={i} {...s} />)}
        </div>

        {/* ───────────── FEATURED VEHICLES ───────────── */}
        <SectionHeading eyebrow="Available Now" title="Near You" action={
          <PillButton onClick={() => navigate('/vehicles')}>View All →</PillButton>
        } />

        {vehicles.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'22px', marginBottom:'80px' }}>
            {vehicles.map(v => <VehicleCard key={v._id} vehicle={v} onClick={() => navigate('/map')} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'56px 24px', color:'var(--muted)', background:'var(--surface)', borderRadius:'20px', border:'1px solid var(--border)', marginBottom:'80px' }}>
            <div style={{ fontSize:'48px', marginBottom:'12px' }}>🚲</div>
            <p>Start the backend and seed data to see vehicles here.</p>
          </div>
        )}

        {/* ───────────── HOW IT WORKS ───────────── */}
        <SectionHeading eyebrow="Simple Process" title="How It Works" center
          subtitle="Three simple steps to start riding" />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'28px', marginBottom:'80px', position:'relative' }}>
          {/* Connecting line */}
          <div style={{ position:'absolute', top:'46px', left:'16%', right:'16%', height:'2px', background:'repeating-linear-gradient(to right, var(--border) 0, var(--border) 8px, transparent 8px, transparent 16px)', zIndex:0 }} />
          {steps.map((s, i) => <StepCard key={i} index={i + 1} {...s} />)}
        </div>

        {/* ───────────── CLOSING CTA BANNER ───────────── */}
        <div style={{ position:'relative', borderRadius:'24px', overflow:'hidden', background:'linear-gradient(135deg,#0F172A,#1a3a5c)', padding:'56px 40px', textAlign:'center', color:'#fff' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-60px', width:'260px', height:'260px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,.25), transparent 70%)' }} />
          <h2 style={{ fontSize:'30px', fontWeight:'700', marginBottom:'12px', position:'relative', zIndex:1 }}>
            Ready to hit the road?
          </h2>
          <p style={{ color:'#94A3B8', fontSize:'16px', marginBottom:'28px', position:'relative', zIndex:1 }}>
            Join thousands of riders already using RideWave every day.
          </p>
          <div style={{ position:'relative', zIndex:1 }}>
            <HeroButton primary icon="🚀" label="Get Started Free" onClick={() => navigate('/register')} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HERO BUTTON ───────────────────────────────────────────────────────────────
function HeroButton({ primary, icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap:'10px',
        padding:'15px 32px', borderRadius:'14px', fontSize:'16px', fontWeight:'600',
        fontFamily:'Space Grotesk,sans-serif', cursor:'pointer',
        border: primary ? 'none' : '2px solid rgba(255,255,255,.18)',
        background: primary ? 'var(--accent)' : (hover ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.06)'),
        color:'#fff',
        transform: hover ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hover ? (primary ? '0 12px 28px rgba(16,185,129,.4)' : '0 8px 20px rgba(0,0,0,.25)') : 'none',
        transition:'all .25s ease',
      }}>
      <span style={{ display:'inline-block', transform: hover ? 'scale(1.25) rotate(-6deg)' : 'scale(1)', transition:'transform .25s ease' }}>{icon}</span>
      {label}
    </button>
  );
}

// ── PILL BUTTON (small) ────────────────────────────────────────────────────────
function PillButton({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: hover ? 'var(--accent)' : 'var(--light)', color: hover ? '#fff' : 'var(--text)', border:'none', padding:'10px 20px', borderRadius:'999px', fontSize:'14px', fontWeight:'600', cursor:'pointer', transition:'all .2s ease', transform: hover ? 'translateX(3px)' : 'translateX(0)' }}>
      {children}
    </button>
  );
}

// ── SECTION HEADING ───────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle, action, center }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent: center ? 'center' : 'space-between', textAlign: center ? 'center' : 'left', flexDirection: center ? 'column' : 'row', marginBottom:'28px', flexWrap:'wrap', gap:'14px' }}>
      <div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
          <span style={{ width:'18px', height:'3px', borderRadius:'2px', background:'var(--accent)' }} />
          <span style={{ fontSize:'12px', fontWeight:'700', color:'var(--accent2)', textTransform:'uppercase', letterSpacing:'1.2px' }}>{eyebrow}</span>
        </div>
        <h2 style={{ fontSize:'28px', fontWeight:'700', letterSpacing:'-0.5px' }}>{title}</h2>
        {subtitle && <p style={{ color:'var(--muted)', fontSize:'15px', marginTop:'6px' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── STAT CARD WITH HOVER ──────────────────────────────────────────────────────
function StatCardHover({ icon, value, label, bg }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background:'var(--surface)', borderRadius:'20px', padding:'26px 22px',
        border:'1px solid var(--border)',
        boxShadow: hover ? '0 16px 36px rgba(0,0,0,.12)' : '0 2px 10px rgba(0,0,0,.05)',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        transition:'all .3s ease', cursor:'default',
      }}>
      <div style={{
        width:'52px', height:'52px', borderRadius:'16px', background:bg,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', marginBottom:'16px',
        transform: hover ? 'scale(1.12) rotate(8deg)' : 'scale(1) rotate(0)',
        transition:'transform .3s ease',
      }}>{icon}</div>
      <div style={{ fontSize:'28px', fontWeight:'700', fontFamily:'Space Grotesk,sans-serif', letterSpacing:'-0.5px' }}>{value}</div>
      <div style={{ fontSize:'13.5px', color:'var(--muted)', marginTop:'4px', fontWeight:'500' }}>{label}</div>
    </div>
  );
}

// ── STEP CARD WITH HOVER ──────────────────────────────────────────────────────
function StepCard({ index, icon, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background:'var(--surface)', borderRadius:'20px', padding:'34px 26px',
        border:'1px solid var(--border)', textAlign:'center', position:'relative', zIndex:1,
        boxShadow: hover ? '0 18px 40px rgba(0,0,0,.12)' : 'var(--shadow)',
        transform: hover ? 'translateY(-8px)' : 'translateY(0)',
        transition:'all .3s ease',
      }}>
      {/* Step number badge */}
      <div style={{ position:'absolute', top:'-16px', left:'50%', transform:'translateX(-50%)', width:'32px', height:'32px', borderRadius:'50%', background:'var(--brand)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', fontFamily:'Space Grotesk,sans-serif', border:'3px solid var(--bg)' }}>
        {index}
      </div>
      <div style={{
        width:'72px', height:'72px', borderRadius:'20px', margin:'12px auto 18px',
        background: hover ? 'rgba(16,185,129,.12)' : 'var(--light)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'34px',
        transform: hover ? 'scale(1.1) translateY(-4px)' : 'scale(1) translateY(0)',
        transition:'all .3s ease',
      }}>{icon}</div>
      <h3 style={{ marginBottom:'10px', fontSize:'17px', fontWeight:'700' }}>{title}</h3>
      <p style={{ color:'var(--muted)', fontSize:'14px', lineHeight:1.65 }}>{desc}</p>
    </div>
  );
}
