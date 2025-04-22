import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { Pressable } from "react-native";

const Header = () => {
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        height: 50,
      }}
    >
      <Pressable onPress={() => {}}>
        <ThemedText>Cancel</ThemedText>
      </Pressable>

      <Pressable onPress={() => {}}>
        <ThemedText>Save</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

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
      <Stack.Screen name="(flashcards)" />
      <Stack.Screen
        name="createDeck"
        options={{
          presentation: "modal",
          headerShown: true,
          header: () => <Header />,
        }}
      />
    </Stack>
  );
}
