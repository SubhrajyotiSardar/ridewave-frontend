import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, Button, PageHeader } from '../../components/ui';
import { adminMenu } from './AdminDashboard';

export default function AdminRenters() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [renters, setRenters] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  const load = () => api.get('/admin/users?role=renter').then(r => setRenters(r.data.users||[]));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try { await api.patch(`/admin/renters/${id}/approve`); toast.success('Renter approved!'); load(); }
    catch { toast.error('Action failed'); }
  };

  const rows = renters.map(u => [
    <div><div style={{fontWeight:'600'}}>{u.name}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{u.email}</div></div>,
    u.businessName||'—',
    u.phone,
    u.licenseNumber||'—',
    u.renterApproved ? <Badge status="approved" label="Approved" /> : <Badge status="pending" label="Pending" />,
    !u.renterApproved
      ? <Button variant="primary" size="sm" onClick={()=>approve(u._id)}>✓ Approve</Button>
      : <span style={{fontSize:'13px',color:'var(--muted)'}}>Done</span>
  ]);

  return (
    <DashboardLayout menuItems={adminMenu(handleLogout)}>
      <PageHeader title="Renters" subtitle={`${renters.length} registered renters`} />
      <Table headers={['Name','Business','Phone','License','Status','Action']} rows={rows} empty="No renters found" />
    </DashboardLayout>
  );
}
