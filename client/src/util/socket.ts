import { io } from 'socket.io-client';

const socketAddress = process.env.REACT_APP_SOCKET_ADDRESS ?? '';
export const socket = io(`${socketAddress}/`);
