import React, { useEffect, useState } from "react"; // Added useState
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  setLoading,
  setError,
  setProducts,
  setFilters,
} from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import ProductList from "../components/Products/ProductList";
import ProductSearch from "../components/Products/ProductSearch";
import Breadcrumbs from "../components/Layout/Breadcrumbs";
import type { Product, ProductFilters } from "../types/product.types";
import productApi from "../api/productApi";
import "../components/styles/products.css";

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error, filters } = useSelector(
    (state: RootState) => state.product,
  );

  // 🟢 State to manage the active toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load all products once on component mount
    loadProducts();
  }, []);

  // 🟢 Automatically clear the toast message after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer if a new toast interrupts
    }
  }, [toastMessage]);

  const loadProducts = async () => {
    try {
      dispatch(setLoading(true));
      const data = await productApi.getAll();
      dispatch(setProducts(data));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to load products";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    dispatch(
      addToCart({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stockQuantity: product.stockQuantity,
        },
        quantity,
      }),
    );

    // 🟢 Replace alert with custom toast trigger
    setToastMessage(`${quantity} x ${product.name} added to cart!`);
  };

  // CLIENT-SIDE FILTERING LOGIC
  const filteredProducts = (products || []).filter((product) => {
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesName = product.name?.toLowerCase().includes(term);
      const matchesDescription = product.description
        ?.toLowerCase()
        .includes(term);

      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    if (filters?.category && product.category !== filters.category) {
      return false;
    }

    if (filters?.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }

    if (filters?.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });

  return (
    <div className="page-container products-page">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Products" }]}
      />

      <h1 className="products-main-title">Our Products</h1>
      <p className="products-count-subtitle">
        {filteredProducts.length} of {(products || []).length} products
      </p>

      {error && <div className="error-banner">{error}</div>}

      <ProductSearch onFiltersChange={handleFiltersChange} />

      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />

      {/* 🟢 Toast Layout element added here */}
      {toastMessage && (
        <div className="custom-toast">
          <span className="toast-icon">✓</span>
          <span className="toast-text">{toastMessage}</span>
          <button
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
