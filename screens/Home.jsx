import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,  // <-- Import Image here
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();

  const newProperties = [
    {
      id: '1',
      title: 'Modern Villa',
      location: 'LA',
      details: '4 Beds • 3 Baths • 2500 sqft',
      image:
        'https://images.unsplash.com/photo-1560448070-4561d88d83e4?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2',
      title: 'City Apartment',
      location: 'NY',
      details: '2 Beds • 2 Baths • 1200 sqft',
      image:
        'https://images.unsplash.com/photo-1572120360610-d971b9b8f27f?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '3',
      title: 'Beach House',
      location: 'Miami',
      details: '3 Beds • 2 Baths • 1800 sqft',
      image:
        'https://images.unsplash.com/photo-1501183638714-4e0ab6f969c9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '4',
      title: ' Cottage',
      location: 'Texas',
      details: '3 Beds • 2 Baths • 1500 sqft',
      image:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Agent Dashboard</Text>
        <Text style={styles.subheading}>
          Welcome back, Agent. Manage your listings below.
        </Text>
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

      {/* New Properties Horizontal Scroll */}
      <View style={styles.newPropsContainer}>
        <View style={styles.newPropsHeader}>
          <Text style={styles.cardTitle}>New Properties</Text>
          <TouchableOpacity onPress={() => alert('View all properties')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={newProperties}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={styles.propertyCard}>
              <Image source={{ uri: item.image }} style={styles.propertyImage} />
              <Text style={styles.propertyTitle}>{item.title}</Text>
              <Text style={styles.propertyLocation}>{item.location}</Text>
              <Text style={styles.propertyDetails}>{item.details}</Text>
              <TouchableOpacity
                style={styles.seeButton}
                onPress={() => navigation.navigate('PropertyDetails', {property: item})}
              >
                <Text style={styles.seeButtonText}>See</Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  headingContainer: {
    backgroundColor: '#2ecc71',
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
    color: '#2ecc71',
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  newPropsContainer: {
    marginVertical: 16,
    paddingBottom: 2
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
    color: '#3498db',
    fontWeight: 'bold',
  },
  propertyCard: {
    width: width / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    elevation: 3,
    padding: 10,
    height: 280,
    justifyContent: 'space-between',
  },
  propertyImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  propertyLocation: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  propertyDetails: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  seeButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  seeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
});
