import Pusher from 'pusher-js/react-native';
const configureEcho = () => {
  return new Pusher('aavn992enwtigwpf8xyk', {

    wsHost: 'test.nutrisafari.xyz',
    wsPort: 443,
    wssPort: 443,
    
  
    wsPath: '/reverb', 
    forceTLS: true,     
    enabledTransports: ['ws', 'wss'],  

    disableStats: true,  
    cluster: 'mt1',      
    

    authEndpoint: 'https://test.nutrisafari.xyz/api/broadcasting/auth',
    

    auth: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  });
};

export default configureEcho;