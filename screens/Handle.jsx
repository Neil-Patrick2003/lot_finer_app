// screens/Handle.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Handle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Handle Screen</Text>
      <Text>This is the Handle tab where you can manage your tasks.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Handle;
