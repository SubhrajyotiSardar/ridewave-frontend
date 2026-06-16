import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Button, FormGroup, Input, Card, CardBody, Divider } from '../../components/ui';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', businessName:'', businessAddress:'', licenseNumber:'' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, role });
      login(data.token, data.user);
      toast.success('Account created successfully!');
      if (data.user.role === 'renter') navigate('/renter');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0F172A,#1E293B)', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'460px' }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <h1 style={{ color:'#fff', fontSize:'28px' }}>Ride<span style={{ color:'var(--accent)' }}>Wave</span></h1>
          <p style={{ color:'#94A3B8', marginTop:'6px' }}>Create your account</p>
        </div>

        <Card>
          <CardBody style={{ padding:'32px' }}>
            {/* Role selector */}
            <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--muted)', marginBottom:'10px' }}>I am a:</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'24px' }}>
              {[['user','🚴','Rider','Find & book vehicles'],['renter','🏪','Renter','List my vehicles']].map(([r,icon,label,sub])=>(
                <div key={r} onClick={() => setRole(r)}
                  style={{ border:`2px solid ${role===r?'var(--accent)':'var(--border)'}`, borderRadius:'10px', padding:'14px', textAlign:'center', cursor:'pointer', background: role===r?'rgba(16,185,129,.06)':'var(--surface)', transition:'.2s' }}>
                  <div style={{ fontSize:'28px', marginBottom:'6px' }}>{icon}</div>
                  <div style={{ fontWeight:'600', fontSize:'14px', color: role===r?'var(--accent2)':'var(--text)' }}>{label}</div>
                  <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px' }}>{sub}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleRegister}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <FormGroup label="Full Name *">
                  <Input placeholder="Your name" value={form.name} onChange={set('name')} />
                </FormGroup>
                <FormGroup label="Phone *">
                  <Input placeholder="9XXXXXXXXX" value={form.phone} onChange={set('phone')} />
                </FormGroup>
              </div>
              <FormGroup label="Email *">
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </FormGroup>
              <FormGroup label="Password *">
                <Input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
              </FormGroup>

              {role === 'renter' && (
                <>
                  <Divider label="Business Details" />
                  <FormGroup label="Business Name">
                    <Input placeholder="Your rental business name" value={form.businessName} onChange={set('businessName')} />
                  </FormGroup>
                  <FormGroup label="Business Address">
                    <Input placeholder="City, State" value={form.businessAddress} onChange={set('businessAddress')} />
                  </FormGroup>
                  <FormGroup label="License Number">
                    <Input placeholder="WB-XXXX" value={form.licenseNumber} onChange={set('licenseNumber')} />
                  </FormGroup>
                </>
              )}

              <Button type="submit" variant="primary" full loading={loading} style={{ marginTop:'8px' }}>
                Create Account →
              </Button>
            </form>

            <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'var(--muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'var(--accent)', fontWeight:'500' }}>Sign In</Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
