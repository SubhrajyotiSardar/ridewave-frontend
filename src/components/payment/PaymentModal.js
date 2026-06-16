import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Modal, Button, FormGroup, Input, Select, Alert } from '../ui';
import { useAuth } from '../../context/AuthContext';

const methods = [
  { id:'wallet',     icon:'👛', label:'Wallet',      sub:'Use wallet balance' },
  { id:'upi',        icon:'📱', label:'UPI',         sub:'GPay, PhonePe, Paytm' },
  { id:'card',       icon:'💳', label:'Card',        sub:'Debit / Credit Card' },
  { id:'netbanking', icon:'🏦', label:'Net Banking', sub:'All major banks' },
];

const banks = ['SBI – State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Punjab National Bank','Bank of Baroda','Kotak Mahindra Bank','Canara Bank'];

// ── PAYMENT SUCCESS SCREEN ────────────────────────────────────────────────────
function SuccessScreen({ amount, method, ref, vehicleName, countdown, onGoTransactions, onClose }) {
  return (
    <div style={{ textAlign:'center', padding:'10px 0' }}>
      {/* Animated checkmark */}
      <div style={{ width:'90px', height:'90px', borderRadius:'50%', background:'linear-gradient(135deg,#10B981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 32px rgba(16,185,129,.35)', animation:'popIn .4s ease' }}>
        <span style={{ fontSize:'44px', lineHeight:1 }}>✓</span>
      </div>

      <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'26px', fontWeight:'700', color:'var(--text)', marginBottom:'6px' }}>
        Payment Successful!
      </h2>
      <p style={{ color:'var(--muted)', fontSize:'15px', marginBottom:'24px' }}>
        ₹{amount} paid for <strong>{vehicleName}</strong>
      </p>

      {/* Receipt card */}
      <div style={{ background:'linear-gradient(135deg,#0F172A,#1a3a5c)', borderRadius:'16px', padding:'20px 24px', marginBottom:'20px', textAlign:'left', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', paddingBottom:'14px', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
          <span style={{ color:'#94A3B8', fontSize:'13px' }}>RideWave Payment Receipt</span>
          <span style={{ background:'rgba(16,185,129,.2)', color:'#10B981', padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'600' }}>✓ Paid</span>
        </div>
        {[
          ['Amount Paid',  `₹${amount}`,                  '#10B981'],
          ['Vehicle',      vehicleName,                    '#fff'],
          ['Method',       method?.toUpperCase(),          '#fff'],
          ['Reference',    ref || ('RW' + Date.now()),     '#94A3B8'],
          ['Date',         new Date().toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }), '#94A3B8'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0' }}>
            <span style={{ color:'#94A3B8', fontSize:'13px' }}>{label}</span>
            <span style={{ color, fontSize:'14px', fontWeight:'500', fontFamily: label==='Reference'?'monospace':'inherit' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Countdown notice */}
      <p style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'16px' }}>
        Redirecting to transactions in <strong style={{ color:'var(--accent)' }}>{countdown}s</strong>...
      </p>

      {/* Action buttons */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <Button variant="secondary" full onClick={onClose}>
          Stay Here
        </Button>
        <Button variant="primary" full onClick={onGoTransactions}>
          📄 View Transactions
        </Button>
      </div>
    </div>
  );
}

// ── TOPUP SUCCESS SCREEN ──────────────────────────────────────────────────────
function TopupSuccessScreen({ amount, method, ref, newBalance, countdown, onGoWallet, onClose }) {
  return (
    <div style={{ textAlign:'center', padding:'10px 0' }}>
      <div style={{ width:'90px', height:'90px', borderRadius:'50%', background:'linear-gradient(135deg,#3B82F6,#1D4ED8)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 32px rgba(59,130,246,.35)' }}>
        <span style={{ fontSize:'44px', lineHeight:1 }}>👛</span>
      </div>

      <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'26px', fontWeight:'700', marginBottom:'6px' }}>
        Wallet Topped Up!
      </h2>
      <p style={{ color:'var(--muted)', fontSize:'15px', marginBottom:'24px' }}>
        ₹{amount} has been added to your wallet
      </p>

      <div style={{ background:'linear-gradient(135deg,#0F172A,#1a3a5c)', borderRadius:'16px', padding:'20px 24px', marginBottom:'20px', textAlign:'left', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', paddingBottom:'14px', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
          <span style={{ color:'#94A3B8', fontSize:'13px' }}>RideWave Wallet Receipt</span>
          <span style={{ background:'rgba(59,130,246,.2)', color:'#60A5FA', padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'600' }}>✓ Success</span>
        </div>
        {[
          ['Amount Added',     `₹${amount}`,                          '#60A5FA'],
          ['New Balance',      `₹${newBalance}`,                      '#10B981'],
          ['Method',           method?.toUpperCase(),                  '#fff'],
          ['Reference',        ref || ('RW' + Date.now()),             '#94A3B8'],
          ['Date',             new Date().toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }), '#94A3B8'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0' }}>
            <span style={{ color:'#94A3B8', fontSize:'13px' }}>{label}</span>
            <span style={{ color, fontSize:'14px', fontWeight:'500', fontFamily: label==='Reference'?'monospace':'inherit' }}>{value}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'16px' }}>
        Redirecting to wallet in <strong style={{ color:'var(--accent)' }}>{countdown}s</strong>...
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        <Button variant="secondary" full onClick={onClose}>Stay Here</Button>
        <Button variant="primary"   full onClick={onGoWallet}>💰 View Wallet</Button>
      </div>
    </div>
  );
}

