import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Modal, Button, FormGroup, Input, Select } from '../ui';

export default function BookModal({ open, onClose, vehicle, onBooked }) {
  const [type, setType] = useState('hourly');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (!open) return;
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 3600000);
    setStart(now.toISOString().slice(0, 16));
    setEnd(tomorrow.toISOString().slice(0, 16));
  }, [open]);

  useEffect(() => {
    if (!vehicle || !start || !end) return;
    const s = new Date(start), e = new Date(end);
    if (isNaN(s) || isNaN(e) || e <= s) { setTotal(0); setDuration(''); return; }
    const hrs = Math.ceil((e - s) / 3600000);
    const days = Math.ceil(hrs / 24);
    if (type === 'daily') { setTotal(days * vehicle.pricePerDay); setDuration(`${days} day(s)`); }
    else { setTotal(hrs * vehicle.pricePerHour); setDuration(`${hrs} hour(s)`); }
  }, [start, end, type, vehicle]);

  const handleBook = async () => {
    if (!start || !end) return toast.error('Please set start and end time');
    setLoading(true);
    try {
      const { data } = await api.post('/bookings', { vehicleId: vehicle._id, startTime: start, plannedEndTime: end, rentalType: type, notes });
      toast.success('Booking created! Please complete payment.');
      onBooked && onBooked(data.booking, total);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  if (!vehicle) return null;

  return (
    <Modal open={open} onClose={onClose} title="Book Vehicle">
      {/* Vehicle summary */}
      <div style={{ background:'var(--light)', borderRadius:'10px', padding:'14px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ fontSize:'40px' }}>{vehicle.type === 'bike' ? '🚲' : vehicle.type === 'scooter' ? '🛵' : '⚡'}</div>
        <div>
          <div style={{ fontWeight:'600', fontSize:'16px', fontFamily:'Space Grotesk,sans-serif' }}>{vehicle.name}</div>
          <div style={{ fontSize:'13px', color:'var(--muted)' }}>{vehicle.model} · {vehicle.brand} · 📍 {vehicle.locationName}</div>
          <div style={{ fontSize:'13px', color:'var(--accent)', fontWeight:'600', marginTop:'2px' }}>₹{vehicle.pricePerHour}/hr · ₹{vehicle.pricePerDay}/day</div>
        </div>
      </div>

      <FormGroup label="Rental Type">
        <Select value={type} onChange={e => setType(e.target.value)}>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
        </Select>
      </FormGroup>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <FormGroup label="Start Time">
          <Input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        </FormGroup>
        <FormGroup label="End Time">
          <Input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
        </FormGroup>
      </div>

      <FormGroup label="Notes (optional)">
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requests..."
          rows={2} style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'14px', fontFamily:'Inter,sans-serif', resize:'vertical', outline:'none' }} />
      </FormGroup>

      {/* Price breakdown */}
      <div style={{ background:'var(--light)', borderRadius:'10px', padding:'16px', marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'6px' }}>
          <span style={{ color:'var(--muted)' }}>Duration</span>
          <span style={{ fontWeight:'500' }}>{duration || '—'}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'20px', fontWeight:'700', color:'var(--accent)', fontFamily:'Space Grotesk,sans-serif' }}>
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <Button variant="primary" full loading={loading} onClick={handleBook}>
        Confirm Booking → Proceed to Pay
      </Button>
    </Modal>
  );
}
