import { create } from "zustand";
import { meStoreScheme } from "./types";

export const useMeStore = create<meStoreScheme>((set) => ({
  userName: "",
  setUserName: (name) => set({ userName: name }),
}));
