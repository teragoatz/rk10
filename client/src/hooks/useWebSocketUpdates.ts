import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socketAddress =
      process.env.REACT_APP_SOCKET_ADDRESS || 'http://localhost';
const socket: Socket = io(socketAddress);

export function useWebSocketUpdates(onUpdate: () => void) {
  useEffect(() => {
    socket.on('data_updated', (data) => {
      console.log('Received data_updated event:', data);
      onUpdate();
    });
  }, [onUpdate]);
}