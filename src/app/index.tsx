import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppState } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { Text } from '../components/ui/Text';

export default function Index() {
  const { user, loading } = useAppState();

  // If restoring session state from AsyncStorage, show a premium loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Restoring session...</Text>
      </View>
    );
  }

  // If no user profile exists, route straight to onboarding
  if (!user) {
    return <Redirect href="/register" />;
  }

  // If session is validated, enter dashboard tabs
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});
