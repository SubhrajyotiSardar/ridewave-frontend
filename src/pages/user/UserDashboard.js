import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatCard, Button } from '../../components/ui';

export default function UserDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  // Always pull fresh stats on entering the dashboard — totalRides/totalSpent
  // change server-side after bookings/payments, so localStorage data goes stale.
  useEffect(() => { refreshUser(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const menu = [
    { section:'My Account', items:[
      { icon:'📊', label:'Overview',      path:'/dashboard' },
      { icon:'📋', label:'My Bookings',   path:'/dashboard/bookings' },
      { icon:'💰', label:'Wallet',         path:'/dashboard/wallet' },
      { icon:'📄', label:'Transactions',   path:'/dashboard/transactions' },
      { icon:'🗺️', label:'Find a Ride',   path:'/map' },
      { icon:'👤', label:'Profile',        path:'/dashboard/profile' },
    ]},
    { section:'Account', items:[{ icon:'🚪', label:'Logout', path:'/', action: handleLogout }]}
  ];

  return (
    <DashboardLayout menuItems={menu}>
      <h2 style={{ marginBottom:'4px' }}>Welcome back, {user?.name} 👋</h2>
      <p style={{ color:'var(--muted)', marginBottom:'28px' }}>Here's your riding summary</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'28px' }}>
        <StatCard icon="🚲" value={user?.totalRides || 0}        label="Total Bookings"  bg="#D1FAE5" />
        <StatCard icon="💸" value={`₹${user?.totalSpent || 0}`}  label="Total Spent"     bg="#FEF3C7" />
        <StatCard icon="💰" value={`₹${user?.walletBalance || 0}`} label="Wallet Balance" bg="#DBEAFE" onClick={() => navigate('/dashboard/wallet')} />
      </div>
      <h3 style={{ fontSize:'16px', marginBottom:'14px' }}>Quick Actions</h3>
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
        <Button variant="primary"   onClick={() => navigate('/map')}>🗺️ Find a Ride</Button>
        <Button variant="secondary" onClick={() => navigate('/dashboard/bookings')}>📋 My Bookings</Button>
        <Button variant="secondary" onClick={() => navigate('/dashboard/wallet')}>💰 My Wallet</Button>
      </div>
    </DashboardLayout>
  );
}
