import type {
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from '../types/order.types';
import axiosClient from './axiosClient';

export const orderApi = {
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosClient.post<Order>('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/orders/mine');
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/orders');
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await axiosClient.put<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await axiosClient.put<Order>(`/orders/${id}/cancel`, {});
    return response.data;
  },
};

export default orderApi;
