import React, { useEffect, useState, useRef } from 'react';
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance, { API_ENDPOINTS } from '../Helper/axiosConfig';
import PropertyListScreen from './Properties/PropertyListScreen';


export default function Home() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [newProperties, setNewProperties] = useState([]);
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get(API_ENDPOINTS.USER, { timeout: 5000 });
        setUserName(userRes.data.name);

        const propertyRes = await axiosInstance.get(API_ENDPOINTS.PROPERTIES, { 
          params: { page: 1, per_page: 4 }
        });
        setNewProperties(propertyRes.data.data);
      } catch (error) {
        console.error('Error:', error.message);
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          navigation.navigate('Login');
        }
        setUserName('Guest');
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

  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Agent Dashboard</Text>
        <Text style={styles.subheading}>
          Welcome back, {userName || 'Agent'}
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
          <Text style={styles.analyticsValue}>24</Text>
          <Text style={styles.analyticsLabel}>Listings</Text>
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

      {/* New Properties Preview */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Properties</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Properties')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {newProperties.length > 0 ? (
          <PropertyListScreen 
            navigation={navigation}
            compact={true}
            initialData={newProperties}
            showAll={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties available</Text>
          </View>
        )}
      </View>

      {/* Full Properties Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>All Properties</Text>
        <PropertyListScreen navigation={navigation} />
      </View>
    </View>
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
  }
});