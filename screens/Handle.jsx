import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const propertiesData = [
  {
    id: '1',
    title: 'Modern Villa',
    location: 'Los Angeles, CA',
    details: '4 Beds • 3 Baths • 2500 sqft',
    image: 'https://images.unsplash.com/photo-1560448070-4561d88d83e4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: 'City Apartment',
    location: 'New York, NY',
    details: '2 Beds • 2 Baths • 1200 sqft',
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9b8f27f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'Beach House',
    location: 'Miami, FL',
    details: '3 Beds • 2 Baths • 1800 sqft',
    image: 'https://images.unsplash.com/photo-1501183638714-4e0ab6f969c9?auto=format&fit=crop&w=400&q=80',
  },
];

const Handle = () => {
  const renderPropertyItem = ({ item }) => (
    <View style={styles.propertyCard}>
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{item.title}</Text>
        <Text style={styles.propertyLocation}>{item.location}</Text>
        <Text style={styles.propertyDetails}>{item.details}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Properties</Text>
      <FlatList
        data={propertiesData}
        keyExtractor={(item) => item.id}
        renderItem={renderPropertyItem}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton}>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#E5BC2B', 
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 5,
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
