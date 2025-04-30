import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ThemedScrollView, ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { router, Stack } from "expo-router";
import TextInput from "@/components/ui/text-input";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAddDeckCallback } from "@/stores/UserStore";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

const COLOR_OPTIONS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Green", value: "#10b981" },
  { name: "Blue", value: "#0a7ea4" },
  { name: "Purple", value: "#6366f1" },
  { name: "Pink", value: "#ec4899" },
];

const CreateDeck = () => {
  const [deckName, setDeckName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const addDeck = useAddDeckCallback();

  const handleSave = () => {
    if (deckName.trim() === "") return;

    // Provide haptic feedback on save
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Add deck to store
    addDeck(deckName, selectedColor, "");

    // Navigate back to decks screen
    router.push("/(index)/(collections)/decks");
  };

  const handleCancel = () => {
    router.dismiss();
    router.push("/(index)/(collections)/decks");

  };

  return (
    <>
      <Stack.Screen options={{
        header: () => <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
            height: 50,
          }}
        >
          <Pressable onPress={handleCancel}>
            <ThemedText>Cancel</ThemedText>
          </Pressable>

          <Pressable onPress={handleSave}>
            <ThemedText>Save</ThemedText>
          </Pressable>
        </ThemedView>
      }} />

      <ThemedScrollView style={styles.container}>
        <View style={styles.formSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Create a New Deck
          </ThemedText>

          <TextInput
            label="Deck Name"
            value={deckName}
            onChangeText={setDeckName}
            placeholder="Enter a name for your deck"
            variant="outlined"
          />

          <TextInput
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what this deck is about"
            variant="outlined"
            multiline
            numberOfLines={3}
          />

          <View style={styles.colorSection}>
            <ThemedText style={styles.colorTitle}>Choose a color</ThemedText>
            <View style={styles.colorOptions}>
              {COLOR_OPTIONS.map((color) => {
                const colorButtonStyle = {
                  ...styles.colorButton,
                  backgroundColor: color.value,
                  ...(selectedColor === color.value &&
                    styles.selectedColorButton),
                };

                return (
                  <View key={color.value} style={styles.colorOptionContainer}>
                    <ThemedText style={styles.colorName}>{color.name}</ThemedText>
                    <Button
                      onPress={() => setSelectedColor(color.value)}
                      style={colorButtonStyle}
                    >
                      {selectedColor === color.value && (
                        <MaterialIcons name="check" size={20} color="white" />
                      )}
                    </Button>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ThemedScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  formSection: {
    marginTop: 16,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  colorSection: {
    marginTop: 8,
  },
  colorTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorOptionContainer: {
    alignItems: "center",
    width: "30%",
    marginBottom: 16,
  },
  colorName: {
    marginBottom: 8,
    fontSize: 14,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CreateDeck;
