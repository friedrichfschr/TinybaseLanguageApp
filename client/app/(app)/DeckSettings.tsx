import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedView";
import { router, usePathname } from "expo-router";
import FlashcardHeader from "@/components/ui/FlashcardHeader";
import { useStateStore } from "@/stores/StateManagement";


export default function Settings() {
  const deckId = useStateStore().deckId;
  const pathname = usePathname();
  return (
    <ThemedScrollView style={styles.container}>
      <FlashcardHeader title="Settings" deckId={deckId} backFunction={router.back} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
