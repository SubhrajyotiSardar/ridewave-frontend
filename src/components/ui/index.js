import React from 'react';

// ── BUTTON ────────────────────────────────────────────────────────────────────
export function Button({ children, variant='primary', size='md', full=false, loading=false, disabled=false, onClick, type='button', className='' }) {
  const base = { display:'inline-flex', alignItems:'center', gap:'8px', border:'none', borderRadius:'8px', fontWeight:'500', cursor: disabled||loading ? 'not-allowed' : 'pointer', opacity: disabled||loading ? 0.6 : 1, transition:'all .2s', fontFamily:'Inter,sans-serif', justifyContent: full ? 'center' : undefined, width: full ? '100%' : undefined };
  const sizes = { sm:{padding:'6px 14px',fontSize:'13px'}, md:{padding:'10px 20px',fontSize:'14px'}, lg:{padding:'13px 28px',fontSize:'16px'} };
  const variants = {
    primary:{background:'var(--accent)',color:'#fff'},
    secondary:{background:'var(--light)',color:'var(--text)'},
    danger:{background:'var(--danger)',color:'#fff'},
    warn:{background:'var(--warn)',color:'#fff'},
    info:{background:'var(--info)',color:'#fff'},
    ghost:{background:'transparent',color:'var(--muted)',border:'1.5px solid var(--border)'},
    dark:{background:'var(--brand)',color:'#fff'},
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled||loading} style={{...base,...sizes[size],...variants[variant]}} className={className}>
      {loading ? '⏳ Processing...' : children}
    </button>
  );
}

// ── CARD ──────────────────────────────────────────────────────────────────────
export function Card({ children, className='', style={}, onClick }) {
  return (
    <div onClick={onClick} style={{ background:'var(--surface)', borderRadius:'var(--radius)', boxShadow:'var(--shadow)', border:'1px solid var(--border)', overflow:'hidden', cursor: onClick ? 'pointer' : undefined, ...style }} className={className}>
      {children}
    </div>
  );
}
export function CardBody({ children, style={} }) {
  return <div style={{ padding:'20px', ...style }}>{children}</div>;
}

// ── BADGE / PILL ──────────────────────────────────────────────────────────────
const pillColors = {
  available:'#D1FAE5:#065F46', in_use:'#DBEAFE:#1E40AF', maintenance:'#FEF3C7:#92400E',
  inactive:'#F1F5F9:#64748B', pending:'#FEF3C7:#92400E', confirmed:'#DBEAFE:#1E40AF',
  active:'#D1FAE5:#065F46', completed:'#F1F5F9:#64748B', cancelled:'#FEE2E2:#991B1B',
  paid:'#D1FAE5:#065F46', refunded:'#DBEAFE:#1E40AF', success:'#D1FAE5:#065F46',
  failed:'#FEE2E2:#991B1B', approved:'#D1FAE5:#065F46', suspended:'#FEE2E2:#991B1B',
  user:'#DBEAFE:#1E40AF', renter:'#EDE9FE:#5B21B6', admin:'#FEF3C7:#92400E',
};
export function Badge({ status, label }) {
  const colors = pillColors[status] || '#F1F5F9:#64748B';
  const [bg, color] = colors.split(':');
  const text = label || status?.replace(/_/g,' ');
  return <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:'600', background:bg, color }}>{text}</span>;
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
export function FormGroup({ label, children, error }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      {label && <label style={{ display:'block', fontSize:'13px', fontWeight:'500', color:'var(--muted)', marginBottom:'6px' }}>{label}</label>}
      {children}
      {error && <p style={{ fontSize:'12px', color:'var(--danger)', marginTop:'4px' }}>{error}</p>}
    </div>
  );
}
export function Input({ type='text', placeholder, value, onChange, disabled=false, style={}, ...rest }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
      style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'14px', background: disabled?'var(--light)':'var(--surface)', color:'var(--text)', outline:'none', transition:'.2s', opacity: disabled ? 0.7 : 1, ...style }}
      onFocus={e=>{ e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,.1)'; }}
      onBlur={e=>{ e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
      {...rest}
    />
  );
}
export function Select({ value, onChange, children, style={} }) {
  return (
    <select value={value} onChange={onChange}
      style={{ width:'100%', padding:'10px 14px', border:'1.5px solid var(--border)', borderRadius:'8px', fontSize:'14px', background:'var(--surface)', color:'var(--text)', outline:'none', ...style }}>
      {children}
    </select>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
export function StatCard({ icon, value, label, bg='#D1FAE5', onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <CardBody>
        <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', marginBottom:'12px' }}>{icon}</div>
        <div style={{ fontSize:'26px', fontWeight:'700', fontFamily:'Space Grotesk,sans-serif', letterSpacing:'-0.5px' }}>{value}</div>
        <div style={{ fontSize:'13px', color:'var(--muted)', marginTop:'2px' }}>{label}</div>
      </CardBody>
    </Card>
  );
}

// ── TABLE ─────────────────────────────────────────────────────────────────────
export function Table({ headers, rows, empty='No data found' }) {
  return (
    <div style={{ overflowX:'auto', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--surface)', fontSize:'14px' }}>
        <thead>
          <tr>
            {headers.map((h,i) => (
              <th key={i} style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'var(--muted)', background:'var(--light)', borderBottom:'1px solid var(--border)', textTransform:'uppercase', letterSpacing:'.5px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ padding:'40px', textAlign:'center', color:'var(--muted)' }}>{empty}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length-1 ? '1px solid var(--border)' : 'none' }}>
              {row.map((cell, j) => <td key={j} style={{ padding:'12px 16px' }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth='520px' }) {
  if (!open) return null;
  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'var(--surface)', borderRadius:'16px', width:'100%', maxWidth, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'var(--surface)', zIndex:1 }}>
          <h3 style={{ fontSize:'18px' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'var(--muted)', lineHeight:1 }}>✕</button>
        </div>
        <div style={{ padding:'24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── ALERT ─────────────────────────────────────────────────────────────────────
export function Alert({ type='info', children }) {
  const styles = {
    info:{background:'#DBEAFE',border:'1px solid #3B82F6',color:'#1E40AF'},
    warn:{background:'#FEF3C7',border:'1px solid #F59E0B',color:'#92400E'},
    success:{background:'#D1FAE5',border:'1px solid #10B981',color:'#065F46'},
    danger:{background:'#FEE2E2',border:'1px solid #EF4444',color:'#991B1B'},
  };
  return <div style={{ padding:'12px 16px', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', ...styles[type] }}>{children}</div>;
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon='📭', title, subtitle, action }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)' }}>
      <div style={{ fontSize:'48px', marginBottom:'12px' }}>{icon}</div>
      <p style={{ fontSize:'16px', fontWeight:'600', color:'var(--text)', marginBottom:'4px' }}>{title}</p>
      {subtitle && <p style={{ fontSize:'14px', marginBottom:'16px' }}>{subtitle}</p>}
      {action}
    </div>
  );
}

// ── DIVIDER ───────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0' }}>
      <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
      {label && <span style={{ fontSize:'12px', color:'var(--muted)', fontWeight:'500' }}>{label}</span>}
      <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
    </div>
  );
}

// ── PAGE WRAPPER ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
      <div>
        <h2 style={{ fontSize:'22px', marginBottom:'2px' }}>{title}</h2>
        {subtitle && <p style={{ color:'var(--muted)', fontSize:'14px' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
