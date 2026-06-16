import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, Button, PageHeader } from '../../components/ui';
import { adminMenu } from './AdminDashboard';

export default function AdminVehicles() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  const load = () => api.get('/admin/vehicles').then(r => setVehicles(r.data.vehicles||[]));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try { await api.patch(`/vehicles/${id}/approve`); toast.success('Vehicle approved!'); load(); }
    catch { toast.error('Failed'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await api.delete(`/admin/vehicles/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const rows = vehicles.map(v => [
    <div><div style={{fontWeight:'600'}}>{v.name}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{v.brand} · {v.model}</div></div>,
    v.type.replace(/_/g,' '),
    v.renter?.businessName||v.renter?.name||'—',
    `₹${v.pricePerHour}/hr`,
    <Badge status={v.status} />,
    v.isApproved ? <Badge status="approved" label="Approved" /> : <Badge status="pending" label="Pending" />,
    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
      {!v.isApproved && <Button variant="primary" size="sm" onClick={()=>approve(v._id)}>✓ Approve</Button>}
      <Button variant="danger" size="sm" onClick={()=>del(v._id)}>Delete</Button>
    </div>
  ]);

  return (
    <DashboardLayout menuItems={adminMenu(handleLogout)}>
      <PageHeader title="All Vehicles" subtitle={`${vehicles.length} total · ${vehicles.filter(v=>!v.isApproved).length} pending`} />
      <Table headers={['Vehicle','Type','Renter','Price','Status','Approved','Actions']} rows={rows} empty="No vehicles" />
    </DashboardLayout>
  );
}
