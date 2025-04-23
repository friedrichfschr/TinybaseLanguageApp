import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FlashcardHeader from "@/components/ui/FlashcardHeader";
import Button from "@/components/ui/button";
import { router } from "expo-router";

export default function Cards() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  
  return (
    <View style={styles.container}>
      <FlashcardHeader title="Flashcards" deckId={deckId} />
      
      <ThemedView style={styles.content}>
        <ThemedText type="title" variant="primary">
          Flashcards
        </ThemedText>
        
        <ThemedText style={styles.description}>
          Add and manage your flashcards here
        </ThemedText>
        
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
    alignItems: "center",
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  reviewButton: {
    width: 200,
    marginTop: 20,
  },
});
