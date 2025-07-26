// Me/Notifications.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const Notifications = () => {
  // Sample notifications data
  const notifications = [
    { id: 1, title: 'New Message', description: 'You have received a new message from John.', timestamp: '2 hours ago' },
    { id: 2, title: 'Appointment Reminder', description: 'Your appointment is scheduled for tomorrow at 10 AM.', timestamp: '1 day ago' },
    { id: 3, title: 'New Comment', description: 'Someone commented on your post.', timestamp: '3 days ago' },
  ];

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item)}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDescription}>{item.description}</Text>
      <Text style={styles.notificationTime}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  const handleNotificationPress = (notification) => {
    Alert.alert('Notification Details', `Title: ${notification.title}\nDescription: ${notification.description}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()} // Unique ID for each notification
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8', // Light background for iOS style
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#5B7931', // Title color
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Rounded corners for a softer look
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B7931', // Notification title color
  },
  notificationDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginVertical: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#A9A9A9',
    marginTop: 4,
  },
});

export default Notifications;
