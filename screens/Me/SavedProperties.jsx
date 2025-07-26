// Me/SavedProperties.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';

const SavedProperties = () => {
  // Sample saved properties data
  const [savedProperties, setSavedProperties] = useState([
    { id: 1, title: 'Luxury Apartment in Downtown', description: '3 beds, 2 baths, great view of the city.', price: '$1,200,000' },
    { id: 2, title: 'Cozy Family Home', description: '4 beds, 3 baths, spacious backyard.', price: '$850,000' },
    { id: 3, title: 'Modern Condo', description: '2 beds, 2 baths, close to public transport.', price: '$600,000' },
  ]);

  const renderPropertyItem = ({ item }) => (
    <View style={styles.propertyItem}>
      <Text style={styles.propertyTitle}>{item.title}</Text>
      <Text style={styles.propertyDescription}>{item.description}</Text>
      <Text style={styles.propertyPrice}>{item.price}</Text>
      <View style={styles.buttonContainer}>
        <Button title="View Details" onPress={() => handlePropertyPress(item)} color="#5B7931" />
        <Button title="Remove" onPress={() => handleRemoveProperty(item.id)} color="#FF3B30" />
      </View>
    </View>
  );

  const handlePropertyPress = (property) => {
    Alert.alert('Property Details', `Title: ${property.title}\nDescription: ${property.description}\nPrice: ${property.price}`);
  };

  const handleRemoveProperty = (id) => {
    setSavedProperties(savedProperties.filter(property => property.id !== id));
    Alert.alert('Removed', 'Property has been removed from your saved list.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Properties</Text>
      <FlatList
        data={savedProperties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id.toString()} // Unique ID for each property
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8', // Light background for iOS style
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#5B7931', // Title color
    marginBottom: 24,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  propertyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Rounded corners for a softer look
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B7931', // Property title color
  },
  propertyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginVertical: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E', // Price color
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default SavedProperties;
