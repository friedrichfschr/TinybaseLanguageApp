import { Tabs } from "expo-router/tabs";
import { usePathname } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function FlashcardsLayout() {
  const pathname = usePathname();

  // Determine if the current screen should hide header and tab bar
  const shouldHideHeaderAndTabBar =
    pathname?.includes("/reviewing") || pathname?.includes("/Reviewing");

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
      display: shouldHideHeaderAndTabBar ? "none" : "flex",
    },
    tabBarActiveTintColor: primaryColor,
    tabBarInactiveTintColor: mutedColor,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "500",
      marginTop: 2,
    },
    headerShown: !shouldHideHeaderAndTabBar,
    ...(process.env.EXPO_OS !== "ios"
      ? {}
      : {
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: true,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
        }),
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="Cards"
        options={{
          headerTitle: "Cards",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="style" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ReviewOptions"
        options={{
          headerTitle: "Review Options",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="refresh" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Stats"
        options={{
          headerTitle: "Statistics",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DeckSettings"
        options={{
          headerTitle: "Deck Settings",
          href: null, // Don't show in tab bar
        }}
      />
      <Tabs.Screen
        name="Reviewing"
        options={{
          headerShown: false,
          animation: "fade",
          href: null, // Don't show in tab bar
        }}
      />
    </Tabs>
  );
}
