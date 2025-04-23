import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView, ThemedView } from "@/components/ThemedView";

export default function Stats() {
  return (
    <ThemedScrollView style={styles.container}>
      <ThemedText type="title">Statistics</ThemedText>
      <ThemedText>View your learning progress here</ThemedText>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
