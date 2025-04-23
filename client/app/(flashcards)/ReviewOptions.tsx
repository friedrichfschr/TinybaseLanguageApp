import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";

export default function ReviewOptions() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title">Review Options</ThemedText>
      <ThemedText>Configure your review settings here</ThemedText>
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
