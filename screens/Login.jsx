import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Validation Error', 'Email and password are required.');
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      'http://192.168.250.129:8000/api/sanctum/token',
      {
        email,
        password,
        device_name: 'mobile', // required by Laravel Sanctum
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const token = response.data.token;

    // Save token in AsyncStorage
    await AsyncStorage.setItem('authToken', token);

    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    Alert.alert('Login Successful');
    navigation.replace('MainApp');

  } catch (error) {
    console.error(error);
    Alert.alert(
      'Login Failed',
      error.response?.data?.message || 'Something went wrong.'
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6B7280"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B7931',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#EFF6EE',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    color: '#1F2937',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#E5BC2B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
