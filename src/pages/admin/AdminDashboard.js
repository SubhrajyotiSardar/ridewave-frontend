import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatCard, Alert, Button, PageHeader } from '../../components/ui';

export const adminMenu = (handleLogout) => [
  { section:'Admin Panel', items:[
    { icon:'📊', label:'Dashboard',  path:'/admin' },
    { icon:'👥', label:'Users',      path:'/admin/users' },
    { icon:'🏪', label:'Renters',    path:'/admin/renters' },
    { icon:'🚲', label:'Vehicles',   path:'/admin/vehicles' },
    { icon:'📋', label:'Bookings',   path:'/admin/bookings' },
    { icon:'💳', label:'Payments',   path:'/admin/payments' },
  ]},
  { section:'Account', items:[{ icon:'🚪', label:'Logout', path:'/', action: handleLogout }]}
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)).catch(()=>{}); }, []);

  return (
    <DashboardLayout menuItems={adminMenu(handleLogout)}>
      <PageHeader title="Admin Dashboard" subtitle="Full platform control & oversight" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'20px' }}>
        <StatCard icon="👤" value={stats.totalUsers||0}     label="Total Users"     bg="#D1FAE5" />
        <StatCard icon="🏪" value={stats.totalRenters||0}   label="Renters"         bg="#DBEAFE" />
        <StatCard icon="🚲" value={stats.totalVehicles||0}  label="Active Vehicles" bg="#FEF3C7" />
        <StatCard icon="💰" value={`₹${stats.totalRevenue||0}`} label="Revenue"     bg="#EDE9FE" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px' }}>
        <StatCard icon="📋" value={stats.totalBookings||0} label="Total Bookings" bg="#FEE2E2" />
        <StatCard icon="🏍️" value={stats.activeRides||0}  label="Active Rides"   bg="#D1FAE5" />
      </div>
      {(stats.pendingVehicles > 0 || stats.pendingRenters > 0) && (
        <Alert type="warn">
          ⚠️ <strong>Pending Approvals:</strong>
          {stats.pendingVehicles > 0 && <Button variant="warn" size="sm" onClick={()=>navigate('/admin/vehicles')} style={{marginLeft:'12px'}}>{stats.pendingVehicles} Vehicle(s)</Button>}
          {stats.pendingRenters > 0 && <Button variant="warn" size="sm" onClick={()=>navigate('/admin/renters')} style={{marginLeft:'8px'}}>{stats.pendingRenters} Renter(s)</Button>}
        </Alert>
      )}
    </DashboardLayout>
  );
}
