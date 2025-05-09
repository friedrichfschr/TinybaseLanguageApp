import { createMergeableStore, Value } from "tinybase/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { useCreateClientPersisterAndStart } from "./persistence/useCreateClientPersisterAndStart";
import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";
import { useUser } from "@clerk/clerk-expo";
import DeckStore from "./deckStore";
import { useCallback } from "react";
import { randomUUID } from "expo-crypto";

const VALUES_SCHEMA = {
  id: { type: "string" },
  name: { type: "string" },
  email: { type: "string", default: "emailDefaulthahahha" },
  profileImageUrl: { type: "string" },
  createdAt: { type: "number", default: Date.now() },
  updatedAt: { type: "number", default: Date.now() },
} as const;

const TABLES_SCHEMA = {
  folders: {
    id: { type: "string" },
    name: { type: "string" },
    order: { type: "number" },
    color: { type: "string", default: "" },
    createdAt: { type: "number", default: Date.now() },
    updatedAt: { type: "number", default: Date.now() },
    folderId: { type: "string", default: "" },
  },
  decks: {
    id: { type: "string" },
    folderId: { type: "string", default: "" },
    valuesCopy: { type: "string", default: "" },
  },
  books: {
    id: { type: "string" },
    title: { type: "string" },
    author: { type: "string", default: "Unknown Author" },
    coverUrl: { type: "string", default: "" }, // Placeholder for cover
    bookUrl: { type: "string" }, // Path to the local EPUB file
    progress: { type: "number", default: 0 },
    lastLocation: { type: "string", default: "" },
    createdAt: { type: "number", default: Date.now() },
    updatedAt: { type: "number", default: Date.now() },
  },
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];
type ShoppingListValueId = keyof typeof VALUES_SCHEMA;

const {
  useCreateMergeableStore,
  useProvideStore,
  useStore,
  useValue,
  useSetValueCallback,
  useTable,
  useCell,
  useSetCellCallback,
  useRowIds,
  useRow,
  useDelRowCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;
export const useUserStoreId = () => "UserStore_" + useUser().user.id;

export const useStoreValue = <ValueId extends ShoppingListValueId>(
  valueId: ValueId
): [
  Value<Schemas[1], ValueId>,
  (value: Value<Schemas[1], ValueId>) => void
] => [
  useValue(valueId, useUserStoreId()),
  useSetValueCallback(
    valueId,
    (value: Value<Schemas[1], ValueId>) => value,
    [],
    useUserStoreId()
  ),
];

export const useDelDeckCallback = () => {
  const store = useStore(useUserStoreId());
  return useCallback(
    (deckId: string) => {
      store.delRow("decks", deckId);
    },
    [store]
  );
};

export const useAddDeckCallback = () => {
  const store = useStore(useUserStoreId());
  return useCallback(
    (name: string, color: string, folderId: string) => {
      console.log(color);
      const deckId = randomUUID();
      store.setRow("decks", deckId, {
        id: deckId,
        valuesCopy: JSON.stringify({ deckId, name, color, folderId }),
      });
    },

    [store]
  );
};

export const useAddFolderCallback = () => {
  const store = useStore(useUserStoreId());
  return useCallback(
    (name: string, color: string) => {
      const id = randomUUID();
      store.setRow("folders", id, {
        id,
        name,
        color,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
    [store]
  );
};

export const useAddBookCallback = () => {
  const store = useStore(useUserStoreId());
  return useCallback(
    (book: {
      id: string;
      title: string;
      author?: string;
      coverUrl?: string;
      bookUrl: string;
    }) => {
      store.setRow("books", book.id, {
        id: book.id,
        title: book.title,
        author: book.author || "Unknown Author",
        coverUrl: book.coverUrl || "", // Default or placeholder cover
        bookUrl: book.bookUrl,
        progress: 0,
        lastLocation: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
    [store]
  );
};

export const useBookIDs = () => {
  return useRowIds("books", useUserStoreId());
};

export const useBookRow = (bookId: string) => {
  return useRow("books", bookId, useUserStoreId());
};

export const useDeckIDs = () => {
  return useRowIds("decks", useUserStoreId());
};

export const useValuesCopy = (
  id: string
): [string, (valuesCopy: string) => void] => [
  useCell("decks", id, "valuesCopy", useUserStoreId()),
  useSetCellCallback(
    "decks",
    id,
    "valuesCopy",
    (valuesCopy: string) => valuesCopy,
    [],
    useUserStoreId()
  ),
];

export const useBooksTable = () => {
  return useTable("books", useUserStoreId());
};

export default function UserStore() {
  const storeId = useUserStoreId();
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA)
  );

  useCreateClientPersisterAndStart(storeId, store);
  // useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  return Object.entries(useTable("decks", storeId)).map(([deckId]) => {
    console.log("deckIdInObjectMap", deckId);
    return (
      <DeckStore deckId={deckId} useValuesCopy={useValuesCopy} key={deckId} />
    );
  });
}
