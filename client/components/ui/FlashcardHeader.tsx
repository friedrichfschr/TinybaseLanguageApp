import React from "react";
import { StyleSheet, View } from "react-native";
import { ExternalPathString, RelativePathString, router, usePathname } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface FlashcardHeaderProps {
  title: string;
  deckId?: string;
  backFunction?: any;
}

export default function FlashcardHeader({ title, deckId, backFunction=()=>router.push("/(index)/(collections)/decks")}: FlashcardHeaderProps) {
  const pathname = usePathname();
  
  const hideSettingsButton = pathname?.includes("/DeckSettings")

  const handleBackPress = () => {
    backFunction()
  };
  
  const handleSettingsPress = () => {
    if (deckId) {
      router.push(`/(flashcards)/DeckSettings`);
    } else {
      router.push("/(flashcards)/DeckSettings");
    }
  };

  return (
    <ThemedSafeAreaView >
      <View style={styles.header}>
        <Button 
          variant="ghost" 
          onPress={handleBackPress} 
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-back" size={24} />
        </Button>
        
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        
        {!hideSettingsButton && <Button 
          variant="ghost" 
          onPress={handleSettingsPress} 
          style={styles.iconButton}
        >
          <MaterialIcons name="settings" size={24} />
        </Button>}
      </View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: "100%",
  },
  title: {
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});