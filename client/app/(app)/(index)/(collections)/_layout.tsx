import { Stack } from "expo-router";

export default function CollectionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
      <Stack.Screen name="decks" />
      <Stack.Screen
        name="createDeck"
        options={{
          presentation: "modal",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
