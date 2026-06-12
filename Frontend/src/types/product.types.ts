export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

export interface ProductFilters {
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
}
