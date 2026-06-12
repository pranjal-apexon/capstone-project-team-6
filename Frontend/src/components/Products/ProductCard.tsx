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
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

  const getProductEmoji = (name: string, category: string) => {
    const title = name.toLowerCase();
    if (title.includes('keyboard')) return '⌨️';
    if (title.includes('mouse')) return '🖱️';
    if (title.includes('lamp')) return '💡';
    if (title.includes('hub') || title.includes('usb')) return '🔌';

    switch (category) {
      case 'Electronics': return '💻';
      case 'Clothing': return '👕';
      case 'Books': return '📚';
      case 'Home': return '🏠';
      default: return '📦';
    }
  };

  return (
    <div className="product-card-v2">
      <div className="product-card-image-box">
        <span className="product-emoji">{getProductEmoji(product.name, product.category)}</span>
        {isLowStock && <span className="product-low-stock-badge">Low stock</span>}
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{product.category.toUpperCase()}</p>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>

        <div className="product-card-footer">
          <div className="product-card-price-group">
            <span className="product-card-price">${product.price.toFixed(2)}</span>
            <span className="product-card-stock">{product.stockQuantity} in stock</span>
          </div>

          <div className="product-card-actions">
            {isAdmin ? (
              <div className="admin-card-btn-row">
                <button onClick={() => onEdit?.(product)} className="btn-card-edit">
                  Edit
                </button>
                <button onClick={() => onDelete?.(product.id)} className="btn-card-delete">
                  Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="btn-add-to-cart-purple"
                disabled={product.stockQuantity === 0}
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;