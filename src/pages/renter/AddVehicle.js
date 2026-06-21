import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LocationSearch from '../../components/map/LocationSearch';
import ImageUpload from '../../components/map/ImageUpload';
import { Button, Card, CardBody, FormGroup, Input, Select, PageHeader } from '../../components/ui';

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

export default function AddVehicle() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', brand:'', model:'', type:'bike', registrationNumber:'',
    pricePerHour:'', pricePerDay:'', condition:'good',
    locationName:'', lat:'', lng:'', features:'', image:null
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImageChange = (dataUrl) => setForm(f => ({ ...f, image: dataUrl }));

  const handleLocationSelect = ({ name, lat, lng }) => {
    setForm(f => ({ ...f, locationName: name, lat, lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.registrationNumber) return toast.error('Please fill all required fields');
    if (!form.lat || !form.lng) return toast.error('Please search and select a pickup location');
    setLoading(true);
    try {
      const { image, ...rest } = form;
      await api.post('/vehicles', {
        ...rest,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        images: image ? [image] : []
      });
      toast.success('Vehicle submitted for admin approval!');
      navigate('/renter/fleet');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout menuItems={renterMenu(handleLogout)}>
      <PageHeader title="Add Vehicle to Fleet" subtitle="Submit a new vehicle for admin approval" />
      <Card style={{ maxWidth:'640px' }}>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <FormGroup label="Vehicle Name *"><Input placeholder="e.g. Honda Activa" value={form.name} onChange={set('name')} /></FormGroup>
              <FormGroup label="Brand *"><Input placeholder="Honda, Hero..." value={form.brand} onChange={set('brand')} /></FormGroup>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <FormGroup label="Model *"><Input placeholder="Activa 6G" value={form.model} onChange={set('model')} /></FormGroup>
              <FormGroup label="Type *">
                <Select value={form.type} onChange={set('type')}>
                  <option value="bike">🚲 Bike</option>
                  <option value="scooter">🛵 Scooter</option>
                  <option value="electric_scooter">⚡ Electric Scooter</option>
                </Select>
              </FormGroup>
            </div>
            <FormGroup label="Registration Number *"><Input placeholder="WB01A0001" value={form.registrationNumber} onChange={set('registrationNumber')} /></FormGroup>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <FormGroup label="Price / Hour (₹) *"><Input type="number" placeholder="60" value={form.pricePerHour} onChange={set('pricePerHour')} /></FormGroup>
              <FormGroup label="Price / Day (₹) *"><Input type="number" placeholder="400" value={form.pricePerDay} onChange={set('pricePerDay')} /></FormGroup>
            </div>
            <FormGroup label="Condition">
              <Select value={form.condition} onChange={set('condition')}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </Select>
            </FormGroup>

            <FormGroup label="Pickup Location *">
              <LocationSearch value={form.locationName} onSelect={handleLocationSelect} />
            </FormGroup>

            <FormGroup label="Vehicle Photo (optional)">
              <ImageUpload value={form.image} onChange={handleImageChange} />
            </FormGroup>

            <FormGroup label="Features (comma separated)"><Input placeholder="Helmet included, Insurance covered" value={form.features} onChange={set('features')} /></FormGroup>
            <Button type="submit" variant="primary" full loading={loading}>Submit for Approval</Button>
          </form>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
}
