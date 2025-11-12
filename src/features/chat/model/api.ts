import apiClient from "../../../app/api/axiosInstance";
import { endpoints } from "../../../shared/configs/apiConfigs";
import { ChatCompletionRequest, ChatCompletionResponse } from "./types";


export const sendChatCompletionStream = async (
  request: ChatCompletionRequest,
  onMessage: (data: ChatCompletionResponse) => void,
  onError?: (error: any) => void,
  onComplete?: () => void
): Promise<void> => {
  const authHeaders: Record<string, string> = {};
  if (apiClient.defaults.headers.common) {
    Object.entries(apiClient.defaults.headers.common).forEach(([key, value]) => {
      if (typeof value === 'string') {
        authHeaders[key] = value;
      }
    });
  }

  try {
    const response = await fetch(`${apiClient.defaults.baseURL}/api/chat/completion-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders, 
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/event-stream')) {
      console.warn('Response might not be an SSE stream. Content-Type:', contentType);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split(/\r?\n|\r\n?/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); 
          
          if (data.trim() === '[DONE]') {
            if (onComplete) onComplete();
            break;
          }
          
          try {
            const parsedData = JSON.parse(data);
            onMessage(parsedData);
          } catch (e) {
            onMessage({ data });
          }
        } else if (line.trim() === '') {
          continue;
        }
      }
    }

    reader.releaseLock();
    if (onComplete) onComplete();
  } catch (error) {
    console.error('Error with SSE stream:', error);
    if (onError) onError(error);
    throw error;
  }
};

export const sendMessage = async (body: ChatCompletionRequest) => {
  const res = await apiClient.post<{response: string}>(endpoints.SEND_MESSAGE, body)
  if (res.status !== 200 && res.status !== 201) throw new Error('Ошибка при получении ответа')
    return res.data
}