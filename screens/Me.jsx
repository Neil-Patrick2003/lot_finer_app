import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Me() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  const accountStats = [
    { label: 'Active Listings', value: '23' },
    { label: 'Clients Served', value: '47' },
    { label: 'Properties Sold', value: '12' },
  ];

  const menuItems = [
    { id: '1', title: 'Edit Profile', action: () => navigation.navigate('EditProfile') },
    { id: '2', title: 'Saved Properties', action: () => navigation.navigate('SavedProperties') },
    { id: '3', title: 'My Inquiries', action: () => navigation.navigate('Inquiries') },
    { id: '4', title: 'Notifications', action: () => navigation.navigate('Notifications') },
    { id: '5', title: 'Privacy Policy', action: () => navigation.navigate('Privacy') },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch authenticated user
          const userRes = await axios.get('http://192.168.0.109/api/agent/user');
          setUserName(userRes.data.name);

          // Fetch properties
     
        }
      } catch (error) {
        console.error('Error loading user or properties:', error);
      }
    };

    fetchData();
  }, []);


  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              if (token) {
                await axios.post(
                  'http://192.168.254.106:8000/api/logout',
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: 'application/json',
                    },
                  }
                );
              }
              await AsyncStorage.removeItem('authToken');
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Logout Failed', 'Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{userName || 'Agent'}</Text>
        <Text style={styles.userEmail}>22-71596@g.batstate-u.edu.ph</Text>
        <Text style={styles.membershipBadge}>Agent</Text>
      </View>

      {/* Account Statistics */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsContainer}>
          {accountStats.map((stat, index) => (
            <View
              key={index}
              style={[
                styles.statCard,
                index < accountStats.length - 1 && styles.statCardBorder,
              ]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Listed Modern Villa</Text>
              <Text style={styles.activityLocation}>Los Angeles, CA</Text>
            </View>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Client Meeting Scheduled</Text>
              <Text style={styles.activityLocation}>Miami, FL</Text>
            </View>
            <Text style={styles.activityTime}>1d ago</Text>
          </View>
          <View style={[styles.activityItem, styles.lastActivityItem]}>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Property Sold</Text>
              <Text style={styles.activityLocation}>City Apartment, NY</Text>
            </View>
            <Text style={styles.activityTime}>2d ago</Text>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutSection}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>MJVI Realty • Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 17,
    color: '#8e8e93',
    marginBottom: 12,
  },
  membershipBadge: {
    backgroundColor: '#5B7931',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
    marginLeft: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statCardBorder: {
    borderRightWidth: 0.5,
    borderRightColor: '#d1d1d6',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B7931',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#8e8e93',
    textAlign: 'center',
    fontWeight: '500',
  },
  menuSection: {
    marginBottom: 32,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d1d6',
    minHeight: 56,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuTitle: {
    fontSize: 17,
    color: '#1c1c1e',
    fontWeight: '400',
  },
  menuArrow: {
    fontSize: 20,
    color: '#c7c7cc',
    fontWeight: '300',
  },
  activitySection: {
    marginBottom: 32,
  },
  activityContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d1d6',
    minHeight: 64,
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: '#1c1c1e',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 14,
    color: '#8e8e93',
  },
  activityTime: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '400',
  },
  signOutSection: {
    marginBottom: 32,
  },
  signOutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#ff3b30',
    fontSize: 17,
    fontWeight: '400',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  versionText: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '400',
  },
});
