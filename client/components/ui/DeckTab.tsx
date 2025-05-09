import {
  View,
  StyleSheet,
  Alert,
  Pressable,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  useMetric,
  useMetricListener,
  useMetrics,
  useValues,
} from "tinybase/ui-react";
import { useDeckStoreId } from "@/stores/deckStore";
import { useDelDeckCallback } from "@/stores/UserStore";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useStateStore } from "@/stores/StateManagement";
import { useThemeColor } from "@/hooks/useThemeColor";
import ModalDropdown from "react-native-modal-dropdown";

type DeckTabProps = {
  deckId: string;
};

const DeckTab = ({ deckId }: DeckTabProps) => {
  const colorScheme = useColorScheme();
  const deleteDeck = useDelDeckCallback();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmDeckName, setConfirmDeckName] = useState("");

  // Create a ref to the dropdown menu
  const dropdownRef = useRef<ModalDropdown>(null);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error") || "#ff3b30";

  const deckStoreId = useDeckStoreId(deckId);
  const deckValues = useValues(deckStoreId);
  const deckName = deckValues?.name || "Unnamed Deck";

  const { setDeckId } = useStateStore();

  const deckMetrics = useMetrics(deckStoreId);

  // Get the number of cards in the deck (placeholder for now)
  const cardsCount = deckMetrics?.getMetric("cardsCount"); // This can be updated when implementing cards
  const dueCardsCount = deckMetrics?.getMetric("dueCardsCount");
  const handleEditDeck = () => {
    // Navigate to edit deck (can be implemented later)
    console.log("Edit deck:", deckId);
  };

  const handleReviewDeck = () => {
    // Navigate to review/flashcards for this deck
    setDeckId(deckId);
    router.push("/(app)/Reviewing");
  };

  // Menu options
  const menuOptions = ["Edit", "Delete"];

  const handleMenuSelect = (index: number, option: string) => {
    // First, hide the dropdown menu
    if (dropdownRef.current) {
      dropdownRef.current.hide();
    }

    // Then, after a small delay to ensure dropdown is closed, handle the action
    setTimeout(() => {
      if (option === "Edit") {
        handleEditDeck();
      } else if (option === "Delete") {
        setDeleteModalVisible(true);
      }
    }, 150);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeckName === deckName) {
      deleteDeck(deckId);
      setDeleteModalVisible(false);
      setConfirmDeckName("");
    } else {
      Alert.alert("Error", "Deck name doesn't match");
    }
  };

  const deckColor =
    typeof deckValues?.color === "string" ? deckValues.color : "#0a7ea4";

  const deckItemStyle = {
    ...styles.deckItem,
    backgroundColor: deckColor,
    ...(colorScheme === "dark" && { opacity: 0.85 }),
  };

  // Custom dropdown row renderer with proper key handling
  const renderDropdownRow = (
    option: string,
    index: number,
    isSelected: boolean
  ) => {
    const isDelete = option === "Delete";
    const iconName = isDelete ? "delete" : "edit";
    const iconColor = isDelete ? errorColor : "white";

    return (
      <View style={styles.dropdownRow}>
        <MaterialIcons
          name={iconName}
          size={20}
          color={iconColor}
          style={styles.menuIcon}
        />
        <ThemedText style={{ color: isDelete ? errorColor : "white" }}>
          {option}
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={deckItemStyle}>
      <View style={styles.deckInfo}>
        <Pressable
          onPress={() => {
            router.push(`/(app)/(flashcards)/cards`);
            setDeckId(deckId);
          }}
          style={({ pressed }) => [
            styles.pressable,
            pressed && { opacity: 0.7 },
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.deckName}>
            {deckName}
          </ThemedText>
          <ThemedText variant="muted" style={styles.deckCount}>
            {cardsCount || 0} cards
          </ThemedText>
        </Pressable>
      </View>

      {dueCardsCount > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.reviewButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleReviewDeck}
        >
          <MaterialIcons name="play-arrow" color="white" size={28} />
          <ThemedText variant="muted" style={{ ...styles.deckCount }}>
            {`${dueCardsCount} due`}
          </ThemedText>
        </Pressable>
      )}

      <ModalDropdown
        ref={dropdownRef}
        options={menuOptions}
        onSelect={handleMenuSelect}
        renderRow={renderDropdownRow}
        style={styles.dropdownButton}
        dropdownStyle={styles.dropdownContainer}
        dropdownTextStyle={styles.dropdownText}
        adjustFrame={(style) => {
          const newStyle = { ...style };
          newStyle.top -= 5;
          newStyle.right -= 10;
          return newStyle;
        }}
      >
        <MaterialIcons name="more-horiz" color="white" size={28} />
      </ModalDropdown>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setDeleteModalVisible(false);
          setConfirmDeckName("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText style={styles.modalTitle}>Delete Deck</ThemedText>
            <ThemedText style={styles.modalText}>
              This will permanently delete this deck and all its cards. Please
              type the deck name to confirm.
            </ThemedText>

            <View style={styles.deckNameContainer}>
              <ThemedText style={styles.deckNameDisplay}>{deckName}</ThemedText>
            </View>

            <TextInput
              value={confirmDeckName}
              onChangeText={setConfirmDeckName}
              placeholder="Type deck name to confirm"
              placeholderTextColor="#999"
              style={[styles.textInput, { color: textColor }]}
              autoCapitalize="none"
            />

            <View style={styles.modalButtonContainer}>
              <Button
                children="Cancel"
                onPress={() => {
                  setDeleteModalVisible(false);
                  setConfirmDeckName("");
                }}
                style={styles.modalButton}
                variant="secondary"
              />
              <Button
                children="Delete"
                onPress={handleDeleteConfirm}
                style={styles.modalButton}
                variant="accent"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ...existing styles...
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  deckInfo: {
    flex: 1,
  },
  pressable: {
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
  reviewButton: {
    padding: 8,
    marginRight: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  // Dropdown styles
  dropdownButton: {
    padding: 8,
  },
  dropdownContainer: {
    width: 150,
    height: "auto",
    borderRadius: 8,
    backgroundColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownText: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuIcon: {
    marginRight: 12,
  },

  // Modal styles remaining the same
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: Platform.OS === "web" ? 400 : "90%",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  deckNameContainer: {
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  deckNameDisplay: {
    fontSize: 18,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default DeckTab;
