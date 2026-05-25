import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const PAYMENT_STATUS_EVENT = 'payment.status';

export const usePaymentStatus = (options = {}) => {
  const { autoConnect = false } = options;
  const socketRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleStatus = useCallback((payload) => {
    if (!payload) return;
    setStatus(payload);
    setHistory((prev) => [...prev, payload]);
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    const socket = io(DEFAULT_SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on(PAYMENT_STATUS_EVENT, handleStatus);
  }, [handleStatus]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.off(PAYMENT_STATUS_EVENT, handleStatus);
    socket.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, [handleStatus]);

  const reset = useCallback(() => {
    setStatus(null);
    setHistory([]);
  }, []);

  useEffect(() => {
    if (!autoConnect) return undefined;

    connect();
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  return {
    status,
    history,
    isConnected,
    connect,
    disconnect,
    reset,
  };
};
