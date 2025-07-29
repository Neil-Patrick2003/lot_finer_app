import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance, { API_ENDPOINTS } from '../Helper/axiosConfig';
import ShowProperty from './HandleProperty/ShowProperty';

export default function Home() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [newProperties, setNewProperties] = useState([]);
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get(API_ENDPOINTS.USER, { timeout: 5000 });
        setUserData(userRes.data);

        const propertyRes = await axiosInstance.get(API_ENDPOINTS.PROPERTIES, {
          params: { page: 1, per_page: 4 }
        });
        setNewProperties(propertyRes.data);
      } catch (error) {
        console.error('Error:', error.message);
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          navigation.navigate('Login');
        }
      }
    };

    fetchData();
  }, []);

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };


  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => navigation.navigate('PropertyListing'));
  };

  const userName = userData?.user?.name || 'Agent';
  const listingCount = userData?.listingCount ?? 0;
  const inquiryCount = userData?.inquiryCount ?? 0;
  const availableCount = userData?.availableCount ?? 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Agent Dashboard</Text>
        <Text style={styles.subheading}>
          Welcome back, {userName}
        </Text>

        <Animated.View style={[styles.listPropertyButton, { transform: [{ scale: scaleValue }] }]}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.buttonText}>List Property</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Analytics Summary */}
      <View style={styles.analyticsRow}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>{listingCount}</Text>
          <Text style={styles.analyticsLabel}>Listings</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>{inquiryCount}</Text>
          <Text style={styles.analyticsLabel}>Inquiries</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>{availableCount}</Text>
          <Text style={styles.analyticsLabel}>Available</Text>
        </View>
      </View>

      {/* New Properties Preview */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Properties</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Properties')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {newProperties?.data?.length > 0 ? (
          <View>
            {newProperties.data.map((property) => (
              <TouchableOpacity 
                key={property.id} 
              >
                <View style={styles.propertyCard}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: `${API_ENDPOINTS.STORAGE}/${property.image_url}` }}
                      style={styles.propertyImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.propertyDetails}>
                    <Text style={styles.propertyTitle}>{property.title}</Text>
                    <Text style={styles.propertyPrice}>₱ {parseFloat(property.price).toLocaleString()}</Text>

                    <Text style={styles.propertyMeta}>
                      🏠 {property.lot_area || '--'} sqm • 📐 {property.floor_area || '--'} sqm
                    </Text>

                    <Text style={styles.propertySeller}>👤 {property.seller?.name || 'Unknown Seller'}</Text>
                    <Text style={styles.propertyAddress}>📍 {property.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties available</Text>
          </View>
        )}


      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  headingContainer: {
    backgroundColor: '#5B7931',
    padding: 24,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  listPropertyButton: {
    marginTop: 20,
    backgroundColor: '#E5BC2B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: -15,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
    minWidth: 100,
  },
  analyticsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5B7931',
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  sectionContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    color: '#E5BC2B',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    color: '#888',
  },
  propertyCard: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  elevation: 2,
},

imageWrapper: {
  width: 100,
  height: 100,
  borderRadius: 10,
  overflow: 'hidden',
  marginRight: 12,
},

propertyImage: {
  width: '100%',
  height: '100%',
},

propertyDetails: {
  flex: 1,
  justifyContent: 'space-between',
},

propertyTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},

propertyPrice: {
  fontSize: 15,
  fontWeight: '600',
  color: '#5B7931',
  marginVertical: 4,
},

propertyMeta: {
  fontSize: 13,
  color: '#666',
  marginBottom: 2,
},

propertySeller: {
  fontSize: 13,
  color: '#888',
},

propertyAddress: {
  fontSize: 13,
  color: '#888',
},

  
});
