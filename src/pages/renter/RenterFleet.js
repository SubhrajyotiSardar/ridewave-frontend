import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Table, Badge, Button, EmptyState, PageHeader } from '../../components/ui';

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

export default function RenterFleet() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    api.get('/vehicles/renter/my-vehicles').then(r => setVehicles(r.data.vehicles || []));
  }, []);

  const rows = vehicles.map(v => [
    <div><div style={{fontWeight:'600'}}>{v.name}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{v.brand} · {v.model}</div></div>,
    v.type.replace(/_/g,' '),
    `📍 ${v.locationName || '—'}`,
    `₹${v.pricePerHour}/hr`,
    <Badge status={v.status} />,
    v.isApproved ? <Badge status="approved" /> : <span style={{background:'#FEF3C7',color:'#92400E',padding:'3px 10px',borderRadius:'999px',fontSize:'12px',fontWeight:'600'}}>Pending</span>
  ]);

  return (
    <DashboardLayout menuItems={renterMenu(handleLogout)}>
      <PageHeader title="My Fleet" subtitle={`${vehicles.length} vehicles`}
        action={<Button variant="primary" onClick={()=>navigate('/renter/add-vehicle')}>➕ Add Vehicle</Button>} />
      {vehicles.length === 0
        ? <EmptyState icon="🚲" title="No vehicles yet" subtitle="Add your first vehicle to start earning" action={<Button variant="primary" onClick={()=>navigate('/renter/add-vehicle')}>Add Vehicle</Button>} />
        : <Table headers={['Vehicle','Type','Location','Price','Status','Approved']} rows={rows} />}
    </DashboardLayout>
  );
}
