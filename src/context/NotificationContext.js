import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  // Fetch existing notifications whenever the user logs in
  const loadNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {}
  };

  useEffect(() => {
    if (!user || !token) {
      // Logged out — clean up
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();

    // Connect socket and join this user's private room
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('join_user_room', user.id || user._id);

    socket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      // Live toast popup too, so it's impossible to miss while using the app
      toast(notif.message, { icon: notif.title.match(/^\p{Emoji}/u)?.[0] || '🔔', duration: 5000 });
    });

    return () => { socket.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token]);

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try { await api.patch(`/notifications/${id}/read`); } catch (e) {}
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try { await api.patch('/notifications/read-all'); } catch (e) {}
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, reload: loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
