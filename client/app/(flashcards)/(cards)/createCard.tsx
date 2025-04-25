import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

type Props = {}

const createCard = (props: Props) => {
  return (
    <ThemedView>
      <ThemedText>createCard</ThemedText>
    </ThemedView>
  )
}

export default createCard