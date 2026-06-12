import React from 'react';
import type { Product } from '../../types/product.types';
import ProductCard from './ProductCard';
import '../styles/products.css';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onEdit,
  onDelete,
  isAdmin = false,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="empty-state">No products found. Try adjusting your filters.</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default ProductList;
