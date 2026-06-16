import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { Table, Badge, Button, EmptyState, PageHeader } from '../../components/ui';

const useMenu = (handleLogout) => [
  { section:'My Account', items:[
    { icon:'📊', label:'Overview',    path:'/dashboard' },
    { icon:'📋', label:'My Bookings', path:'/dashboard/bookings' },
    { icon:'💰', label:'Wallet',       path:'/dashboard/wallet' },
    { icon:'📄', label:'Transactions', path:'/dashboard/transactions' },
    { icon:'🗺️', label:'Find a Ride', path:'/map' },
    { icon:'👤', label:'Profile',      path:'/dashboard/profile' },
  ]},
  { section:'Account', items:[{ icon:'🚪', label:'Logout', path:'/', action: handleLogout }]}
];

export default function UserBookings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const handleLogout = () => { logout(); navigate('/login'); };
  const menu = useMenu(handleLogout);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/bookings/my-bookings'); setBookings(data.bookings || []); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await api.patch(`/bookings/${id}/cancel`, { reason:'User cancelled' }); toast.success('Cancelled'); load(); }
    catch { toast.error('Could not cancel'); }
  };

  const endRide = async (id) => {
    try {
      const { data } = await api.patch(`/bookings/${id}/complete`);
      toast.success(`Ride ended! ₹${data.amount}`);
      updateUser({ totalRides:(user?.totalRides||0)+1 }); load();
    } catch { toast.error('Could not end ride'); }
  };

  const refund = async (id) => {
    if (!window.confirm('Refund to wallet?')) return;
    try {
      const { data } = await api.post(`/payments/refund/${id}`);
      toast.success(data.message); updateUser({ walletBalance: data.walletBalance }); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Refund failed'); }
  };

  const rows = bookings.map(b => [
    <div><div style={{fontWeight:'600'}}>{b.vehicle?.name||'—'}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{b.vehicle?.brand}</div></div>,
    new Date(b.startTime).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
    b.rentalType,
    <strong>₹{b.totalAmount}</strong>,
    <Badge status={b.paymentStatus} />,
    <Badge status={b.status} />,
    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
      {b.paymentStatus==='pending' && <Button variant="warn" size="sm" onClick={()=>{setPendingBooking({id:b._id,amount:b.totalAmount,name:b.vehicle?.name});setPayOpen(true);}}>💳 Pay</Button>}
      {(b.status==='pending'||b.status==='confirmed')&&b.paymentStatus==='pending' && <Button variant="danger" size="sm" onClick={()=>cancel(b._id)}>Cancel</Button>}
      {b.status==='active' && <Button variant="primary" size="sm" onClick={()=>endRide(b._id)}>End Ride</Button>}
      {b.status==='cancelled'&&b.paymentStatus==='paid' && <Button variant="info" size="sm" onClick={()=>refund(b._id)}>↩ Refund</Button>}
    </div>
  ]);

  return (
    <DashboardLayout menuItems={menu}>
      <PageHeader title="My Bookings" subtitle={`${bookings.length} total`} action={<Button variant="primary" onClick={()=>navigate('/map')}>+ New Booking</Button>} />
      {loading ? <div style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>Loading...</div>
        : bookings.length===0 ? <EmptyState icon="📋" title="No bookings yet" subtitle="Find a vehicle and book your first ride" action={<Button variant="primary" onClick={()=>navigate('/vehicles')}>Browse Vehicles</Button>} />
        : <Table headers={['Vehicle','Date','Type','Amount','Payment','Status','Actions']} rows={rows} />}
      <PaymentModal open={payOpen} onClose={()=>setPayOpen(false)} bookingId={pendingBooking?.id} amount={pendingBooking?.amount} vehicleName={pendingBooking?.name} onSuccess={()=>{setPayOpen(false);load();}} />
    </DashboardLayout>
  );
}
