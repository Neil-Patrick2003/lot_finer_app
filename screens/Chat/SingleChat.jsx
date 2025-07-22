// SingleChatScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

// ⬇️ Echo setup (Reverb uses Pusher protocol)
window.Pusher = Pusher;
const echo = new Echo({
  broadcaster: 'pusher',
  key: 'aavn992enwtigwpf8xyk', // Reverb uses fake key
  wsHost: 'http://192.168.0.109', // change to your backend domain or IP
  wsPort: 443,
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  authEndpoint: 'http://192.168.0.109/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with actual token
    },
  },
});

const SingleChatScreen = ({ route }) => {
  const { channelId } = route.params; // Passed via navigation
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatMateName, setChatMateName] = useState('');

  useEffect(() => {
    // Fetch chat history and member
    axios
      .get(`http://192.168.0.109/api/agent/chat/channels/${channelId}`, {
        headers: {
          Authorization: `Bearer YOUR_AUTH_TOKEN`,
        },
      })
      .then((res) => {
        setMessages(res.data.current_channel.messages);
        const member = res.data.current_channel.members.find(
          (u) => u.id !== res.data.current_user_id
        );
        setChatMateName(member?.name ?? 'Chatmate');
      })
      .catch((err) => {
        console.error('Error loading messages', err);
      });

    // Listen for new messages in this channel
    echo
      .private(`chat.${channelId}`)
      .listen('MessageSent', (e) => {
        setMessages((prev) => [...prev, e.message]);
      });

    // Cleanup on unmount
    return () => {
      echo.leave(`chat.${channelId}`);
    };
  }, [channelId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    axios
      .post(
        `http://192.168.0.109/api/agent/chat/channels/${channelId}/send`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN`,
          },
        }
      )
      .then(() => {
        setNewMessage('');
        // Laravel will broadcast and push the message to us via Reverb
      })
      .catch((err) => {
        console.error('Send failed', err);
      });
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.sender}>{item.sender.name}:</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {chatMateName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputArea}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default SingleChatScreen;
