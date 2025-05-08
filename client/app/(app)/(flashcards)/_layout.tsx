import { Tabs } from "expo-router/tabs";
import { usePathname } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function FlashcardsLayout() {
  const pathname = usePathname();

  // Determine if the current screen should hide header and tab bar
  const shouldHideTabBar =
    pathname?.includes("/Reviewing")

  // Get theme colors for tabs
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "textMuted");

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.1)",
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          display: shouldHideTabBar ? "none" : "flex",
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: mutedColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 2,
        },
        headerShown: false,

      }}
    >
      <Tabs.Screen
        name="(cards)"
        options={{
          title: "Cards",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="style" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ReviewOptions"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="refresh" size={24} color={color} />
          ),

        }}
      />
      <Tabs.Screen
        name="Stats"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DeckSettings"

        options={{
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
