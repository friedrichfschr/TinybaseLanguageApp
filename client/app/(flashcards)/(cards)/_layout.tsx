import { Stack } from "expo-router"


export default function cardsLayout()  {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="createCard" options={{ presentation: "modal" }} />
            <Stack.Screen name="index"  />
        </Stack>    
    )
}