// Me/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://192.168.250.129:8000'; // No port for default port 80
const API_PREFIX = '/api/agent';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch user data from the API
          const userRes = await axios.get(`${API_BASE_URL}${API_PREFIX}/user`);
          setName(userRes.data.name); // Set the name
          setEmail(userRes.data.email); // Set the email
        }
      } catch (error) {
        console.error('Error loading user:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchData();
  }, []);

  const handleSave = () => {
    // Here you would typically send the updated data to your API
    Alert.alert('Profile Updated', `Name: ${name}\nEmail: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#A9A9A9"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F8', // Light background for iOS style
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#D1D1D6',
    borderWidth: 1,
    borderRadius: 10, // Rounded corners for a softer look
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#5B7931', // Updated to the specified green color
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    width: '100%', // Full width button
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', // Center the text
  },
});

export default EditProfile;
