import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setLoading, setError, setProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import ProductList from '../components/Products/ProductList';
import ProductSearch from '../components/Products/ProductSearch';
import type { Product, ProductFilters } from '../types/product.types';
import productApi from '../api/productApi';
import '../components/styles/products.css';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error, filters } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (appliedFilters?: ProductFilters) => {
    try {
      dispatch(setLoading(true));
      const data = await productApi.getAll(appliedFilters || filters);
      dispatch(setProducts(data));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load products';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFiltersChange = async (newFilters: ProductFilters) => {
    await loadProducts(newFilters);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stockQuantity: product.stockQuantity,
        },
        quantity: 1,
      })
    );
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="page-container products-page">
      <h1>Our Products</h1>

      {error && <div className="error-banner">{error}</div>}

      <ProductSearch onFiltersChange={handleFiltersChange} />

      <ProductList
        products={products}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductsPage;
