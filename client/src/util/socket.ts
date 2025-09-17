import { io } from 'socket.io-client';
import { SERVER_URI } from './constants';

export const socket = io(`${SERVER_URI}/`, {
  transports: ['websocket'],
});
