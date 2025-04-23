import { useRemoteRowId } from "tinybase/ui-react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore } from "tinybase/with-schemas";

import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";
import { useCreateClientPersisterAndStart } from "./persistence/useCreateClientPersisterAndStart";
import { createClientPersister } from "./persistence/createClientPersister";

const VALUES_SCHEMA = {
  name: { type: "string" },
  description: { type: "string" },
  createdAt: { type: "number", default: Date.now() },
  updatedAt: { type: "number", default: Date.now() },
  isPublic: { type: "boolean", default: false },
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
    isPublic: { type: "boolean", default: false },
    id: { type: "string" },
    interval: { type: "number", default: 0 },
    nextReview: { type: "number", default: 0 },
    easeFactor: { type: "number", default: 2.5 },
    incorrectCount: { type: "number", default: 0 },
    correctCount: { type: "number", default: 0 },
  },
  users: {
    name: { type: "string" },
    profileImageUrl: { type: "string" },
    id: { type: "string" },
  },
  reviews: {},
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];

const { useCreateMergeableStore, useProvideStore, useValuesListener } =
  UiReact as UiReact.WithSchemas<Schemas>;

export const useDeckStoreId = (id: string) => "DeckStore_" + id;


export default function DeckStore({
  deckId,
  useValuesCopy,
}: {
  deckId: string;
  useValuesCopy?: (id: string) => [string, (valuesCopy: string) => void];
}) {
  console.log("DeckStore");

  const [valuesCopy, setValuesCopy] = useValuesCopy(deckId);

  const storeId = useDeckStoreId(deckId);
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA)
  );

  useValuesListener(
    ()=> setValuesCopy(JSON.stringify({...store.getValues(),deckId })),
    [setValuesCopy],
    false, 
    store
  )

  useCreateClientPersisterAndStart(storeId, store, valuesCopy);
  // useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  return null;
}
