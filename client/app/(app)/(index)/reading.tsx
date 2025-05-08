import { ThemedSafeAreaView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import { router } from "expo-router";

export default function Reading() {


    return (
        <ThemedSafeAreaView>
            <Button variant="primary" onPress={() => router.replace("/(app)/(index)/books")} >
                Go to Reading
            </Button>
        </ThemedSafeAreaView>
    );
}