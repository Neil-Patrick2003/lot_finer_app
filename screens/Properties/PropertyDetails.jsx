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
import axiosConfig from '../../Helper/axiosConfig';

export default function PropertyDetails({ route }) {
  const { property } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [inquiryText, setInquiryText] = useState('');

  const rootUrl = 'http://192.168.0.109';

  const handleSendInquiry = async () => {
    if (!inquiryText.trim()) {
      Alert.alert('Message Required', 'Please enter your inquiry before sending.');
      return;
    }

    try {
      const response = await axiosConfig.post(
        `/agent/properties/${property.id}/inquire`,
        {
          property_id: property.id,
          message: inquiryText,
        }
      );

      const data = response.data;

      if (data.success) {
        Alert.alert('Success', data.success);
      } else if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Notice', 'Inquiry sent, but no confirmation message returned.');
      }

      setModalVisible(false);
      setInquiryText('');
    } catch (error) {
      if (error.response?.status === 422) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        Alert.alert('Validation Error', firstError);
      } else {
        console.error('Inquiry error:', error);
        Alert.alert('Error', 'Failed to send inquiry. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: `${rootUrl}/storage/${property.image_url}` }}
        style={styles.image}
      />

      <View style={styles.content}>
        {/* Title & Price */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.price}>₱ {parseFloat(property.price).toLocaleString()}</Text>
        </View>

        {/* Address */}
        <Text style={styles.address}>📍 {property.address}</Text>

        {/* Property Details Card */}
        <View style={styles.detailsCard}>
          <DetailRow label="Type" value={`${property.property_type} (${property.sub_type})`} />
          <DetailRow label="Lot Area" value={`${property.lot_area} sqm`} />
          <DetailRow label="Floor Area" value={`${property.floor_area} sqm`} />
          <DetailRow label="Rooms" value={property.total_rooms.toString()} />
          <DetailRow label="Bedrooms" value={property.bedrooms.toString()} />
          <DetailRow label="Bathrooms" value={property.bathrooms.toString()} />
          <DetailRow label="Car Slots" value={property.car_slots.toString()} />
          <DetailRow label="Status" value={property.status} />
          <DetailRow label="Presell" value={property.isPresell ? 'Yes' : 'No'} />
          <DetailRow label="Allow Multi Agents" value={property.allow_multi_agents ? 'Yes' : 'No'} />
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{property.description}</Text>

        {/* Seller Info */}
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Inquiry</Text>
            <TextInput
              placeholder="Type your message here..."
              value={inquiryText}
              onChangeText={setInquiryText}
              style={styles.input}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
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
    </ScrollView>
  );
}

// Helper component for detail rows to keep code DRY
function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
});
