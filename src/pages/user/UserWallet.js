import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { TopupModal } from '../../components/payment/PaymentModal';
import { Button, Card, CardBody, PageHeader } from '../../components/ui';

const txnMeta = { wallet_topup:['➕','#D1FAE5','credit'], booking_payment:['🛵','#FEE2E2','debit'], refund:['↩️','#DBEAFE','credit'], earning:['💰','#EDE9FE','credit'] };

export default function UserWallet() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState(null);
  const [topupOpen, setTopupOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };

  const menu = [
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

  const load = async () => {
    const { data } = await api.get('/payments/wallet');
    setWalletData(data);
    updateUser({ walletBalance: data.walletBalance });
  };

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout menuItems={menu}>
      <PageHeader title="My Wallet" action={<Button variant="primary" onClick={()=>setTopupOpen(true)}>➕ Add Money</Button>} />

      {/* Balance card */}
      <div style={{ background:'linear-gradient(135deg,#0F172A,#1a3a5c)', borderRadius:'16px', padding:'28px 32px', color:'#fff', marginBottom:'28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:'13px', color:'#94A3B8', marginBottom:'6px' }}>Available Balance</div>
          <div style={{ fontSize:'42px', fontWeight:'700', color:'var(--accent)', fontFamily:'Space Grotesk,sans-serif', letterSpacing:'-1px' }}>₹{walletData?.walletBalance ?? user?.walletBalance ?? 0}</div>
          <div style={{ fontSize:'13px', color:'#94A3B8', marginTop:'6px' }}>Total spent: ₹{walletData?.totalSpent || 0}</div>
        </div>
        <div style={{ fontSize:'60px', opacity:.8 }}>👛</div>
      </div>

      <div style={{ display:'flex', gap:'12px', marginBottom:'28px', flexWrap:'wrap' }}>
        <Button variant="primary" onClick={()=>setTopupOpen(true)}>➕ Add Money</Button>
        <Button variant="secondary" onClick={()=>navigate('/dashboard/transactions')}>📄 Full History</Button>
      </div>

      {/* Recent transactions */}
      <h3 style={{ fontSize:'16px', marginBottom:'16px' }}>Recent Transactions</h3>
      <Card>
        <CardBody style={{ padding:'8px 16px' }}>
          {walletData?.recentTxns?.length > 0 ? walletData.recentTxns.map((t,i) => {
            const [icon, bg, dir] = txnMeta[t.type] || ['💳','#F1F5F9','credit'];
            const isCredit = dir === 'credit';
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 0', borderBottom: i < walletData.recentTxns.length-1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:'500' }}>{t.description}</div>
                  <div style={{ fontSize:'12px', color:'var(--muted)' }}>{new Date(t.createdAt).toLocaleString('en-IN')} · {t.paymentMethod?.toUpperCase()}</div>
                </div>
                <div style={{ fontSize:'16px', fontWeight:'700', color: isCredit?'var(--accent)':'var(--danger)' }}>{isCredit?'+':'-'}₹{t.amount}</div>
              </div>
            );
          }) : (
            <div style={{ textAlign:'center', padding:'30px', color:'var(--muted)' }}>
              <div style={{ fontSize:'36px', marginBottom:'8px' }}>📄</div>
              <p>No transactions yet. Add money to get started!</p>
            </div>
          )}
        </CardBody>
      </Card>

      <TopupModal open={topupOpen} onClose={()=>setTopupOpen(false)} onSuccess={(bal)=>{ updateUser({walletBalance:bal}); load(); }} />
    </DashboardLayout>
  );
}
