import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, PageHeader } from '../../components/ui';
import { adminMenu } from './AdminDashboard';

export default function AdminBookings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => { api.get('/admin/bookings').then(r => setBookings(r.data.bookings||[])); }, []);

  const rows = bookings.map(b => [
    <div><div style={{fontWeight:'500'}}>{b.user?.name||'—'}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{b.user?.email}</div></div>,
    b.vehicle?.name||'—',
    new Date(b.startTime).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
    b.rentalType,
    <strong>₹{b.totalAmount}</strong>,
    <Badge status={b.paymentStatus} />,
    <Badge status={b.status} />
  ]);

  return (
    <DashboardLayout menuItems={adminMenu(handleLogout)}>
      <PageHeader title="All Bookings" subtitle={`${bookings.length} total`} />
      <Table headers={['User','Vehicle','Date','Type','Amount','Payment','Status']} rows={rows} empty="No bookings" />
    </DashboardLayout>
  );
}
