import { Tabs } from "expo-router/tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function AppLayout() {


  // Get theme colors for tabs
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "textMuted");

  // Define tab bar styles for consistency

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
    </Tabs>
  );
}
