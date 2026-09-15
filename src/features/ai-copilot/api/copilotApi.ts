import { api } from '../../../api/client';
import { ChatResponse, SendMessagePayload } from '../types';

export * from '../types';

export const sendCopilotMessage = async (payload: SendMessagePayload): Promise<ChatResponse> => {
  const response = await api.post<{ success: boolean; data: ChatResponse }>('/ai/chat', payload);
  return response.data.data;
};