// ── PAYMENT MODAL ─────────────────────────────────────────────────────────────
export function PaymentModal({ open, onClose, bookingId, amount, vehicleName, onSuccess }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState(banks[0]);
  const [success, setSuccess] = useState(null);
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect countdown after success
  useEffect(() => {
    if (!success) return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          goToTransactions();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [success]);

  const formatCard = v => v.replace(/\D/g,'').slice(0,16).match(/.{1,4}/g)?.join(' ') || '';

  const handlePay = async () => {
    setLoading(true);
    const body = { paymentMethod: method };
    if (method === 'upi') body.upiId = upiId;
    if (method === 'card') { body.cardNumber = cardNum.replace(/\s/g,''); body.cardExpiry = expiry; body.cardCvv = cvv; }
    if (method === 'netbanking') body.bank = bank;
    try {
      await new Promise(r => setTimeout(r, 1500));
      const { data } = await api.post(`/payments/pay-booking/${bookingId}`, body);
      if (data.walletBalance !== undefined) updateUser({ walletBalance: data.walletBalance });
      setSuccess({ amount, method, ref: data.gatewayRef });
      toast.success('🎉 Payment successful!');
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  const reset = () => {
    setSuccess(null); setMethod('wallet');
    setUpiId(''); setCardNum(''); setExpiry(''); setCvv('');
  };

  const handleClose = () => { reset(); onClose(); };

  const goToTransactions = () => {
    reset(); onClose();
    navigate('/dashboard/transactions');
  };

  return (
    <Modal open={open} onClose={handleClose} title={success ? '' : 'Complete Payment'} maxWidth="480px">
      {success ? (
        <SuccessScreen
          amount={success.amount} method={success.method}
          ref={success.ref} vehicleName={vehicleName}
          countdown={countdown}
          onGoTransactions={goToTransactions}
          onClose={handleClose}
        />
      ) : (
        <>
          {/* Amount banner */}
          <div style={{ background:'linear-gradient(135deg,#0F172A,#1a3a5c)', borderRadius:'12px', padding:'16px 20px', color:'#fff', marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:'12px', color:'#94A3B8', marginBottom:'4px' }}>Amount to Pay</div>
              <div style={{ fontSize:'28px', fontWeight:'700', color:'var(--accent)', fontFamily:'Space Grotesk,sans-serif' }}>₹{amount}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'12px', color:'#94A3B8' }}>For</div>
              <div style={{ fontWeight:'600' }}>{vehicleName}</div>
            </div>
          </div>

          {/* Wallet low warning */}
          {method === 'wallet' && (user?.walletBalance || 0) < amount && (
            <Alert type="warn">⚠️ Wallet balance (₹{user?.walletBalance || 0}) is less than ₹{amount}. Choose another method or top up first.</Alert>
          )}

          {/* Method selector */}
          <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--muted)', marginBottom:'12px' }}>Select Payment Method</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px' }}>
            {methods.map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)}
                style={{ border:`2px solid ${method===m.id?'var(--accent)':'var(--border)'}`, borderRadius:'10px', padding:'14px', textAlign:'center', cursor:'pointer', background: method===m.id?'rgba(16,185,129,.06)':'var(--surface)', transition:'.2s' }}>
                <div style={{ fontSize:'26px', marginBottom:'4px' }}>{m.icon}</div>
                <div style={{ fontSize:'13px', fontWeight:'600' }}>{m.label}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)' }}>{m.sub}</div>
                {m.id === 'wallet' && <div style={{ fontSize:'12px', color:'var(--accent)', marginTop:'3px', fontWeight:'600' }}>₹{user?.walletBalance || 0}</div>}
              </div>
            ))}
          </div>

          {/* Method fields */}
          {method === 'upi' && (
            <FormGroup label="UPI ID">
              <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
            </FormGroup>
          )}
          {method === 'card' && (
            <>
              <FormGroup label="Card Number">
                <Input placeholder="1234 5678 9012 3456" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} />
              </FormGroup>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <FormGroup label="Expiry (MM/YY)">
                  <Input placeholder="12/26" value={expiry} onChange={e => setExpiry(e.target.value)} maxLength={5} />
                </FormGroup>
                <FormGroup label="CVV">
                  <Input type="password" placeholder="•••" value={cvv} onChange={e => setCvv(e.target.value)} maxLength={4} />
                </FormGroup>
              </div>
            </>
          )}
          {method === 'netbanking' && (
            <>
              <FormGroup label="Select Bank">
                <Select value={bank} onChange={e => setBank(e.target.value)}>
                  {banks.map(b => <option key={b}>{b}</option>)}
                </Select>
              </FormGroup>
              <Alert type="info">You will be redirected to your bank's secure portal.</Alert>
            </>
          )}

          <Button variant="primary" full loading={loading} onClick={handlePay} style={{ marginTop:'8px' }}>
            💳 Pay ₹{amount}
          </Button>
        </>
      )}
    </Modal>
  );
}

