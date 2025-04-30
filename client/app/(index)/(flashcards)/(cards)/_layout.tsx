import { Stack } from "expo-router"


export default function cardsLayout()  {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="createCard" options={{ presentation: "modal", headerShown: true }} />
            <Stack.Screen name="index"  />
        </Stack>    
    )
}