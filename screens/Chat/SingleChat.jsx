import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axiosInstance, { API_ENDPOINTS } from '../../Helper/axiosConfig';
import configureEcho from '../../Helper/echo';
import { Ionicons } from '@expo/vector-icons';

const SingleChatScreen = ({ route, navigation }) => {
  const { channelId, chatmateName, chatmateAvatar } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [echo, setEcho] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      title: chatmateName || 'Chat',
    });

    const initChat = async () => {
      try {
        setLoading(true);
        
        // Initialize Echo
        const echoInstance = await configureEcho();
        setEcho(echoInstance);

        // Fetch chat history
        const response = await axiosInstance.get(API_ENDPOINTS.CHANNEL);
        setMessages(response.data.current_channel.messages || []);

        // Listen for new messages
        echoInstance.private(`chat.${channelId}`)
          .listen('MessageSent', (e) => {
            setMessages(prev => [...prev, e.message]);
            scrollToBottom();
          });

      } catch (error) {
        console.error('Chat error:', error);
        Alert.alert('Error', 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (echo) {
        echo.leave(`chat.${channelId}`);
      }
    };
  }, [channelId]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await axiosInstance.post(`${API_ENDPOINTS.CHAT}/channels/${channelId}/send`, {
        message: newMessage
      });
      setNewMessage('');
    } catch (error) {
      console.error('Send failed:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender_id === user.id; // You'll need to get current user ID
    
    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        {!isCurrentUser && (
          <Text style={styles.senderName}>{item.sender.name}</Text>
        )}
        <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>
          {item.message}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherUserBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentUserText: {
    color: '#000',
  },
  otherUserText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5C7934',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SingleChatScreen;