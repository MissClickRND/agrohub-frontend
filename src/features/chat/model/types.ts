import { Message } from "../../../entities/message/model/types";

export interface ChatCompletionRequest {
  fieldId: number;
  prompt: string;
  model: string;
}

export interface ChatCompletionResponse {
  data: string;
  event?: string;
  id?: string;
  retry?: number;
}

export interface IChatStoreSchema {
  messages: Message[],
  setMessages: (messages: Message[]) => void,

  currentMessage: string,
  setCurrentMessage: (currentMessage: string) => void,

  currentFieldId: number | null,
  setCurrentFieldId: (currentFieldId: number) => void,

  isSendAvailable: boolean,
  setIsSendAvailable: (isSendAvailable: boolean) => void
}
