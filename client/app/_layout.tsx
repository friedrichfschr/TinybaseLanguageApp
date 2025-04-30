import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded, SignedIn } from "@clerk/clerk-expo";

import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/cache";
import { Provider as TinybaseProvider } from "tinybase/ui-react";
import { Inspector } from "tinybase/ui-react-inspector";
import UserStore from "@/stores/UserStore";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

const publisehableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publisehableKey) {
    console.error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

// Prevent the splash screen from auto-hiding before asset loading is complete.



export default function RootLayout() {
    const colorScheme = useColorScheme();


    return (
        <TinybaseProvider>
            <ClerkProvider publishableKey={publisehableKey} tokenCache={tokenCache}>
                <ClerkLoaded>
                    <ThemeProvider
                        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                    >
                        <Slot />
                        <StatusBar style="auto" />
                    </ThemeProvider>
                    {process.env.EXPO_OS === "web" ? <Inspector /> : null}
                </ClerkLoaded>
            </ClerkProvider>
        </TinybaseProvider>
    );
}
