import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView, ThemedView } from "@/components/ThemedView";
import FlashcardHeader from "@/components/ui/FlashcardHeader";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import { useStateStore } from "@/stores/StateManagement";
import { useTable } from "tinybase/ui-react";
import { useDeckStoreId } from "@/stores/deckStore";

export default function Cards() {
  const { deckId } = useStateStore()
  const cards = useTable("cards", useDeckStoreId(deckId));

  return (
    <View style={styles.container}>
      <FlashcardHeader title="Flashcards" deckId={deckId} />

      <ThemedView style={styles.content}>
        <ThemedScrollView style={styles.cards}>
          {cards && Object.entries(cards).map(([key, card]) => (
            <ThemedView key={key} style={{ marginBottom: 16 }}>
              <ThemedText>{card.front}</ThemedText>
              <ThemedText>{card.back}</ThemedText>
            </ThemedView>
          ))}
        </ThemedScrollView >
        <Button variant="primary" onPress={() => { router.push("/(app)/(flashcards)/(cards)/createCard") }} style={styles.addCard}>Add Card</Button>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    flexDirection: "column",
  },
  addCard: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
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

});
