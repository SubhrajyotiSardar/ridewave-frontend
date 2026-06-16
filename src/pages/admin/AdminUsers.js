import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, Button, PageHeader } from '../../components/ui';
import { adminMenu } from './AdminDashboard';

export default function AdminUsers() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  const load = () => api.get('/admin/users?role=user').then(r => setUsers(r.data.users||[]));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try { const { data } = await api.patch(`/admin/users/${id}/toggle-status`); toast.success(data.message); load(); }
    catch { toast.error('Action failed'); }
  };

  const rows = users.map(u => [
    <div><div style={{fontWeight:'600'}}>{u.name}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{u.email}</div></div>,
    u.phone,
    u.totalRides,
    `₹${u.totalSpent}`,
    `₹${u.walletBalance||0}`,
    <Badge status={u.isActive?'active':'suspended'} />,
    <Button variant={u.isActive?'danger':'primary'} size="sm" onClick={()=>toggle(u._id)}>{u.isActive?'Suspend':'Activate'}</Button>
  ]);

  return (
    <DashboardLayout menuItems={adminMenu(handleLogout)}>
      <PageHeader title="Users" subtitle={`${users.length} registered riders`} />
      <Table headers={['Name','Phone','Rides','Spent','Wallet','Status','Action']} rows={rows} empty="No users found" />
    </DashboardLayout>
  );
}
