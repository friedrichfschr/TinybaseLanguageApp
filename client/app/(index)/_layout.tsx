import { Tabs } from "expo-router/tabs";
import { StyleSheet } from "react-native";
import { SignedIn, useClerk } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Inspector } from "tinybase/ui-react-inspector";
import UserStore from "@/stores/UserStore";

export default function AppLayout() {
  const { user } = useClerk();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  // Get theme colors for tabs
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "textMuted");

  // Define tab bar styles for consistency
  const screenOptions = {
    tabBarStyle: {
      backgroundColor,
      borderTopWidth: 1,
      borderTopColor: "rgba(0, 0, 0, 0.1)",
      paddingTop: 8,
      paddingBottom: 8,
      height: 60,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    tabBarActiveTintColor: primaryColor,
    tabBarInactiveTintColor: mutedColor,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: 500,
      marginTop: 2,
    },
    headerShown: false,
  };

  return (
    <SignedIn>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="Books"
          options={{
            title: "Books",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="menu-book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(collections)"
          options={{
            title: "Collections",
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name="collections-bookmark"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={24} color={color} />
            ),
          }}
        />

        {/* Include screens that shouldn't show in tab bar */}
        <Tabs.Screen
          name="(collections)/createDeck"
          options={{
            href: null, // Don't show in tab bar
          }}
        />
      </Tabs>
      {process.env.EXPO_OS === "web" ? <Inspector /> : null}
      <UserStore />
    </SignedIn>
  );
}
