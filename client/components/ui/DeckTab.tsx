import { View, StyleSheet, Alert, Pressable, Platform } from "react-native";
import React from "react";
import { useRow, useValues } from "tinybase/ui-react";
import DeckStore, { useDeckStoreId } from "@/stores/deckStore";
import { useDelDeckCallback } from "@/stores/UserStore";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useStateStore } from "@/stores/StateManagement";

type DeckTabProps = {
  deckId: string;
};

const DeckTab = ({ deckId }: DeckTabProps) => {
  const colorScheme = useColorScheme();
  const deleteDeck = useDelDeckCallback();

  const deckStoreId = useDeckStoreId(deckId);
  const deckValues = useValues(deckStoreId);

  const { setDeckId } = useStateStore()
  // Initialize the deck store

  // Get the number of cards in the deck (placeholder for now)
  const cardCount = 0; // This can be updated when implementing cards

  const handleEditDeck = () => {
    // Navigate to edit deck (can be implemented later)
    console.log("Edit deck:", deckId);
  };

  const handleReviewDeck = () => {
    // Navigate to review/flashcards for this deck
    setDeckId(deckId)
  };

  const handleDeleteDeck = () => {
    if (Platform.OS === "web") {
      // Use browser confirm dialog for web
      if (window.confirm("Are you sure you want to delete this deck?")) {
        deleteDeck(deckId);
      }
    } else {
      // Use React Native Alert for mobile
      Alert.alert(
        "Delete Deck",
        "Are you sure you want to delete this deck?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              deleteDeck(deckId);
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const deckColor =
    typeof deckValues?.color === "string" ? deckValues.color : "#0a7ea4";

  const deckItemStyle = {
    ...styles.deckItem,
    backgroundColor: deckColor,
    ...(colorScheme === "dark" && { opacity: 0.85 }),
  };

  return (
    <View style={deckItemStyle}>
      <View style={styles.deckInfo}>
        <Pressable
          onPress={() => {
            router.push(`/(app)/(flashcards)/(cards)`);
            setDeckId(deckId);
          }}
          style={({ pressed }) => [
            styles.pressable,
            pressed && { opacity: 0.7 },
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.deckName}>
            {deckValues?.name || "Unnamed Deck"}
          </ThemedText>
          <ThemedText variant="muted" style={styles.deckCount}>
            {cardCount} cards
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          onPress={handleEditDeck}
          style={styles.actionButton}
        >
          {Platform.OS === "web" ? (
            <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
          ) : (
            <MaterialIcons name="edit" size={20} color="white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onPress={handleReviewDeck}
          style={styles.actionButton}
        >
          {Platform.OS === "web" ? (
            <ThemedText style={styles.actionButtonText}>Review</ThemedText>
          ) : (
            <MaterialIcons name="play-arrow" size={20} color="white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onPress={handleDeleteDeck}
          style={styles.actionButton}
        >
          {Platform.OS === "web" ? (
            <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
          ) : (
            <MaterialIcons name="delete" size={20} color="white" />
          )}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deckItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  deckInfo: {
    flex: 1,
  },
  pressable: {
    // Ensure the pressable takes up the whole area
    paddingVertical: 4,
  },
  deckName: {
    marginBottom: 4,
    color: "white",
    fontSize: 18,
  },
  deckCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 4,
    minWidth: Platform.OS === "web" ? 60 : 36,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default DeckTab;
