import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import TextInput from "@/components/ui/text-input";
import { DeckSchema, useDeckStoreId, useDeleteCardCallback, useEditCardCallback } from "@/stores/deckStore";
import { useStateStore } from "@/stores/StateManagement";
import * as UiReact from "tinybase/ui-react/with-schemas";
import Button from "@/components/ui/button";

const { useRow } = UiReact as UiReact.WithSchemas<DeckSchema>;

type Props = {};

const editCard = (props: Props) => {
    const [definition, setDefinition] = React.useState("");

    const { deckId } = useStateStore();

    const updateCard = useEditCardCallback(deckId);
    const deleteCard = useDeleteCardCallback(deckId);

    const router = useRouter();
    const handleCancel = () => {
        console.log("Cancel");
        router.push("/(app)/(flashcards)/cards");
    };
    const cardId = useLocalSearchParams().cardId as string;
    const card = useRow("cards", cardId, useDeckStoreId(deckId));

    const [back, setBack] = React.useState(card.front);
    const [front, setFront] = React.useState(card.back);

    const handleSave = () => {
        router.dismiss();
        updateCard(cardId,
            front,
            back,
        );
    };
    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <Pressable onPress={handleCancel} style={{ padding: 8 }}>
                            <ThemedText>Cancel</ThemedText>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable onPress={handleSave} style={{ padding: 8 }}>
                            <ThemedText>Save</ThemedText>
                        </Pressable>
                    ),

                    headerTitle: "Create Card",
                }}
            />
            <ThemedView>
                <ThemedText>Front</ThemedText>
                <TextInput onChangeText={setFront} value={front} />
                <ThemedText>Back</ThemedText>
                <TextInput onChangeText={setBack} value={back} />
                <Button variant="accent" onPress={() => {
                    deleteCard(cardId)
                }}>Delete</Button>
            </ThemedView>
        </>
    );
};

export default editCard;
