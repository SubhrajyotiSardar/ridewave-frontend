import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button, Card, CardBody, FormGroup, Input, PageHeader, Badge } from '../../components/ui';

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

export default function RenterProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const [form, setForm] = useState({ name:user?.name||'', phone:user?.phone||'', businessName:user?.businessName||'', businessAddress:user?.businessAddress||'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const save = async () => {
    setLoading(true);
    try {
      const { data } = await api.patch('/auth/me', form);
      updateUser(data.user); toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout menuItems={renterMenu(handleLogout)}>
      <PageHeader title="Business Profile" />
      <div style={{ maxWidth:'480px' }}>
        <Card><CardBody>
          <FormGroup label="Full Name"><Input value={form.name} onChange={set('name')} /></FormGroup>
          <FormGroup label="Email"><Input value={user?.email||''} disabled /></FormGroup>
          <FormGroup label="Phone"><Input value={form.phone} onChange={set('phone')} /></FormGroup>
          <FormGroup label="Business Name"><Input value={form.businessName} onChange={set('businessName')} /></FormGroup>
          <FormGroup label="Business Address"><Input value={form.businessAddress} onChange={set('businessAddress')} /></FormGroup>
          <FormGroup label="Account Status">
            <div style={{ padding:'10px 0' }}>{user?.renterApproved ? <Badge status="approved" label="Approved ✓" /> : <Badge status="pending" label="Pending Admin Approval" />}</div>
          </FormGroup>
          <Button variant="primary" full loading={loading} onClick={save}>Save Changes</Button>
        </CardBody></Card>
      </div>
    </DashboardLayout>
  );
}
