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
import axiosInstance, { API_ENDPOINTS } from '../Helper/axiosConfig';

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

      // 1. Make login request using axiosInstance
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH,
        {
          email,
          password,
          device_name: 'mobile',
        }
        // No need for headers - they're set in axiosConfig
      );

      // 2. Save the received token
      const token = response.data.token;
      await AsyncStorage.setItem('authToken', token);

      // 3. No need to manually set axios headers - interceptor handles this
      // The interceptor in axiosConfig will automatically use this token
      // for all subsequent requests

      Alert.alert('Login Successful');
      navigation.replace('MainApp');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid email or password'
      );
      
      // Clear token on failed login (optional)
      await AsyncStorage.removeItem('authToken');
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
        style={[styles.loginButton, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
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
  disabledButton: {
    opacity: 0.6,
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});