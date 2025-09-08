import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NoteEntry } from '@/types/orderTypes';

interface NotesState {
  // Notes data
  customerNotes: NoteEntry[];
  yardNotes: NoteEntry[];
  
  // Input states
  customerNoteInput: string;
  yardNoteInput: string;
  
  // Actions
  setCustomerNotes: (notes: NoteEntry[] | ((prev: NoteEntry[]) => NoteEntry[])) => void;
  setYardNotes: (notes: NoteEntry[] | ((prev: NoteEntry[]) => NoteEntry[])) => void;
  setCustomerNoteInput: (input: string) => void;
  setYardNoteInput: (input: string) => void;
  addCustomerNote: (message: string, actor?: string) => void;
  addYardNote: (message: string, actor?: string) => void;
  clearCustomerNoteInput: () => void;
  clearYardNoteInput: () => void;
  initializeNotes: (customerNotes: NoteEntry[], yardNotes: NoteEntry[]) => void;
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      customerNotes: [],
      yardNotes: [],
      customerNoteInput: "",
      yardNoteInput: "",

      // Actions
      setCustomerNotes: (notes) =>
        set((state) => ({
          customerNotes: typeof notes === 'function' ? notes(state.customerNotes) : notes,
        })),

      setYardNotes: (notes) =>
        set((state) => ({
          yardNotes: typeof notes === 'function' ? notes(state.yardNotes) : notes,
        })),

      setCustomerNoteInput: (input) => set({ customerNoteInput: input }),

      setYardNoteInput: (input) => set({ yardNoteInput: input }),

      addCustomerNote: (message, actor) => {
        console.log("Adding customer note:", { message, actor });
        const newNote: NoteEntry = {
          id: Date.now() + Math.floor(Math.random() * 1000000),
          timestamp: new Date(),
          message,
          actor,
        };
        
        set((state) => ({
          customerNotes: [newNote, ...state.customerNotes],
        }));
      },

      addYardNote: (message, actor) => {
        console.log("Adding yard note:", { message, actor });
        const newNote: NoteEntry = {
          id: Date.now() + Math.floor(Math.random() * 1000000),
          timestamp: new Date(),
          message,
          actor,
        };
        
        set((state) => ({
          yardNotes: [newNote, ...state.yardNotes],
        }));
      },

      clearCustomerNoteInput: () => set({ customerNoteInput: "" }),

      clearYardNoteInput: () => set({ yardNoteInput: "" }),

      initializeNotes: (customerNotes, yardNotes) => 
        set({ customerNotes, yardNotes }),
    }),
    {
      name: 'notes-store',
    }
  )
);
