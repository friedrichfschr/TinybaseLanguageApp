import { SignedIn, useClerk } from "@clerk/clerk-expo";
import { Redirect, Stack, usePathname } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import UserStore from "@/stores/UserStore";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Inspector } from "tinybase/ui-react-inspector";

export default function AppLayout() {
  const { user } = useClerk();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  const pathname = usePathname();

  const inFlashcardsRoute = pathname.includes("(flashcards)");

  UserStore();
  const isDarkTheme = useColorScheme() === "dark";
  return (
    <SignedIn>
      <Tabs>
        <TabSlot />
        <TabList
          style={{
            paddingBottom: 30,
            paddingHorizontal: 30,
            backgroundColor: useThemeColor({}, "background"),
          }}
        >
          <TabTrigger name="Books" href="/(index)/Books" style={styles.mainTab}>
            <Text>Books</Text>
          </TabTrigger>
          <TabTrigger
            name="decks"
            href="/(index)/(collections)/decks"
            style={styles.mainTab}
          >
            <Text>Collections</Text>
          </TabTrigger>
          <TabTrigger
            name="Profile"
            href="/(index)/Profile"
            style={styles.mainTab}
          >
            <MaterialIcons name="person" size={30} />
          </TabTrigger>
        </TabList>
      </Tabs>
      {process.env.EXPO_OS === "web" ? <Inspector /> : null}
    </SignedIn>
  );
}

const styles = StyleSheet.create({
  mainTab: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "red",
  },
  FlashcardTab: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "blue",
  },
});
