import { create } from "zustand";
import { IChatStoreSchema } from "./types";

export const chatStore = create<IChatStoreSchema>((set) => ({
    messages: [],
    setMessages: (messages) => set({messages}),

    currentMessage: "",
    setCurrentMessage: (currentMessage) => set({currentMessage}),

    currentFieldId: null,
    setCurrentFieldId: (currentFieldId) => set({currentFieldId}),

    isSendAvailable: true,
    setIsSendAvailable: (isSendAvailable) => set({isSendAvailable})
}))