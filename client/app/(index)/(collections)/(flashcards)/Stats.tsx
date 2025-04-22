import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Stats() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Statistics</ThemedText>
      <ThemedText>View your learning progress here</ThemedText>
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
