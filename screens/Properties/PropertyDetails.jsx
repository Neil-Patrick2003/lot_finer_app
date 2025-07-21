import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PropertyDetails({ route, navigation }) {
  const { property } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [inquiryText, setInquiryText] = useState('');



  

  const handleSendInquiry = async () => {
    if (!inquiryText.trim()) {
      Alert.alert('Message Required', 'Please enter your inquiry before sending.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await axios.post(
        `http://192.168.0.109/api/agent/properties/${property.id}/inquire`,
        {
          property_id: property.id,
          message: inquiryText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show backend message (success or error)
      if (response.data.success) {
        Alert.alert('Success', response.data.success);
      } else if (response.data.error) {
        Alert.alert('Error', response.data.error);
      } else {
        Alert.alert('Notice', 'Inquiry response received, but no message found.');
      }

    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Laravel validation error
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0][0];
        Alert.alert('Validation Error', firstError);
      } else {
        console.error('Inquiry error:', error);
        Alert.alert('Error', 'Failed to send inquiry. Please try again.');
      }
    }

    console.log(`Inquiry for ${property.title}: ${inquiryText}`);
    setModalVisible(false);
    setInquiryText('');
  };



  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: property?.image }} style={styles.image} />
        <Text style={styles.title}>{property?.title}</Text>
        <Text style={styles.location}>{property?.location}</Text>
        <Text style={styles.details}>{property?.details}</Text>
      </View>

      <TouchableOpacity
        style={styles.inquireButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inquireText}>Send Inquiry</Text>
      </TouchableOpacity>

      {/* Inquiry Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Inquiry</Text>
            <TextInput
              placeholder="Type your message..."
              value={inquiryText}
              onChangeText={setInquiryText}
              style={styles.input}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendInquiry}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  location: {
    fontSize: 18,
    color: '#555',
    marginBottom: 6,
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  inquireButton: {
    backgroundColor: '#5B7931',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  inquireText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#5B7931',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: '#999',
    fontSize: 14,
  },
});
