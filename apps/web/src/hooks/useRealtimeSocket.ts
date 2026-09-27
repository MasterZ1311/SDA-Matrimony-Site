'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
import { useMatrimonyStore, NotificationItem } from '@/stores/matrimonyStore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4001';

export function useRealtimeSocket() {
  const { isAuthenticated } = useAuthStore();
  const { addRealtimeNotification, setRealtimeUnreadCount, fetchUnreadCount } =
    useMatrimonyStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('sda_access_token');
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_user_room');
      // Sync fresh unread count on reconnect
      fetchUnreadCount().catch(() => {});
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('notification:new', (notification: NotificationItem) => {
      addRealtimeNotification(notification);
    });

    socket.on('notification:unread-count', (data: { count: number }) => {
      if (typeof data?.count === 'number') {
        setRealtimeUnreadCount(data.count);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, addRealtimeNotification, setRealtimeUnreadCount, fetchUnreadCount]);

  return { socket: socketRef.current, isConnected };
}
