import { View, StyleSheet, Alert, Pressable } from "react-native";
import React from "react";
import { useRow } from "tinybase/ui-react";
import DeckStore from "@/stores/deckStore";
import { useDelDeckCallback, useUserStoreId } from "@/stores/UserStore";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";

type DeckTabProps = {
  deckId: string;
};

const DeckTab = ({ deckId }: DeckTabProps) => {
  const userStoreId = useUserStoreId();
  const deckData = useRow("decks", deckId, userStoreId);
  const colorScheme = useColorScheme();
  const deleteDeck = useDelDeckCallback();

  // Initialize the deck store
  const deckStore = DeckStore(
    deckId,
    deckData?.name as string,
    deckData?.color as string,
    deckData?.folderId as string
  );

  // Get the number of cards in the deck (placeholder for now)
  const cardCount = 0; // This can be updated when implementing cards

  const handleEditDeck = () => {
    // Navigate to edit deck (can be implemented later)
    console.log("Edit deck:", deckId);
  };

  const handleDeleteDeck = () => {
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
  };

  const deckColor =
    typeof deckData?.color === "string" ? deckData.color : "#0a7ea4";

  const deckItemStyle = {
    ...styles.deckItem,
    backgroundColor: deckColor,
    ...(colorScheme === "dark" && { opacity: 0.85 }),
  };

  return (
    <Pressable
      style={deckItemStyle}
      onPress={() => {
        router.push(
          `/(index)/(collections)/(flashcards)/Cards?deckId=${deckId}`
        );
      }}
    >
      <ThemedView style={styles.deckInfo}>
        <ThemedText type="defaultSemiBold" style={styles.deckName}>
          {deckData?.name || "Unnamed Deck"}
        </ThemedText>
        <ThemedText variant="muted" style={styles.deckCount}>
          {cardCount} cards
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          onPress={handleEditDeck}
          style={styles.actionButton}
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onPress={() => {}}
          style={styles.actionButton}
        >
          <MaterialIcons name="play-arrow" size={20} color="white" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onPress={handleDeleteDeck}
          style={styles.actionButton}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </Button>
      </ThemedView>
    </Pressable>
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
  },
});

export default DeckTab;
