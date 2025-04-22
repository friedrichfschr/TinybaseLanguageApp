import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Cards() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cards</ThemedText>
      <ThemedText>Manage your flashcards here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
