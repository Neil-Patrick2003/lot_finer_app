// socket.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'aavn992enwtigwpf8xyk', // Laravel Reverb uses this fake key
  wsHost: 'http://192.168.0.109', // Your API domain
  wsPort: 443,
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: 'http://192.168.0.109/broadcasting/auth', // must match Laravel
  auth: {
    headers: {
      Authorization: `Bearer YOUR_AUTH_TOKEN`, // Sanctum or Passport token
    },
  },
});

export default echo;
