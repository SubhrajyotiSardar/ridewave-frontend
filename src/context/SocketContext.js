import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [vehicleUpdates, setVehicleUpdates] = useState([]);
  const [bookingNotifs, setBookingNotifs] = useState([]);

  useEffect(() => {
    // Connect socket when user is logged in
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    // ── Connection events ─────────────────────────────────────────────────────
    socket.on('connect', () => {
      setConnected(true);
      console.log('🟢 Socket connected:', socket.id);

      // If renter, join renter room for booking notifications
      if (user?.role === 'renter') {
        socket.emit('join_renter_room', { renterId: user.id });
      }
      // If user, join user room
      if (user?.role === 'user') {
        socket.emit('join_user_room', { userId: user.id });
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('🔴 Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ Socket connection error:', err.message);
      setConnected(false);
    });

    // ── Vehicle location updates (for map) ────────────────────────────────────
    socket.on('vehicle_location_updated', (data) => {
      setVehicleUpdates(prev => {
        const filtered = prev.filter(v => v.vehicleId !== data.vehicleId);
        return [...filtered, { ...data, timestamp: Date.now() }];
      });
    });

    // ── Booking notifications (for renter dashboard) ──────────────────────────
    socket.on('new_booking_received', (data) => {
      setBookingNotifs(prev => [data, ...prev].slice(0, 10));
    });

    // ── Ride status updates (for user) ────────────────────────────────────────
    socket.on('ride_status_changed', (data) => {
      setBookingNotifs(prev => [data, ...prev].slice(0, 10));
    });

    // ── Online user count (admin dashboard) ──────────────────────────────────
    socket.on('online_count', (count) => {
      setOnlineCount(count);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  // ── Helper: emit vehicle location (for renters) ───────────────────────────
  const updateVehicleLocation = (vehicleId, lat, lng, status = 'available') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('update_vehicle_location', { vehicleId, lat, lng, status });
    }
  };

  // ── Helper: request all vehicles for map ─────────────────────────────────
  const getAllVehicles = (callback) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('get_all_vehicles');
      socketRef.current.once('all_vehicles', callback);
    }
  };

  // ── Helper: emit booking created ─────────────────────────────────────────
  const emitBookingCreated = (bookingData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('booking_created', bookingData);
    }
  };

  // ── Clear notification ────────────────────────────────────────────────────
  const clearBookingNotifs = () => setBookingNotifs([]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      onlineCount,
      vehicleUpdates,
      bookingNotifs,
      updateVehicleLocation,
      getAllVehicles,
      emitBookingCreated,
      clearBookingNotifs,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
