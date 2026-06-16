import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatCard, Button, Alert, PageHeader } from '../../components/ui';

const renterMenu = (handleLogout) => [
  { section:'My Business', items:[
    { icon:'📊', label:'Overview',    path:'/renter' },
    { icon:'🚲', label:'My Fleet',    path:'/renter/fleet' },
    { icon:'📋', label:'Bookings',    path:'/renter/bookings' },
    { icon:'💰', label:'Earnings',    path:'/renter/earnings' },
    { icon:'➕', label:'Add Vehicle', path:'/renter/add-vehicle' },
    { icon:'👤', label:'Profile',     path:'/renter/profile' },
  ]},
  { section:'Account', items:[{ icon:'🚪', label:'Logout', path:'/', action: handleLogout }]}
];

export default function RenterDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ vehicles:0, bookings:0, completed:0, revenue:0 });
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    Promise.all([api.get('/vehicles/renter/my-vehicles'), api.get('/bookings/my-bookings')]).then(([vr, br]) => {
      const v = vr.data.vehicles || [], b = br.data.bookings || [];
      const revenue = b.filter(x=>x.paymentStatus==='paid').reduce((s,x)=>s+x.totalAmount,0);
      setStats({ vehicles:v.length, bookings:b.length, completed:b.filter(x=>x.status==='completed').length, revenue });
    }).catch(()=>{});
  }, []);

  return (
    <DashboardLayout menuItems={renterMenu(handleLogout)}>
      <PageHeader title="Fleet Overview" subtitle={`Welcome, ${user?.name}`} />
      {!user?.renterApproved && <Alert type="warn">⚠️ Your renter account is <strong>pending admin approval</strong>. Vehicles won't appear on the map until approved.</Alert>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
        <StatCard icon="🚲" value={stats.vehicles}        label="Fleet Size"       bg="#D1FAE5" />
        <StatCard icon="📋" value={stats.bookings}        label="Total Bookings"   bg="#DBEAFE" />
        <StatCard icon="✅" value={stats.completed}       label="Completed Rides"  bg="#FEF3C7" />
        <StatCard icon="💰" value={`₹${stats.revenue}`}  label="Total Revenue"    bg="#EDE9FE" />
      </div>
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
        <Button variant="primary"   onClick={()=>navigate('/renter/add-vehicle')}>➕ Add Vehicle</Button>
        <Button variant="secondary" onClick={()=>navigate('/renter/fleet')}>🚲 View Fleet</Button>
        <Button variant="secondary" onClick={()=>navigate('/renter/earnings')}>💰 Earnings</Button>
      </div>
    </DashboardLayout>
  );
}
