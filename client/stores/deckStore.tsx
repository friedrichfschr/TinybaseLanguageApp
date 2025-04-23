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
  color: { type: "string", default: "#0a7ea4" },
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
    interval:  { type: "number", default: 0 },
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
  reviews: {

  }
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];

const { useCreateMergeableStore, useProvideStore } =
  UiReact as UiReact.WithSchemas<Schemas>;

export const useDeckStoreId = (id: string) => "DeckStore_" + id;

// TO DO: create and provide and intialize the deck stores inside the Userstore. Then use the same approach as in the shopping list 
// tutorial of having a deck values copy in the User store. When creating a new deck 
// React hook for using a deck store
export default function DeckStore({
    deckId,
     useValuesCopy,
    } : {
    deckId: string,
    useValuesCopy?: (id: string) => [string, (valuesCopy: string)=> void];
  }) {
    console.log("DeckStore")

    const [valuesCopy, setValuesCopy] = useValuesCopy(deckId)

  const storeId = useDeckStoreId(deckId);
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA)
  );

  useCreateClientPersisterAndStart(storeId, store, valuesCopy);
  // useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  return null;
}
