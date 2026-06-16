import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import VehicleCard from '../../components/map/VehicleCard';
import { StatCard } from '../../components/ui';

export default function Home() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get('/vehicles?status=available').then(r => setVehicles((r.data.vehicles || []).slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0F172A 0%,#1a3a5c 100%)', color:'#fff', padding:'80px 24px', textAlign:'center' }}>
        <h1 style={{ fontSize:'52px', fontWeight:'700', letterSpacing:'-1px', marginBottom:'16px', lineHeight:1.1 }}>
          Find Your Perfect <span style={{ color:'var(--accent)' }}>Ride</span>
        </h1>
        <p style={{ fontSize:'18px', color:'#94A3B8', maxWidth:'520px', margin:'0 auto 36px' }}>
          Rent bikes and scooters by the hour or day. Unlock and go — across the city.
        </p>
        <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/map')}
            style={{ padding:'14px 32px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'600', cursor:'pointer', fontFamily:'Space Grotesk,sans-serif', transition:'.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--accent2)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--accent)'}>
            🗺️ Browse on Map
          </button>
          <button onClick={() => navigate('/vehicles')}
            style={{ padding:'14px 32px', background:'rgba(255,255,255,.1)', color:'#fff', border:'2px solid rgba(255,255,255,.2)', borderRadius:'10px', fontSize:'16px', fontWeight:'600', cursor:'pointer', fontFamily:'Space Grotesk,sans-serif', transition:'.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.18)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
            View All Vehicles
          </button>
        </div>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 24px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'40px' }}>
          <StatCard icon="🚲" value="50+" label="Vehicles Available" bg="#D1FAE5" />
          <StatCard icon="📍" value="8"   label="Pickup Locations"  bg="#DBEAFE" />
          <StatCard icon="⚡" value="₹50/hr" label="Starting Price" bg="#FEF3C7" />
          <StatCard icon="⭐" value="4.8"  label="Average Rating"   bg="#FEE2E2" />
        </div>

        {/* Featured vehicles */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'22px' }}>Available Near You</h2>
          <button onClick={() => navigate('/vehicles')}
            style={{ background:'var(--light)', border:'none', padding:'8px 16px', borderRadius:'8px', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>
            View All →
          </button>
        </div>

        {vehicles.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px' }}>
            {vehicles.map(v => <VehicleCard key={v._id} vehicle={v} onClick={() => navigate('/map')} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)' }}>
            <div style={{ fontSize:'48px', marginBottom:'12px' }}>🚲</div>
            <p>Start the backend and seed data to see vehicles here.</p>
          </div>
        )}

        {/* How it works */}
        <div style={{ marginTop:'60px', textAlign:'center' }}>
          <h2 style={{ fontSize:'26px', marginBottom:'8px' }}>How It Works</h2>
          <p style={{ color:'var(--muted)', marginBottom:'36px' }}>Three simple steps to start riding</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
            {[['🔍','Find a Vehicle','Browse the map to find bikes and scooters near you'],['📅','Book & Pay','Select your time slot and pay securely via UPI, Card or Wallet'],['🚀','Ride!','Pick up the vehicle from the listed location and enjoy your ride']].map(([icon,title,desc],i)=>(
              <div key={i} style={{ background:'var(--surface)', borderRadius:'var(--radius)', padding:'28px 20px', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
                <div style={{ fontSize:'40px', marginBottom:'12px' }}>{icon}</div>
                <h3 style={{ marginBottom:'8px', fontSize:'16px' }}>{title}</h3>
                <p style={{ color:'var(--muted)', fontSize:'14px', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
