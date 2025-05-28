import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import colors from '@/constants/colors';

export default function AdminIndexScreen() {
  const { hasAdminRole } = useAuthStore();

  useEffect(() => {
    // Check if user has admin role
    if (hasAdminRole()) {
      // Redirect to dashboard
      router.replace('/admin/dashboard');
    } else {
      // Redirect to admin tab which has password protection
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this area directly.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/admin') }]
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});