import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Stack } from 'expo-router'
import { Pressable } from 'react-native'
import { router } from 'expo-router'
import TextInput from '@/components/ui/text-input'
import { useAddCardCallback } from '@/stores/deckStore'
import { useStateStore } from '@/stores/StateManagement'
import { useDeckIDs } from '@/stores/UserStore'

type Props = {}

const createCard = (props: Props) => {

  const [front, setFront] = React.useState("")
  const [back, setBack] = React.useState("")
  const [definition, setDefinition] = React.useState("")

  const { deckId } = useStateStore()

  const createCard = useAddCardCallback(deckId)

  const handleCancel = () => {
    console.log("Cancel")
    router.dismiss()
    router.push("/(app)/(flashcards)/(cards)")
  }
  const handleSave = () => {
    createCard(front, back, definition)
    router.dismiss()
  }
  console.log("createCard",)
  return (
    <>
      <Stack.Screen options={{
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
      }} />
      <ThemedView>
        <ThemedText>createCard</ThemedText>
        <ThemedText>Front</ThemedText>
        <TextInput onChangeText={setFront} />
        <ThemedText>Back</ThemedText>
        <TextInput onChangeText={setBack} />
      </ThemedView>
    </>
  )
}

export default createCard