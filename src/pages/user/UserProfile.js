import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button, Card, CardBody, FormGroup, Input, PageHeader, Badge } from '../../components/ui';

export default function UserProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
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

  const save = async () => {
    setLoading(true);
    try {
      const { data } = await api.patch('/auth/me', { name, phone });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout menuItems={menu}>
      <PageHeader title="My Profile" />
      <div style={{ maxWidth:'480px' }}>
        <Card>
          <CardBody>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px', paddingBottom:'20px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--info))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', color:'#fff', fontFamily:'Space Grotesk,sans-serif', fontWeight:'700' }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:'600', fontSize:'16px' }}>{user?.name}</div>
                <div style={{ fontSize:'13px', color:'var(--muted)' }}>{user?.email}</div>
                <div style={{ marginTop:'4px' }}><Badge status={user?.role} /></div>
              </div>
            </div>
            <FormGroup label="Full Name"><Input value={name} onChange={e=>setName(e.target.value)} /></FormGroup>
            <FormGroup label="Email"><Input value={user?.email || ''} disabled /></FormGroup>
            <FormGroup label="Phone"><Input value={phone} onChange={e=>setPhone(e.target.value)} /></FormGroup>
            <FormGroup label="Role"><Input value={user?.role || ''} disabled /></FormGroup>
            <Button variant="primary" full loading={loading} onClick={save}>Save Changes</Button>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
