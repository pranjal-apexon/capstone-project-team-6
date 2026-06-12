import React from 'react';
import type { Product } from '../../types/product.types';
import '../styles/products.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const isLowStock = product.stockQuantity < 10;

  return (
    <div className={`product-card ${isLowStock ? 'low-stock' : ''}`}>
      <div className="product-header">
        <h3>{product.name}</h3>
        {isLowStock && <span className="low-stock-badge">Low Stock</span>}
      </div>
      <p className="product-category">{product.category}</p>
      <p className="product-description">{product.description}</p>
      <div className="product-footer">
        <div className="product-price">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="stock">Stock: {product.stockQuantity}</span>
        </div>
        <div className="product-actions">
          {isAdmin ? (
            <>
              <button onClick={() => onEdit?.(product)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => onDelete?.(product.id)} className="btn-delete">
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="btn-primary"
              disabled={product.stockQuantity === 0}
            >
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
