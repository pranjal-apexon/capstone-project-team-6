import axiosClient from "./axiosClient";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
} from "../types/product.types";

export const productApi = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const queryParams: Record<string, any> = {};

    if (filters) {
      // 💡 Try changing "search" to "q" or "name" if "search" doesn't work
      if (filters.searchTerm) queryParams.search = filters.searchTerm;
      if (filters.category) queryParams.category = filters.category;
      if (filters.minPrice !== undefined)
        queryParams.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined)
        queryParams.maxPrice = filters.maxPrice;
    }
    const res = await axiosClient.get("/products", {
      params: filters,
    });

    return res.data.items || res.data;
  },

  async getById(id: string): Promise<Product> {
    const res = await axiosClient.get<Product>(`/products/${id}`);
    return res.data;
  },

  // ✅ ADD THIS
  async create(data: CreateProductRequest): Promise<Product> {
    const res = await axiosClient.post<Product>("/products", data);
    return res.data;
  },

  // ✅ ADD THIS
  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const res = await axiosClient.put<Product>(`/products/${id}`, data);
    return res.data;
  },

  // ✅ ADD THIS
  async delete(id: string): Promise<void> {
    await axiosClient.delete(`/products/${id}`);
  },
};

export default productApi;
