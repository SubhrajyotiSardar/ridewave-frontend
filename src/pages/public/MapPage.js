import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import VehicleCard from '../../components/map/VehicleCard';
import BookModal from '../../components/map/BookModal';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { Modal, Button, Badge } from '../../components/ui';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'), iconUrl: require('leaflet/dist/images/marker-icon.png'), shadowUrl: require('leaflet/dist/images/marker-shadow.png') });

const typeEmoji = { bike:'🚲', scooter:'🛵', electric_scooter:'⚡' };
const typeColor = { bike:'#10B981', scooter:'#3B82F6', electric_scooter:'#8B5CF6' };

function makeIcon(type, status) {
  const color = status === 'available' ? (typeColor[type] || '#10B981') : '#94A3B8';
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.25)">${typeEmoji[type] || '🚲'}</div>`,
    iconSize: [38, 38], iconAnchor: [19, 19]
  });
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function MapPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Load initial vehicles
    api.get('/vehicles').then(r => setVehicles(r.data.vehicles || [])).catch(() => {});

    // Socket for real-time updates
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('get_all_vehicles');
    socket.on('all_vehicles', data => setVehicles(data));
    socket.on('vehicle_location_updated', update => {
      setVehicles(prev => prev.map(v => v._id === update.vehicleId ? { ...v, location: { ...v.location, coordinates: [update.lng, update.lat] }, status: update.status } : v));
    });
    return () => socket.disconnect();
  }, []);

  const filtered = vehicles.filter(v => filter === 'all' || v.type === filter);

  const handleBooked = (booking, amount) => {
    setPendingBooking({ id: booking._id, amount, name: selectedVehicle?.name });
    setPayOpen(true);
  };

  const filterBtns = [
    { key:'all', label:'All' },
    { key:'bike', label:'🚲 Bikes' },
    { key:'scooter', label:'🛵 Scooters' },
    { key:'electric_scooter', label:'⚡ Electric' },
  ];

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'12px' }}>
        <h2 style={{ fontSize:'22px' }}>🗺️ Live Vehicle Map</h2>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {filterBtns.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:'7px 16px', borderRadius:'999px', border:`1.5px solid ${filter===f.key?'var(--accent)':'var(--border)'}`, background: filter===f.key?'var(--accent)':'var(--surface)', color: filter===f.key?'#fff':'var(--text)', fontSize:'13px', fontWeight:'500', cursor:'pointer', transition:'.2s' }}>
              {f.label}
            </button>
          ))}
          <span style={{ fontSize:'13px', color:'var(--muted)', alignSelf:'center', marginLeft:'8px' }}>{filtered.length} vehicles</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ borderRadius:'var(--radius)', overflow:'hidden', boxShadow:'var(--shadow)', marginBottom:'24px' }}>
        <MapContainer center={[22.5726, 88.3639]} zoom={12} style={{ height:'520px', width:'100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
          {filtered.map(v => {
            if (!v.location?.coordinates) return null;
            const [lng, lat] = v.location.coordinates;
            return (
              <Marker key={v._id} position={[lat, lng]} icon={makeIcon(v.type, v.status)}>
                <Popup>
                  <div style={{ fontFamily:'Inter,sans-serif', minWidth:'160px' }}>
                    <h4 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'15px', marginBottom:'4px' }}>{v.name}</h4>
                    <p style={{ fontSize:'12px', color:'#64748B', marginBottom:'6px' }}>{v.model} · {v.brand}</p>
                    <p style={{ fontSize:'16px', fontWeight:'700', color:'#10B981', marginBottom:'2px' }}>₹{v.pricePerHour}/hr</p>
                    <p style={{ fontSize:'12px', color:'#64748B', marginBottom:'8px' }}>📍 {v.locationName}</p>
                    <button onClick={() => { setSelectedVehicle(v); setDetailOpen(true); }}
                      style={{ width:'100%', background:'#10B981', color:'#fff', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
                      View & Book
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Vehicle grid below map */}
      <h3 style={{ fontSize:'18px', marginBottom:'16px' }}>Vehicles on Map</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'20px' }}>
        {filtered.map(v => (
          <VehicleCard key={v._id} vehicle={v} onClick={() => { setSelectedVehicle(v); setDetailOpen(true); }} />
        ))}
      </div>

      {/* Vehicle Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selectedVehicle?.name || 'Vehicle'}>
        {selectedVehicle && (
          <>
            <div style={{ background:'linear-gradient(135deg,#0F172A,#1E3A5F)', borderRadius:'10px', padding:'30px', textAlign:'center', fontSize:'80px', marginBottom:'16px' }}>
              {typeEmoji[selectedVehicle.type] || '🚲'}
            </div>
            {[['Brand / Model',`${selectedVehicle.brand} ${selectedVehicle.model}`],['Type',selectedVehicle.type?.replace(/_/g,' ')],['Condition',selectedVehicle.condition],['Location',`📍 ${selectedVehicle.locationName}`],['Price/hr',`₹${selectedVehicle.pricePerHour}`],['Price/day',`₹${selectedVehicle.pricePerDay}`]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', gap:'8px', marginBottom:'8px', fontSize:'14px', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--muted)', minWidth:'110px' }}>{l}</span>
                <strong>{v}</strong>
              </div>
            ))}
            <div style={{ display:'flex', gap:'8px', marginBottom:'8px', fontSize:'14px', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ color:'var(--muted)', minWidth:'110px' }}>Status</span>
              <Badge status={selectedVehicle.status} />
            </div>
            {selectedVehicle.features?.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', margin:'12px 0' }}>
                {selectedVehicle.features.map(f => (
                  <span key={f} style={{ background:'var(--light)', color:'var(--muted)', fontSize:'12px', padding:'4px 10px', borderRadius:'999px' }}>✓ {f}</span>
                ))}
              </div>
            )}
            <div style={{ marginTop:'20px' }}>
              {user?.role === 'user' && selectedVehicle.status === 'available' ? (
                <Button variant="primary" full onClick={() => { setDetailOpen(false); setBookOpen(true); }}>🚲 Book Now</Button>
              ) : !user ? (
                <Button variant="dark" full onClick={() => window.location.href='/login'}>Sign in to Book</Button>
              ) : (
                <Button variant="secondary" full disabled>Not Available</Button>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* Book Modal */}
      <BookModal open={bookOpen} onClose={() => setBookOpen(false)} vehicle={selectedVehicle} onBooked={handleBooked} />

      {/* Payment Modal */}
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)}
        bookingId={pendingBooking?.id} amount={pendingBooking?.amount}
        vehicleName={pendingBooking?.name} onSuccess={() => setPayOpen(false)} />
    </div>
  );
}
