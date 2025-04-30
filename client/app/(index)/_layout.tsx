import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SignedIn, useClerk } from "@clerk/clerk-expo";

import { useColorScheme } from "@/hooks/useColorScheme";
import UserStore from "@/stores/UserStore";

const publisehableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publisehableKey) {
  console.error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user } = useClerk();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <SignedIn>
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

      </Stack>
      <StatusBar style="auto" />
      <UserStore />
    </SignedIn>
  );
}
