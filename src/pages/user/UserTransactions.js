import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { TopupModal } from '../../components/payment/PaymentModal';
import { Button, Card, CardBody, PageHeader, EmptyState } from '../../components/ui';

const txnMeta = { wallet_topup:['➕','#D1FAE5','credit','Wallet Top-up'], booking_payment:['🛵','#FEE2E2','debit','Booking Payment'], refund:['↩️','#DBEAFE','credit','Refund'], earning:['💰','#EDE9FE','credit','Earning'] };

export default function UserTransactions() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [txns, setTxns] = useState([]);
  const [balance, setBalance] = useState(0);
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

  useEffect(() => {
    api.get('/payments/transactions').then(({ data }) => {
      setTxns(data.transactions || []);
      setBalance(data.walletBalance || 0);
    });
  }, []);

  return (
    <DashboardLayout menuItems={menu}>
      <PageHeader title="Transaction History" subtitle={`${txns.length} records · Balance: ₹${balance}`}
        action={<Button variant="primary" onClick={()=>setTopupOpen(true)}>➕ Add Money</Button>} />
      <Card>
        <CardBody style={{ padding:'8px 16px' }}>
          {txns.length === 0 ? (
            <EmptyState icon="📄" title="No transactions yet" action={<Button variant="primary" onClick={()=>setTopupOpen(true)}>Add Money to Wallet</Button>} />
          ) : txns.map((t,i) => {
            const [icon, bg, dir, label] = txnMeta[t.type] || ['💳','#F1F5F9','credit','Transaction'];
            const isCredit = dir === 'credit';
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 0', borderBottom: i<txns.length-1?'1px solid var(--border)':'none' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:'500' }}>{label}</div>
                  <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px' }}>{t.description}</div>
                  <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>
                    {new Date(t.createdAt).toLocaleString('en-IN')} · via {t.paymentMethod?.toUpperCase()}
                    {t.gatewayRef && ` · Ref: ${t.gatewayRef}`}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'16px', fontWeight:'700', color: isCredit?'var(--accent)':'var(--danger)' }}>{isCredit?'+':'-'}₹{t.amount}</div>
                  <div style={{ fontSize:'11px', color:'var(--muted)' }}>Bal: ₹{t.balanceAfter}</div>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
      <TopupModal open={topupOpen} onClose={()=>setTopupOpen(false)} onSuccess={(bal)=>{ updateUser({walletBalance:bal}); }} />
    </DashboardLayout>
  );
}
