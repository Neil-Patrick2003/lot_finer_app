import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function PropertyDetails({ route }) {
  // Access the passed property data from route.params
  const { property } = route.params;

  return (
    <View style={styles.container}>
      
      <View>
        <Image source={{ uri: property?.image }} style={styles.image} />
        <Text style={styles.title}>{property?.title}</Text>
        <Text style={styles.location}>{property?.location}</Text>
        <Text style={styles.details}>{property?.details}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.inquireButton}>
          <Text  style={styles.inquireText}>Send Inquiries</Text>
        </TouchableOpacity>
        
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: 'gray'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: '#555',
    marginBottom: 6,
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  inquireButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12
  },

  inquireText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 6,
  },
});
