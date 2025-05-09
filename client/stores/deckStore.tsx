import * as UiReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore, createMetrics } from "tinybase/with-schemas";

import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";
import { useCreateClientPersisterAndStart } from "./persistence/useCreateClientPersisterAndStart";
import { useCallback } from "react";
import { randomUUID } from "expo-crypto";

const VALUES_SCHEMA = {
  name: { type: "string" },
  description: { type: "string" },
  createdAt: { type: "number", default: Date.now() },
  updatedAt: { type: "number", default: Date.now() },
  id: { type: "string" },
  color: { type: "string" },
  folderId: { type: "string", default: "" },
} as const;

const TABLES_SCHEMA = {
  cards: {
    front: { type: "string" },
    back: { type: "string" },
    createdAt: { type: "number", default: Date.now() },
    updatedAt: { type: "number", default: Date.now() },
    id: { type: "string" },
    interval: { type: "number", default: 0 },
    nextReview: { type: "number", default: Date.now() },
    easeFactor: { type: "number", default: 2.5 },
    incorrectCount: { type: "number", default: 0 },
    correctCount: { type: "number", default: 0 },
  },
  reviews: {
    date: { type: "number" },
  },
} as const;

export type DeckSchema = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];

const {
  useCreateMergeableStore,
  useProvideStore,
  useValuesListener,
  useStore,
  useCreateMetrics,
  useProvideMetrics,
} = UiReact as UiReact.WithSchemas<DeckSchema>;

export const useDeckStoreId = (id: string) => "DeckStore_" + id;

export const useAddCardCallback = (deckId: string) => {
  const storeId = useDeckStoreId(deckId);
  const store = useStore(storeId);
  return useCallback(
    (front: string, back: string, definition: string) => {
      const cardId = randomUUID();
      const card = {
        front,
        back,
        definition,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id: cardId,
      };
      store.setRow("cards", cardId, card);
    },
    [deckId, storeId]
  );
};

export const useEditCardCallback = (deckId: string) => {
  const storeId = useDeckStoreId(deckId);
  const store = useStore(storeId);
  return useCallback(
    (cardId: string, front: string, back: string) => {
      const card = {
        front,
        back,
        updatedAt: Date.now(),
      };
      store.setRow("cards", cardId, card);
    },
    [deckId, storeId]
  );
}

export const useDeleteCardCallback = (deckId: string) => {
  const storeId = useDeckStoreId(deckId);
  const store = useStore(storeId);
  return useCallback(
    (cardId: string) => {
      store.delRow("cards", cardId);
    },
    [deckId, storeId]
  );
}

export default function DeckStore({
  deckId,
  useValuesCopy,
}: {
  deckId: string;
  useValuesCopy?: (id: string) => [string, (valuesCopy: string) => void];
}) {
  const [valuesCopy, setValuesCopy] = useValuesCopy(deckId);

  const storeId = useDeckStoreId(deckId);
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA)
  );
  const metrics = useCreateMetrics(store, (store) => {
    return createMetrics(store)
      .setMetricDefinition("cardsCount", "cards")
      .setMetricDefinition(
        "dueCardsCount",
        "cards",
        (nextReviews) => {
          const now = Date.now();
          return nextReviews
            .filter((nextReview) => nextReview <= now)
            .reduce((count) => count + 1, 0);
        },
        "nextReview"
      );
  });

  useValuesListener(
    () => setValuesCopy(JSON.stringify({ ...store.getValues(), deckId })),
    [setValuesCopy],
    false,
    store
  );

  useCreateClientPersisterAndStart(storeId, store, valuesCopy);
  // useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);
  useProvideMetrics(storeId, metrics);
  return null;
}
