import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator
} from 'react-native';
import axiosConfig from '../../Helper/axiosConfig';

const BASE_URL = 'http://192.168.0.109/storage/';
const { width } = Dimensions.get('window');

export default function ShowProperty({ route }) {
  const { property } = route.params;
  const [propertyDetails, setPropertyDetails] = useState(null);
  const flatListRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (propertyDetails?.property?.images?.length > 1) {
        const nextIndex = (currentImageIndex + 1) % propertyDetails.property.images.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentImageIndex(nextIndex);
      }
    }, 3000); // every 3s

    return () => clearInterval(interval);
  }, [currentImageIndex, propertyDetails]);

  const fetchProperty = async () => {
    try {
      const response = await axiosConfig.get(`/agent/listing/${property.id}`);
      if (response.status === 200) {
        setPropertyDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      Alert.alert('Error', 'Failed to load property.');
    }
  };

  const handlePublish = () => {
    Alert.alert('Success', 'Property has been published!');
    // TODO: API call here
  };

  const stripHtml = (html) => html?.replace(/<[^>]*>?/gm, '');

  if (!propertyDetails?.property) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  const prop = propertyDetails.property;
  const seller = propertyDetails.seller;

  return (
    <ScrollView style={styles.container}>
      {/* Auto-scrolling Image Gallery */}
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={prop.images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `${BASE_URL}${item.image_url}` }}
            style={styles.galleryImage}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Title & Address */}
      <View style={styles.header}>
        <Text style={styles.title}>{prop.title}</Text>
        <Text style={styles.price}>₱ {parseFloat(prop.price).toLocaleString()}</Text>
        <Text style={styles.address}>{prop.address}</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Stat label="Type" value={prop.property_type} />
        <Stat label="Subtype" value={prop.sub_type} />
        <Stat label="Bedrooms" value={prop.bedrooms} />
        <Stat label="Bathrooms" value={prop.bathrooms} />
        <Stat label="Car Slots" value={prop.car_slots} />
        <Stat label="Lot Area" value={`${prop.lot_area} sqm`} />
        {prop.floor_area && <Stat label="Floor Area" value={`${prop.floor_area} sqm`} />}
        <Stat label="Total Rooms" value={prop.total_rooms} />
        <Stat label="Status" value={prop.status} />
      </View>

      {/* Features */}
      {prop.features.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.tags}>
            {prop.features.map((f) => (
              <View key={f.id} style={styles.tag}>
                <Text style={styles.tagText}>{f.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{stripHtml(prop.description)}</Text>
      </View>

      {/* Seller Info */}
      {seller && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Info</Text>
          <Text style={styles.label}>Name: <Text style={styles.value}>{seller.name}</Text></Text>
          <Text style={styles.label}>Email: <Text style={styles.value}>{seller.email}</Text></Text>
          {seller.contact_number && (
            <Text style={styles.label}>Contact: <Text style={styles.value}>{seller.contact_number}</Text></Text>
          )}
        </View>
      )}

      {/* Publish Button */}
      {prop.status === 'Assigned' ? (
        <TouchableOpacity style={styles.button} onPress={handlePublish}>
            <Text style={styles.buttonText}>Publish Property</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} disabled>
            <Text style={styles.buttonText}>{prop.status}</Text>
        </TouchableOpacity>
      )}
      
    </ScrollView>
  );
}

const Stat = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: width,
    height: 260,
    resizeMode: 'cover',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 6,
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '47%',
    backgroundColor: '#eef1f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#111',
  },
  button: {
    backgroundColor: '#5C7934',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
