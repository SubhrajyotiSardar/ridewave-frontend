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

            <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'var(--muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'var(--accent)', fontWeight:'500' }}>Register</Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
