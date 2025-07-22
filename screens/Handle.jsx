import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import axiosConfig from '../Helper/axiosConfig';
  import { useNavigation } from '@react-navigation/native';


const Handle = ( ) => {
  const [handleProperties, setHandleProperties] = useState([]);
  const rootUrl = 'http://192.168.0.109';

const navigation = useNavigation();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axiosConfig.get('/agent/listing');
      if (response.status === 200) {
        setHandleProperties(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties.');
    }
  };

  const renderPropertyItem = ({ item }) => (
    <View style={styles.propertyCard}>
      <Image
        source={{ uri: `${rootUrl}/storage/${item.property.image_url}` }}
        style={styles.propertyImage}
      />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{item.property.title || 'Untitled Property'}</Text>
        <Text style={styles.propertyLocation}>{item.property.address || 'No Address Provided'}</Text>
        <Text style={styles.propertyDetails}>
          ₱{parseFloat(item.property.price || 0).toLocaleString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ShowProperty', { property: item.property })}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Properties</Text>
      <FlatList
        data={handleProperties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPropertyItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProperty')}
      >
        <Text style={styles.addButtonText}>+ Add New Property</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f6f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5B7931',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  propertyLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  propertyDetails: {
    fontSize: 12,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#E5BC2B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: '#5B7931',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#5B7931',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Handle;
