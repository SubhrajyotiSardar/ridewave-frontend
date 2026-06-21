import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import VehicleCard from '../../components/map/VehicleCard';
import BookModal from '../../components/map/BookModal';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { Modal, Button, Badge, Select, FormGroup } from '../../components/ui';

const typeEmoji = { bike:'🚲', scooter:'🛵', electric_scooter:'⚡' };

export default function VehiclesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const load = async () => {
    const { data } = await api.get('/vehicles' + (typeFilter ? `?type=${typeFilter}` : ''));
    setVehicles(data.vehicles || []);
  };

  useEffect(() => { load(); }, [typeFilter]);

  const handleBooked = (booking, amount) => {
    setPendingBooking({ id: booking._id, amount, name: selectedVehicle?.name });
    setPayOpen(true);
  };

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <h2 style={{ fontSize:'22px' }}>All Vehicles</h2>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ padding:'8px 14px', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'14px', background:'var(--surface)', outline:'none' }}>
            <option value="">All Types</option>
            <option value="bike">🚲 Bikes</option>
            <option value="scooter">🛵 Scooters</option>
            <option value="electric_scooter">⚡ Electric Scooters</option>
          </select>
          <span style={{ fontSize:'14px', color:'var(--muted)' }}>{vehicles.length} found</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px' }}>
        {vehicles.map(v => (
          <VehicleCard key={v._id} vehicle={v} onClick={() => { setSelectedVehicle(v); setDetailOpen(true); }} />
        ))}
      </div>

      {vehicles.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>🔍</div>
          <p>No vehicles found. Try a different filter.</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selectedVehicle?.name || ''}>
        {selectedVehicle && (
          <>
            {selectedVehicle.images?.[0] ? (
              <img src={selectedVehicle.images[0]} alt={selectedVehicle.name} style={{ width:'100%', height:'220px', objectFit:'cover', borderRadius:'10px', marginBottom:'16px' }} />
            ) : (
              <div style={{ background:'linear-gradient(135deg,#0F172A,#1E3A5F)', borderRadius:'10px', padding:'30px', textAlign:'center', fontSize:'80px', marginBottom:'16px' }}>
                {typeEmoji[selectedVehicle.type] || '🚲'}
              </div>
            )}
            {[['Brand',selectedVehicle.brand],['Model',selectedVehicle.model],['Type',selectedVehicle.type?.replace(/_/g,' ')],['Condition',selectedVehicle.condition],['Location',`📍 ${selectedVehicle.locationName}`],['Price/hr',`₹${selectedVehicle.pricePerHour}`],['Price/day',`₹${selectedVehicle.pricePerDay}`],['Renter',selectedVehicle.renter?.businessName||selectedVehicle.renter?.name||'—']].map(([l,v])=>(
              <div key={l} style={{ display:'flex', gap:'8px', marginBottom:'6px', fontSize:'14px', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--muted)', minWidth:'110px' }}>{l}</span><strong>{v}</strong>
              </div>
            ))}
            <div style={{ display:'flex', gap:'8px', padding:'6px 0', borderBottom:'1px solid var(--border)', marginBottom:'6px' }}>
              <span style={{ color:'var(--muted)', minWidth:'110px', fontSize:'14px' }}>Status</span>
              <Badge status={selectedVehicle.status} />
            </div>
            {selectedVehicle.features?.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', margin:'12px 0' }}>
                {selectedVehicle.features.map(f=><span key={f} style={{ background:'var(--light)', color:'var(--muted)', fontSize:'12px', padding:'4px 10px', borderRadius:'999px' }}>✓ {f}</span>)}
              </div>
            )}
            <div style={{ marginTop:'20px' }}>
              {user?.role === 'user' && selectedVehicle.status === 'available' ? (
                <Button variant="primary" full onClick={() => { setDetailOpen(false); setBookOpen(true); }}>🚲 Book Now</Button>
              ) : !user ? (
                <Button variant="dark" full onClick={() => navigate('/login')}>Sign in to Book</Button>
              ) : (
                <Button variant="secondary" full disabled>Not Available</Button>
              )}
            </div>
          </>
        )}
      </Modal>

      <BookModal open={bookOpen} onClose={() => setBookOpen(false)} vehicle={selectedVehicle} onBooked={handleBooked} />
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)}
        bookingId={pendingBooking?.id} amount={pendingBooking?.amount}
        vehicleName={pendingBooking?.name} onSuccess={() => { setPayOpen(false); load(); }} />
    </div>
  );
}
