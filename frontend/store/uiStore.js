import { create } from 'zustand';

let _tid = 0;

// Transient UI state — toast queue + voice modal.
export const useUiStore = create((set) => ({
  toasts: [],
  voiceOpen: false,

  pushToast: (text) => {
    const id = ++_tid;
    set((s) => ({ toasts: [...s.toasts, { id, text }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  setVoiceOpen: (v) => set({ voiceOpen: v }),
}));
