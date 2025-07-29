import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import axiosInstance, { API_ENDPOINTS } from '../../Helper/axiosConfig';

const PropertyListScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY_DETAIL);
      
      console.log('API Response:', response.data); // Debug log

      if (!response.data?.data) {
        throw new Error('Invalid API response structure');
      }

      const propertiesData = response.data.data.map(item => ({
        id: item.id,
        title: item.title || 'No Title',
        price: item.price || 0,
        image_url: item.images?.[0]?.path || 'default/property.jpg',
        address: item.address || '',
        seller: item.seller?.name || ''
      }));

      setProperties(propertiesData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.propertyCard}
      onPress={() => navigation.navigate('PropertyDetail', { id: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${API_ENDPOINTS.STORAGE}/${item.image_url}` }}
          style={styles.propertyImage}
          resizeMode="cover"
          onError={() => console.log('Image load failed')}
        />
      </View>
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.propertyPrice}>₱{item.price.toLocaleString()}</Text>
        {item.address && (
          <Text style={styles.propertyAddress} numberOfLines={1}>{item.address}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchProperties} />
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      contentContainerStyle={styles.listContainer}
      keyExtractor={item => item.id.toString()}
      renderItem={renderPropertyItem}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>No properties available</Text>
        </View>
      }
    />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
  },
  imageContainer: {
    height: 200,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginBottom: 5,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default PropertyListScreen;