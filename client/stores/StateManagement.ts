import {create} from "zustand";

interface StateStore {
    deckId: string;
    setDeckId: (deckId: string) => void;
}

export const useStateStore = create<StateStore>((set) => ({
    // Define your state and actions here
    deckId: "",
    setDeckId: (deckId: string) => set({ deckId }),
}));