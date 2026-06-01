import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
const PAYMENT_STATUS_EVENT = 'payment.status';

export const usePaymentStatus = (options = {}) => {
  const { autoConnect = false } = options;
  const socketRef = useRef(null);
  const queueRef = useRef([]);
  const timerRef = useRef(null);
  const isProcessingRef = useRef(false);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    isProcessingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isProcessingRef.current = false;
      return;
    }

    isProcessingRef.current = true;
    const nextPayload = queueRef.current.shift();
    setStatus(nextPayload);
    setHistory((prev) => [...prev, nextPayload]);

    timerRef.current = setTimeout(() => {
      processQueue();
    }, 4000);
  }, []);

  const handleStatus = useCallback((payload) => {
    if (!payload) return;
    queueRef.current.push(payload);
    if (!isProcessingRef.current) {
      processQueue();
    }
  }, [processQueue]);

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
    clearQueue();
  }, [handleStatus, clearQueue]);

  const reset = useCallback(() => {
    setStatus(null);
    setHistory([]);
    clearQueue();
  }, [clearQueue]);

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
