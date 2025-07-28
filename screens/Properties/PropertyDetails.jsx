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
  ScrollView,
} from 'react-native';
import axiosInstance, { API_ENDPOINTS } from '../../Helper/axiosConfig';

export default function PropertyDetails({ route }) {
  const { property } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper component for property detail rows
  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const handleSendInquiry = async () => {
    if (!inquiryText.trim()) {
      Alert.alert('Message Required', 'Please enter your inquiry before sending.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.propertyInquiry(property.id),
        { message: inquiryText }
      );

      Alert.alert('Success', response.data.message || 'Your inquiry was sent successfully!');
      setModalVisible(false);
      setInquiryText('');
    } catch (error) {
      console.error('Inquiry error:', error);
      
      if (error.response?.status === 422) {
        // Handle Laravel validation errors
        const firstError = Object.values(error.response.data.errors)[0][0];
        Alert.alert('Validation Error', firstError);
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to send inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Property Image */}
      <Image
        source={{ uri: `${API_ENDPOINTS.STORAGE}/${property.image_url}` }}
        style={styles.image}
      />

      <View style={styles.content}>
        {/* Title & Price Row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.price}>₱{parseFloat(property.price).toLocaleString()}</Text>
        </View>

        {/* Address */}
        <Text style={styles.address}>📍 {property.address}</Text>

        {/* Property Details Card */}
        <View style={styles.detailsCard}>
          <DetailRow label="Type" value={`${property.property_type} (${property.sub_type})`} />
          <DetailRow label="Lot Area" value={`${property.lot_area} sqm`} />
          <DetailRow label="Floor Area" value={`${property.floor_area} sqm`} />
          <DetailRow label="Rooms" value={property.total_rooms} />
          <DetailRow label="Bedrooms" value={property.bedrooms} />
          <DetailRow label="Bathrooms" value={property.bathrooms} />
          <DetailRow label="Car Slots" value={property.car_slots} />
          <DetailRow label="Status" value={property.status} />
          <DetailRow label="Presell" value={property.isPresell ? 'Yes' : 'No'} />
          <DetailRow label="Multi Agents" value={property.allow_multi_agents ? 'Allowed' : 'Not Allowed'} />
        </View>

        {/* Description Section */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{property.description}</Text>

        {/* Seller Information */}
        {property.seller && (
          <>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerCard}>
              <Text style={styles.sellerName}>{property.seller.name}</Text>
              <Text style={styles.sellerDetail}>Email: {property.seller.email}</Text>
              {property.seller.contact_number && (
                <Text style={styles.sellerDetail}>Contact: {property.seller.contact_number}</Text>
              )}
            </View>
          </>
        )}

        {/* Inquiry Button */}
        <TouchableOpacity
          style={styles.inquireButton}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.inquireText}>Send Inquiry</Text>
        </TouchableOpacity>
      </View>

      {/* Inquiry Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => !isSubmitting && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Inquiry</Text>
            <TextInput
              placeholder="Type your message here..."
              placeholderTextColor="#999"
              value={inquiryText}
              onChangeText={setInquiryText}
              style={styles.input}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
            <TouchableOpacity 
              style={[styles.sendButton, isSubmitting && styles.disabledButton]}
              onPress={handleSendInquiry}
              disabled={isSubmitting}
            >
              <Text style={styles.sendButtonText}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e2e2e',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4caf50',
  },
  address: {
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#444',
    fontSize: 15,
  },
  detailValue: {
    color: '#555',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 24,
  },
  sellerCard: {
    backgroundColor: '#e2f0d9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e2e2e',
    marginBottom: 6,
  },
  sellerDetail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  inquireButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  inquireText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
    minHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelText: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});