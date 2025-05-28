import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

// Create a client
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Configure notifications
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="admin/dashboard" options={{ headerShown: true, title: "Admin Portal" }} />
          <Stack.Screen name="admin/members" options={{ headerShown: true, title: "Manage Members" }} />
          <Stack.Screen name="admin/pending-members" options={{ headerShown: true, title: "Pending Members" }} />
          <Stack.Screen name="admin/alerts" options={{ headerShown: true, title: "Manage Alerts" }} />
          <Stack.Screen name="admin/events" options={{ headerShown: true, title: "Manage Events" }} />
          <Stack.Screen name="admin/create-alert" options={{ headerShown: true, title: "Create Alert" }} />
          <Stack.Screen name="admin/create-event" options={{ headerShown: true, title: "Create Event" }} />
          <Stack.Screen name="admin/member-details" options={{ headerShown: true, title: "Member Details" }} />
          <Stack.Screen name="admin/add-member" options={{ headerShown: true, title: "Add Member" }} />
          <Stack.Screen name="admin/edit-alert" options={{ headerShown: true, title: "Edit Alert" }} />
          <Stack.Screen name="activation-status" options={{ headerShown: true, title: "Activation Status" }} />
          <Stack.Screen name="alert-details" options={{ headerShown: true, title: "Alert Details" }} />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}