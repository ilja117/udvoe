import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DialogProvider } from '../dialog';
import { StoreProvider, useStore } from '../store';
import { C } from '../theme';

function Nav() {
  const { ready } = useStore();
  if (!ready) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right' }} />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <DialogProvider>
          <StatusBar style="light" />
          <Nav />
        </DialogProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
