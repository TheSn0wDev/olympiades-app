import { create } from "zustand";

export interface Participant {
  id: number;
  name: string;
}

interface ParticipantStore {
  action: "update" | "delete" | null;
  setAction: (action: "update" | "delete" | null) => void;
  selectedParticipant: Participant | null;
  setSelectedParticipant: (participant: Participant) => void;
  clearSelectedParticipant: () => void;
}

export const useParticipantStore = create<ParticipantStore>((set) => ({
  action: null,
  setAction: (action) => set({ action }),
  selectedParticipant: null,
  setSelectedParticipant: (participant) =>
    set({ selectedParticipant: participant }),
  clearSelectedParticipant: () =>
    set({ selectedParticipant: null, action: null }),
}));
