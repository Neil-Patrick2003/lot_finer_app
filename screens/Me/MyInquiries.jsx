// Me/MyInquiries.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const MyInquiries = () => {
  // Sample inquiries data
  const inquiries = [
    { id: 1, title: 'Inquiry about Property A', description: 'Can you provide more details about this property?', timestamp: '2 hours ago' },
    { id: 2, title: 'Inquiry about Property B', description: 'Is this property still available?', timestamp: '1 day ago' },
    { id: 3, title: 'Inquiry about Property C', description: 'What are the amenities included?', timestamp: '3 days ago' },
  ];

  const renderInquiryItem = ({ item }) => (
    <TouchableOpacity style={styles.inquiryItem} onPress={() => handleInquiryPress(item)}>
      <Text style={styles.inquiryTitle}>{item.title}</Text>
      <Text style={styles.inquiryDescription}>{item.description}</Text>
      <Text style={styles.inquiryTime}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  const handleInquiryPress = (inquiry) => {
    Alert.alert('Inquiry Details', `Title: ${inquiry.title}\nDescription: ${inquiry.description}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Inquiries</Text>
      <FlatList
        data={inquiries}
        renderItem={renderInquiryItem}
        keyExtractor={(item) => item.id.toString()} // Unique ID for each inquiry
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
  inquiryItem: {
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
  inquiryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B7931', // Inquiry title color
  },
  inquiryDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginVertical: 4,
  },
  inquiryTime: {
    fontSize: 12,
    color: '#A9A9A9',
    marginTop: 4,
  },
});

export default MyInquiries;
