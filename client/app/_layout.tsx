import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded, SignedIn } from "@clerk/clerk-expo";

import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/cache";
import { Provider as TinybaseProvider } from "tinybase/ui-react";
import { Inspector } from "tinybase/ui-react-inspector";

const publisehableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publisehableKey) {
    console.error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

const initialRootname = "(app)"



export default function RootLayout() {
    const colorScheme = useColorScheme();


    return (
        <TinybaseProvider>
            <ClerkProvider publishableKey={publisehableKey} tokenCache={tokenCache}>
                <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                    <Slot />
                    <StatusBar style="auto" />
                </ThemeProvider>
                {process.env.EXPO_OS === "web" ? <Inspector /> : null}
            </ClerkProvider>
        </TinybaseProvider>
    );
}
