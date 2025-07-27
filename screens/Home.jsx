import React, { useEffect, useState, useRef } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance, { API_ENDPOINTS } from '../Helper/axiosConfig';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [newProperties, setNewProperties] = useState([]);
  const scaleValue = useRef(new Animated.Value(1)).current;


  useEffect(() => {
  const fetchData = async () => {
    try {
      // No need to manually handle token here - the interceptor does it
      const userRes = await axiosInstance.get(API_ENDPOINTS.USER, { timeout: 5000 });
      setUserName(userRes.data.name);

      const propertyRes = await axiosInstance.get(API_ENDPOINTS.PROPERTIES, { timeout: 5000 });
      setNewProperties(propertyRes.data);
      
    } catch (error) {
      console.error('Error:', error.message);
      if (error.response?.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('Login');
      }
      setUserName('Guest');
      setNewProperties({ data: [] });
    }
  };

  fetchData();
}, [])

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => navigation.navigate('PropertyListing'));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Agent Dashboard</Text>
        <Text style={styles.subheading}>
          Welcome back, {userName || 'Agent'}. Manage your listings below.
        </Text>
      
        {/* List Property Button */}
        <Animated.View 
          style={[
            styles.listPropertyButton,
            { transform: [{ scale: scaleValue }] }
          ]}
        >
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.buttonText}>List your property</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Analytics Summary */}
      <View style={styles.analyticsRow}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>24</Text>
          <Text style={styles.analyticsLabel}>Total Listings</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>12</Text>
          <Text style={styles.analyticsLabel}>Inquiries</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>8</Text>
          <Text style={styles.analyticsLabel}>Handled</Text>
        </View>
      </View>

      {/* New Properties */}
      <View style={styles.newPropsContainer}>
        <View style={styles.newPropsHeader}>
          <Text style={styles.cardTitle}>New Properties</Text>
          <TouchableOpacity onPress={() => alert('View all properties')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {newProperties?.data?.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Available Properties</Text>
                <Text style={styles.emptySubtitle}>Seller haven't added any new properties yet.</Text>
            </View>
        ) : (
          <FlatList
            horizontal
            data={newProperties.data}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 12 }}
            renderItem={({ item }) => (
              <View style={styles.propertyCard}>
                <View>
                  <Image
                    source={{ uri: `${API_ENDPOINTS.STORAGE}/${item.image_url}` }}
                    style={styles.propertyImage}
                  />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.propertyTitle}>{item.title}</Text>
                <Text style={styles.propertyLocation}>{item.location}</Text>
                <Text style={styles.propertyDetails}>{item.details}</Text>
                <TouchableOpacity
                  style={styles.seeButton}
                  onPress={() => navigation.navigate('PropertyDetails', { property: item })}
                >
                  <Text style={styles.seeButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activities</Text>
        <Text style={styles.cardText}>- Updated 2 listings today</Text>
        <Text style={styles.cardText}>- 5 new buyer inquiries</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  headingContainer: {
    backgroundColor: '#5B7931',
    padding: 24,
    borderRadius: 16,
    margin: 12,
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
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
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
  newPropsContainer: {
    marginVertical: 16,
    paddingBottom: 2,
  },
  newPropsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 8,
  },
  seeAll: {
    fontSize: 14,
    color: '#E5BC2B',
    fontWeight: 'bold',
  },
  propertyCard: {
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    padding: 12,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E5BC2B',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  propertyDetails: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  seeButton: {
    backgroundColor: '#E5BC2B',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  seeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#5B7931',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

});