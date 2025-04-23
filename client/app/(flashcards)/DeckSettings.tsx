import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import FlashcardHeader from "@/components/ui/FlashcardHeader";

interface SettingsProps {
    deckId: string;
    }

export default function Settings({deckId}: SettingsProps) {
  return (
    <ThemedSafeAreaView style={styles.container}>
        <FlashcardHeader title="Settings" deckId={deckId} backFunction={router.back}/>
    </ThemedSafeAreaView>
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
