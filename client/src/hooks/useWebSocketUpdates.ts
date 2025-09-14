import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocketUpdates(onUpdate: () => void) {
  useEffect(() => {
    const socketAddress =
      process.env.REACT_APP_SOCKET_ADDRESS || 'http://localhost';
    const socket: Socket = io(socketAddress + '/socket.io/');
    socket.on('data_updated', onUpdate);
    return () => {
      socket.disconnect();
    };
  }, [onUpdate]);
}