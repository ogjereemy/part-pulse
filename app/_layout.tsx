import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';
// import { SocketProvider } from '@/context/SocketContext'; // Assuming SocketProvider will be created

import { registerUploadTask } from '@/tasks/uploadTask';

const queryClient = new QueryClient();

registerUploadTask();

const InitialLayout = () => {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!initialized) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (user && !inTabsGroup) {
      router.replace('/(tabs)/home');
    } else if (!user) {
      router.replace('/auth');
    }
  }, [user, initialized, segments, router]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* <SocketProvider> */}
          {/* NativeWind ThemeProvider would go here */}
          <ThemeProvider value={DarkTheme}>
            <StatusBar style="light" />
            <InitialLayout />
          </ThemeProvider>
        {/* </SocketProvider> */}
      </QueryClientProvider>
    </AuthProvider>
  );
}