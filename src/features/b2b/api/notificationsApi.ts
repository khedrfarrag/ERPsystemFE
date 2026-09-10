import api from '../../../api/client';
import { AppNotification, UnreadCountResponse } from '../types/b2b.types';

export const notificationsApi = {
  getNotifications: async (limit: number = 20): Promise<AppNotification[]> => {
    const res = await api.get('/notifications', { params: { limit } });
    return res.data.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const res = await api.get('/notifications/unread-count');
    return res.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/mark-read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/mark-all-read');
  },
};
