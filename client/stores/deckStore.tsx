import { useRemoteRowId } from "tinybase/ui-react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore } from "tinybase/with-schemas";

import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";
import { useCreateClientPersisterAndStart } from "./persistence/useCreateClientPersisterAndStart";

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
  },
  users: {
    name: { type: "string" },
    profileImageUrl: { type: "string" },
    id: { type: "string" },
  },
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];

const { useCreateMergeableStore, useProvideStore } =
  UiReact as UiReact.WithSchemas<Schemas>;

export const useStoreId = (id: string) => "DeckStore_" + id;

// Create and initialize a deck store without React hooks
export function createDeckStore(
  deckId: string,
  name?: string,
  color?: string,
  folderId?: string
) {
  const store = createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA);

  // Initialize the store with values if provided
  if (name) {
    store.setValue("name", name);
    store.setValue("id", deckId);
    store.setValue("createdAt", Date.now());
    store.setValue("updatedAt", Date.now());

    if (color) {
      store.setValue("color", color);
    }

    if (folderId) {
      store.setValue("folderId", folderId);
    }

    // Store initial description as empty string
    store.setValue("description", "");
  }

  return store;
}

// React hook for using a deck store
export default function DeckStore(
  deckId: string,
  name?: string,
  color?: string,
  folderId?: string
) {
  const storeId = useStoreId(deckId);
  const store = useCreateMergeableStore(() =>
    createDeckStore(deckId, name, color, folderId)
  );

  useCreateClientPersisterAndStart(storeId, store);
  useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  return store;
}
