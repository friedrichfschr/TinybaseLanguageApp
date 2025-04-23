import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";

export default function Cards() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText>Manage your flashcards here</ThemedText>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
