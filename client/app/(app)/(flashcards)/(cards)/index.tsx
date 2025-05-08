import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, TextInput as RNTextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FlashcardHeader from "@/components/ui/FlashcardHeader";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import { useStateStore } from "@/stores/StateManagement";
import { useTable } from "tinybase/ui-react";
import { useDeckStoreId } from "@/stores/deckStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence, useSharedValue } from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function Cards() {
  const { deckId } = useStateStore();
  const allCards = useTable("cards", useDeckStoreId(deckId));
  const [searchQuery, setSearchQuery] = useState("");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textMuted = useThemeColor({}, "textMuted");
  const backgroundColor = useThemeColor({}, "background");
  const primaryThemeColor = useThemeColor({}, "primary");
  // For animated dots
  const [dotsText, setDotsText] = useState(".");
  const [inputFocused, setInputFocused] = useState(false);
  const [filteredCards, setFilteredCards] = useState(allCards);
  // Setup dot animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDotsText(prev => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = Object.entries(allCards).filter(([key, card]) => {
      const frontMatch = card.front.toLowerCase().includes(query.toLowerCase());
      const backMatch = card.back.toLowerCase().includes(query.toLowerCase());
      return frontMatch || backMatch;
    });
    setFilteredCards(Object.fromEntries(filtered));
  }

  return (
    <View style={styles.container}>
      <FlashcardHeader title="Flashcards" deckId={deckId} />

      <ThemedView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            {
              borderColor: inputFocused ? primaryThemeColor : borderColor,
              backgroundColor,
              borderWidth: 1
            }
          ]}>
            <RNTextInput
              style={[
                styles.searchInputField,
                {
                  color: textColor,
                  borderWidth: 0, // Remove any default border
                  outline: "none",
                }
              ]}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder={`Search${dotsText}`}
              placeholderTextColor={textMuted}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}

            />
            <MaterialIcons
              name="search"
              size={20}
              color={inputFocused ? primaryThemeColor : textMuted}
              style={styles.searchIcon}
            />
          </View>
        </View>

        <ScrollView style={styles.cards}>
          {filteredCards && Object.entries(filteredCards).map(([key, card]) => (
            <View key={key} style={{ flex: 1, flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", borderColor: borderColor, borderBottomWidth: 1 }}>
              <View>
                <ThemedText>{card.front}</ThemedText>
                <ThemedText>{card.back}</ThemedText>
              </View>

            </View>
          ))}
        </ScrollView>
        <Button variant="primary" onPress={() => { router.push("/(app)/(flashcards)/(cards)/createCard") }} style={styles.addCard}>Add Card</Button>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  addCard: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: "center",
    width: "100%",
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  searchContainer: {
    width: "100%",
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
  },
  searchInputField: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  searchIcon: {
    marginLeft: 10,
  },
});
