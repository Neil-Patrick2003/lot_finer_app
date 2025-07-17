import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CustomDrawerContent(props) {
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await axios.post('http://192.168.254.106:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await AsyncStorage.removeItem('authToken');
      props.navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'Please try again.');
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* 🔴 Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#E53935',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
