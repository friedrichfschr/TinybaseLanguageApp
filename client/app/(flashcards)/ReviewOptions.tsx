import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FlashcardHeader from "@/components/ui/FlashcardHeader";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import { useStateStore } from "@/stores/StateManagement";

export default function ReviewOptions() {
const { deckId } = useStateStore();  
  return (
    <View style={styles.container}>
      <FlashcardHeader title="Review Options" deckId={deckId} />
      
      <ThemedView style={styles.content}>

        <Button
                  variant="primary"
                  style={styles.reviewButton}
                  onPress={() => router.push(`/(flashcards)/Reviewing?deckId=${deckId}`)}
                >
                  Start Review
                </Button>
      </ThemedView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  reviewButton: {
    width: 200,
    marginTop: 20,
    alignSelf: "center",
  },
});
