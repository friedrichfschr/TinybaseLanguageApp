import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  ThemedSafeAreaView,
  ThemedView,
  ThemedScrollView,
} from "@/components/ThemedView";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDeckIDs } from "@/stores/UserStore";
import DeckTab from "@/components/ui/DeckTab";

export default function Decks() {
  const deckIds = useDeckIDs();

  const handleCreateDeck = () => {
    router.push("/(index)/(collections)/createDeck");
  };

  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" variant="primary">
          My Collections
        </ThemedText>
        <Button variant="outline" onPress={handleCreateDeck}>
          <MaterialIcons name="create-new-folder" size={24} />
        </Button>
      </ThemedView>

      <ThemedScrollView style={styles.scrollView}>
        {deckIds && deckIds.length > 0 ? (
          deckIds.map((deckId) => <DeckTab key={deckId} deckId={deckId} />)
        ) : (
          <ThemedView style={styles.emptyState}>
            <MaterialIcons name="library-books" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              You don't have any decks yet
            </ThemedText>
            <ThemedText variant="muted" style={styles.emptySubtext}>
              Create your first deck to get started
            </ThemedText>
          </ThemedView>
        )}
      </ThemedScrollView>

      <Button
        onPress={handleCreateDeck}
        style={styles.footerButton}
        variant="primary"
      >
        Create New Deck
      </Button>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: "center",
  },
  footerButton: {
    width: 200,
    alignSelf: "center",
    marginBottom: 16,
  },
});
