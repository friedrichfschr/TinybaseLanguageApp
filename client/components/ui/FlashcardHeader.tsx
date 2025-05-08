import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { router, usePathname } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useValue } from "tinybase/ui-react";
import { useDeckStoreId } from "@/stores/deckStore";
import { useStateStore } from "@/stores/StateManagement";
import { useThemeColor } from "@/hooks/useThemeColor";



interface FlashcardHeaderProps {
  title: string;
  deckId?: string;
  backFunction?: any;
}

export default function FlashcardHeader({ title, deckId, backFunction = () => {
  router.push("/(app)/(index)/(collections)/decks")
  useStateStore.getState().setDeckId("")
} }: FlashcardHeaderProps) {
  const pathname = usePathname();
  const deckColor = useValue("color", useDeckStoreId(deckId)) as string;

  const hideSettingsButton = pathname?.includes("/DeckSettings")



  const handleBackPress = () => {
    backFunction()
  };

  const handleSettingsPress = () => {
    router.navigate(`/(app)/DeckSettings`);

  };

  return (
    <View style={{ ...styles.header, backgroundColor: deckColor }}>
      <Button
        variant="ghost"
        onPress={handleBackPress}
      >
        <MaterialIcons name="arrow-back" size={24} color={"white"} />
      </Button>

      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <Button
        variant="ghost"
        onPress={handleSettingsPress}
        disabled={hideSettingsButton}
      >
        <MaterialIcons name="settings" size={24} color={hideSettingsButton ? deckColor : "white"} />
      </Button>
    </View>
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
    paddingTop: Platform.OS === "android" ? 40 : Platform.OS === "ios" ? 50 : 5,

  },
  title: {
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});