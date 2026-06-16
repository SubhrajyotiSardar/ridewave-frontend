import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Button, FormGroup, Input, Card, CardBody } from '../../components/ui';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'renter') navigate('/renter');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Is backend running?');
    } finally { setLoading(false); }
  };

  const demoLogin = (em, pw) => { setEmail(em); setPassword(pw); };

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0F172A,#1E293B)', padding:'20px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <h1 style={{ color:'#fff', fontSize:'28px', letterSpacing:'-0.5px' }}>Ride<span style={{ color:'var(--accent)' }}>Wave</span></h1>
          <p style={{ color:'#94A3B8', marginTop:'6px' }}>Sign in to your account</p>
        </div>

        <Card>
          <CardBody style={{ padding:'32px' }}>
            <form onSubmit={handleLogin}>
              <FormGroup label="Email">
                <Input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
              </FormGroup>
              <FormGroup label="Password">
                <Input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
              </FormGroup>
              <Button type="submit" variant="primary" full loading={loading} style={{ marginTop:'8px' }}>
                Sign In →
              </Button>
            </form>

            <div style={{ borderTop:'1px solid var(--border)', marginTop:'24px', paddingTop:'20px' }}>
              <p style={{ fontSize:'12px', color:'var(--muted)', marginBottom:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'.5px' }}>Quick Demo Login</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {[['🛡️ Admin','admin@bikerental.com','Admin@123'],['🚴 Rider','arjun@user.com','User@123'],['🏪 Renter','rohit@renter.com','Renter@123']].map(([label,em,pw])=>(
                  <button key={em} onClick={() => demoLogin(em, pw)}
                    style={{ padding:'8px 14px', border:'1px solid var(--border)', borderRadius:'8px', background:'var(--light)', fontSize:'13px', cursor:'pointer', textAlign:'left', transition:'.2s', color:'var(--text)' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                    <strong>{label}</strong> — {em}
                  </button>
                ))}
              </div>
            </div>

            <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'var(--muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'var(--accent)', fontWeight:'500' }}>Register</Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
