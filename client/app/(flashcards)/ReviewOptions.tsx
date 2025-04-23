import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FlashcardHeader from "@/components/ui/FlashcardHeader";

export default function ReviewOptions() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  
  return (
    <View style={styles.container}>
      <FlashcardHeader title="Review Options" deckId={deckId} />
      
      <ThemedView style={styles.content}>
        <ThemedText type="title">Review Options</ThemedText>
        <ThemedText>Configure your review settings here</ThemedText>
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
});
