import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
} from '../types/product.types';
import axiosClient from './axiosClient';

export const productApi = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const response = await axiosClient.get<Product[]>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await axiosClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await axiosClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await axiosClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/products/${id}`);
  },

  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await axiosClient.get<Product[]>('/products/low-stock');
    return response.data;
  },
};

export default productApi;
