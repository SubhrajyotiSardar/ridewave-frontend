import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, StatCard, PageHeader } from '../../components/ui';
import { adminMenu } from './AdminDashboard';

export default function AdminPayments() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [txns, setTxns] = useState([]);
  const [stats, setStats] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    api.get('/payments/admin/all').then(r => { setTxns(r.data.transactions||[]); setStats(r.data.stats||[]); });
  }, []);

  const getStat = (type) => stats.find(s=>s._id===type)?.total || 0;

  const rows = txns.map(t => [
    <div><div style={{fontWeight:'500'}}>{t.user?.name||'—'}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{t.user?.role}</div></div>,
    t.type.replace(/_/g,' '),
    <strong style={{color:t.type==='booking_payment'?'var(--accent)':'var(--text)'}}>₹{t.amount}</strong>,
    t.paymentMethod?.toUpperCase()||'—',
    <span style={{fontSize:'11px',color:'var(--muted)',fontFamily:'monospace'}}>{t.gatewayRef||'—'}</span>,
    new Date(t.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
    <Badge status={t.status} />
  ]);

  return (
    <DashboardLayout menuItems={adminMenu(handleLogout)}>
      <PageHeader title="Payment Overview" subtitle="All financial transactions on the platform" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'24px' }}>
        <StatCard icon="💳" value={`₹${getStat('booking_payment')}`} label="Total Collections" bg="#D1FAE5" />
        <StatCard icon="👛" value={`₹${getStat('wallet_topup')}`}    label="Wallet Top-ups"   bg="#DBEAFE" />
        <StatCard icon="↩️" value={`₹${getStat('refund')}`}          label="Refunds Issued"   bg="#FEE2E2" />
      </div>
      <Table headers={['User','Type','Amount','Method','Reference','Date','Status']} rows={rows} empty="No transactions" />
    </DashboardLayout>
  );
}
