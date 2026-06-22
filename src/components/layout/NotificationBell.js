import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const typeIcon = {
  new_booking: '🛵',
  booking_cancelled: '⚠️',
  booking_completed: '✅',
  vehicle_approved: '🚲',
  renter_approved: '🎉',
  payment_received: '💳',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications() || {};
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (n) => {
    if (!n.read) markAsRead(n._id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  if (!notifications) return null; // not logged in

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', transition: '.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <span style={{ fontSize: '19px' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px', background: 'var(--danger)', color: '#fff',
            fontSize: '10px', fontWeight: '700', borderRadius: '999px', minWidth: '16px', height: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            border: '2px solid var(--brand)'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '360px', maxHeight: '440px',
          background: 'var(--surface)', borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,.25)',
          border: '1px solid var(--border)', overflow: 'hidden', zIndex: 1500
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: '700', fontSize: '15px' }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                <p style={{ fontSize: '13.5px' }}>No notifications yet</p>
              </div>
            ) : notifications.map(n => (
              <div key={n._id} onClick={() => handleClick(n)}
                style={{
                  display: 'flex', gap: '12px', padding: '14px 16px', cursor: 'pointer',
                  borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(16,185,129,.04)',
                  transition: '.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--light)'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(16,185,129,.04)'}>
                <div style={{ fontSize: '20px', flexShrink: 0 }}>{typeIcon[n.type] || '🔔'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '600' }}>{n.title}</span>
                    {!n.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
