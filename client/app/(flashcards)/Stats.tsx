import React from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedView";
import FlashcardHeader from "@/components/ui/FlashcardHeader";

export default function Stats() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  
  return (
    <View style={styles.container}>
      <FlashcardHeader title="Statistics" deckId={deckId} />
      
      <ThemedScrollView style={styles.content}>
        <ThemedText type="title">Statistics</ThemedText>
        <ThemedText>View your learning progress here</ThemedText>
      </ThemedScrollView>
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
