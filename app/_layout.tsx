import { Slot, useRouter, useSegments, useRootNavigation } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import 'react-native-reanimated';

const InitialLayout = () => {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigation = useRootNavigation();
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    if (navigation) {
      setNavigationReady(true);
    }
  }, [navigation]);

  useEffect(() => {
    if (!navigationReady) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (user && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!user && inTabsGroup) {
      router.replace('/auth');
    }
  }, [user, segments, navigationReady]);

  return <Slot />;
}

export default function RootLayout() {

  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <StatusBar style="light" />
        <InitialLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}