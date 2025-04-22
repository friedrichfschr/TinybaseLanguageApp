import { Stack } from "expo-router";
import { usePathname } from "expo-router";

export default function FlashcardsLayout() {
  const pathname = usePathname();

  // Determine if the current screen should hide header
  const shouldHideHeader =
    pathname?.includes("/reviewing") || pathname?.includes("/Reviewing");

  return (
    <Stack
      screenOptions={{
        headerShown: !shouldHideHeader,
        ...(process.env.EXPO_OS !== "ios"
          ? {}
          : {
              headerLargeTitle: true,
              headerTransparent: true,
              headerBlurEffect: "systemChromeMaterial",
              headerLargeTitleShadowVisible: false,
              headerShadowVisible: true,
              headerLargeStyle: {
                backgroundColor: "transparent",
              },
            }),
      }}
    >
      <Stack.Screen
        name="cards"
        options={{
          headerTitle: "Cards",
        }}
      />
      <Stack.Screen
        name="reviewOptions"
        options={{
          headerTitle: "Review Options",
        }}
      />
      <Stack.Screen
        name="stats"
        options={{
          headerTitle: "Statistics",
        }}
      />
      <Stack.Screen
        name="DeckSettings"
        options={{
          headerTitle: "Deck Settings",
        }}
      />
      <Stack.Screen
        name="reviewing"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </Stack>
  );
}
