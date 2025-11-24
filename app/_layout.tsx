import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/skin-type" />
        <Stack.Screen name="onboarding/concerns" />
        <Stack.Screen name="home" />
        <Stack.Screen name="skin-check" />
        <Stack.Screen name="skin-results" />
        <Stack.Screen name="scan-products" />
        <Stack.Screen name="routine-results" />
        <Stack.Screen name="products" />
        <Stack.Screen name="routines" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
