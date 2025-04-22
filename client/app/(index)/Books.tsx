import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedScrollView } from "@/components/ThemedView";

export default function Books() {
  return (
    <ThemedView style={styles.container}>
      <ThemedScrollView style={styles.scrollView}>
        <ThemedText type="title">Books</ThemedText>
        <ThemedText>Default text color (base)</ThemedText>

        {/* Showcase all the text color variants */}
        <ThemedText variant="primary" style={styles.spacer}>
          Primary text color
        </ThemedText>

        <ThemedText variant="secondary" style={styles.spacer}>
          Secondary text color
        </ThemedText>

        <ThemedText variant="muted" style={styles.spacer}>
          Muted text color
        </ThemedText>

        <ThemedText variant="disabled" style={styles.spacer}>
          Disabled text color
        </ThemedText>

        <ThemedText variant="error" style={styles.spacer}>
          Error text color
        </ThemedText>

        <ThemedText variant="success" style={styles.spacer}>
          Success text color
        </ThemedText>

        {/* Showcase combined style and color variants */}
        <ThemedText type="subtitle" variant="primary" style={styles.spacer}>
          Subtitle with primary color
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          variant="error"
          style={styles.spacer}
        >
          Semi-bold error message
        </ThemedText>

        <ThemedText type="link" variant="primary" style={styles.spacer}>
          Link style with primary color
        </ThemedText>
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  spacer: {
    marginTop: 16,
  },
});
