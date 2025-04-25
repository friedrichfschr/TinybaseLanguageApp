import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";

import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/cache";
import { Provider as TinybaseProvider } from "tinybase/ui-react";

const publisehableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publisehableKey) {
  console.error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TinybaseProvider>
      <ClerkProvider publishableKey={publisehableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen
                name="(index)"
                options={{
                  headerShown: false,
                  animation: "fade",
                }}
              />
              <Stack.Screen
                name="(flashcards)"
                options={{
                  headerShown: false,
                  animation: "slide_from_right"
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                  animation: "slide_from_right"
                }}
                />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </TinybaseProvider>
  );
}
