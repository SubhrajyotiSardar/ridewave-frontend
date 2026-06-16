import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardBody, EmptyState, PageHeader, StatCard } from '../../components/ui';

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

export default function RenterEarnings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    api.get('/payments/transactions').then(r => {
      setEarnings((r.data.transactions||[]).filter(t=>t.type==='earning'));
    });
  }, []);

  const total = earnings.reduce((s,t)=>s+t.amount,0);
  const thisMonth = earnings.filter(t=>new Date(t.createdAt).getMonth()===new Date().getMonth()).reduce((s,t)=>s+t.amount,0);

  return (
    <DashboardLayout menuItems={renterMenu(handleLogout)}>
      <PageHeader title="Earnings" subtitle="Revenue from all completed bookings" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
        <StatCard icon="💰" value={`₹${total}`}     label="Total Earned"    bg="#D1FAE5" />
        <StatCard icon="📅" value={`₹${thisMonth}`} label="This Month"      bg="#DBEAFE" />
        <StatCard icon="📋" value={earnings.length}  label="Paid Bookings"   bg="#EDE9FE" />
      </div>
      <Card>
        <CardBody style={{ padding:'8px 16px' }}>
          {earnings.length === 0 ? (
            <EmptyState icon="💰" title="No earnings yet" subtitle="Earnings appear here when customers pay for your vehicles" />
          ) : earnings.map((t,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 0', borderBottom: i<earnings.length-1?'1px solid var(--border)':'none' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#D1FAE5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>💰</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:'500', fontSize:'14px' }}>{t.description}</div>
                <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px' }}>
                  {new Date(t.createdAt).toLocaleString('en-IN')} · {t.paymentMethod?.toUpperCase()} · Ref: {t.gatewayRef}
                </div>
              </div>
              <div style={{ fontSize:'18px', fontWeight:'700', color:'var(--accent)' }}>+₹{t.amount}</div>
            </div>
          ))}
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}
