import api from '../../../api/client';
import {
  StoreUser,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  StoreProfile,
  UpdateStoreRequest,
} from '../types/settings.types';

export const settingsApi = {
  // Users APIs
  getUsers: async (page = 1, pageSize = 50): Promise<UserListResponse> => {
    const res = await api.get('/users', { params: { page, pageSize } });
    return res.data.data;
  },

  getUserById: async (id: string): Promise<StoreUser> => {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },

  createUser: async (data: CreateUserRequest): Promise<StoreUser> => {
    const res = await api.post('/users', data);
    return res.data.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<StoreUser> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data.data;
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<StoreUser> => {
    const res = await api.patch(`/users/${id}/status`, { isActive });
    return res.data.data;
  },

  // Store Settings APIs
  getStoreProfile: async (): Promise<StoreProfile> => {
    const res = await api.get('/stores/current');
    return res.data.data;
  },

  updateStoreProfile: async (data: UpdateStoreRequest): Promise<StoreProfile> => {
    const res = await api.put('/stores/current', data);
    return res.data.data;
  },
};