// ── TOPUP MODAL ───────────────────────────────────────────────────────────────
export function TopupModal({ open, onClose, onSuccess }) {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState(banks[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const presets = [100, 250, 500, 1000, 2000];
  const topupMethods = methods.filter(m => m.id !== 'wallet');
  const formatCard = v => v.replace(/\D/g,'').slice(0,16).match(/.{1,4}/g)?.join(' ') || '';

  // Auto-redirect countdown after topup success
  useEffect(() => {
    if (!success) return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); goToWallet(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [success]);

  const handleTopup = async () => {
    if (!amount || Number(amount) < 50)   return toast.error('Minimum top-up is ₹50');
    if (Number(amount) > 10000)           return toast.error('Maximum is ₹10,000');
    setLoading(true);
    const body = { amount: Number(amount), paymentMethod: method };
    if (method === 'upi')  body.upiId = upiId;
    if (method === 'card') { body.cardNumber = cardNum.replace(/\s/g,''); body.cardExpiry = expiry; body.cardCvv = cvv; }
    if (method === 'netbanking') body.bank = bank;
    try {
      await new Promise(r => setTimeout(r, 1200));
      const { data } = await api.post('/payments/wallet/topup', body);
      updateUser({ walletBalance: data.walletBalance });
      setSuccess({ amount: Number(amount), method, ref: data.transaction?.gatewayRef, newBalance: data.walletBalance });
      toast.success(`✅ ₹${amount} added to wallet!`);
      onSuccess && onSuccess(data.walletBalance);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Top-up failed');
    } finally { setLoading(false); }
  };

  const reset = () => {
    setSuccess(null); setAmount(''); setUpiId(''); setCardNum(''); setExpiry(''); setCvv('');
  };

  const handleClose = () => { reset(); onClose(); };

  const goToWallet = () => { reset(); onClose(); navigate('/dashboard/wallet'); };

  return (
    <Modal open={open} onClose={handleClose} title={success ? '' : 'Add Money to Wallet'} maxWidth="460px">
      {success ? (
        <TopupSuccessScreen
          amount={success.amount} method={success.method}
          ref={success.ref} newBalance={success.newBalance}
          countdown={countdown}
          onGoWallet={goToWallet}
          onClose={handleClose}
        />
      ) : (
        <>
          {/* Quick presets */}
          <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--muted)', marginBottom:'10px' }}>Quick Select</div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
            {presets.map(p => (
              <div key={p} onClick={() => setAmount(String(p))}
                style={{ padding:'8px 16px', border:`1.5px solid ${String(amount)===String(p)?'var(--accent)':'var(--border)'}`, borderRadius:'999px', fontSize:'13px', fontWeight:'600', cursor:'pointer', background: String(amount)===String(p)?'rgba(16,185,129,.08)':'var(--surface)', color: String(amount)===String(p)?'var(--accent2)':'var(--text)', transition:'.2s' }}>
                ₹{p}
              </div>
            ))}
          </div>

          <FormGroup label="Or enter amount (₹50 – ₹10,000)">
            <Input type="number" placeholder="Enter amount" value={amount}
              onChange={e => setAmount(e.target.value)} min={50} max={10000} />
          </FormGroup>

          {/* Method */}
          <p style={{ fontSize:'13px', fontWeight:'600', color:'var(--muted)', marginBottom:'12px' }}>Payment Method</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'20px' }}>
            {topupMethods.map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)}
                style={{ border:`2px solid ${method===m.id?'var(--accent)':'var(--border)'}`, borderRadius:'10px', padding:'12px', textAlign:'center', cursor:'pointer', background: method===m.id?'rgba(16,185,129,.06)':'var(--surface)', transition:'.2s' }}>
                <div style={{ fontSize:'22px', marginBottom:'4px' }}>{m.icon}</div>
                <div style={{ fontSize:'12px', fontWeight:'600' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {method === 'upi' && (
            <FormGroup label="UPI ID">
              <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
            </FormGroup>
          )}
          {method === 'card' && (
            <>
              <FormGroup label="Card Number">
                <Input placeholder="1234 5678 9012 3456" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} />
              </FormGroup>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                <FormGroup label="Expiry"><Input placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} maxLength={5} /></FormGroup>
                <FormGroup label="CVV"><Input type="password" placeholder="•••" value={cvv} onChange={e => setCvv(e.target.value)} maxLength={4} /></FormGroup>
              </div>
            </>
          )}
          {method === 'netbanking' && (
            <FormGroup label="Select Bank">
              <Select value={bank} onChange={e => setBank(e.target.value)}>
                {banks.map(b => <option key={b}>{b}</option>)}
              </Select>
            </FormGroup>
          )}

          <Button variant="primary" full loading={loading} onClick={handleTopup}>
            Add ₹{amount || '0'} to Wallet
          </Button>
        </>
      )}
    </Modal>
  );
}
