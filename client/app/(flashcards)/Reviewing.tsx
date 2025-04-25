import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import { router } from "expo-router";

export default function Reviewing() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Reviewing Mode</ThemedText>
      <ThemedText style={styles.subtitle}>
        Notice that the tab bar is hidden in this screen
      </ThemedText>

      <Button onPress={() => router.back()} style={styles.button}>
        Go Back
      </Button>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    width: 200,
    marginTop: 20,
  },
});
