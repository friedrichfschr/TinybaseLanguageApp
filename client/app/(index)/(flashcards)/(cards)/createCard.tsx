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
    router.push("/(flashcards)/(cards)")
  }
  const handleSave = () => {
    createCard(front, back, definition)
    router.push("/(flashcards)/(cards)")
  }
  return (
    <>
      <Stack.Screen options={{
        headerLeft: () => (
          <ThemedView>
            <Pressable onPress={handleCancel}>
              <ThemedText>Cancel</ThemedText>
            </Pressable>
          </ThemedView>
        ),
        headerRight: () => (
          <ThemedView>
            <Pressable onPress={handleSave}>
              <ThemedText>Save</ThemedText>
            </Pressable>
          </ThemedView>
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