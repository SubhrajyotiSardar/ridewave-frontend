import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, EmptyState, PageHeader } from '../../components/ui';

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

export default function RenterBookings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    api.get('/bookings/my-bookings').then(r => setBookings(r.data.bookings || []));
  }, []);

  const rows = bookings.map(b => [
    b.vehicle?.name || '—',
    <div><div style={{fontWeight:'500'}}>{b.user?.name||'—'}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{b.user?.phone}</div></div>,
    new Date(b.startTime).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
    b.rentalType,
    <strong>₹{b.totalAmount}</strong>,
    <Badge status={b.paymentStatus} />,
    <Badge status={b.status} />
  ]);

  return (
    <DashboardLayout menuItems={renterMenu(handleLogout)}>
      <PageHeader title="Customer Bookings" subtitle={`${bookings.length} total`} />
      {bookings.length === 0
        ? <EmptyState icon="📋" title="No bookings yet" subtitle="Bookings will appear here once customers book your vehicles" />
        : <Table headers={['Vehicle','Customer','Date','Type','Amount','Payment','Status']} rows={rows} />}
    </DashboardLayout>
  );
}
