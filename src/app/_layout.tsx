import { Stack } from 'expo-router';
import { AppStateProvider } from '../context/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppStateProvider>
  );
}
