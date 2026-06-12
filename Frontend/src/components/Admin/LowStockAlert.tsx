import React from 'react';
import type { Product } from '../../types/product.types';
import '../styles/admin.css';

interface LowStockAlertProps {
  products: Product[];
  threshold?: number;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ products, threshold = 10 }) => {
  const lowStockProducts = products.filter((p) => p.stockQuantity < threshold);

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="low-stock-alert">
      <h3>⚠️ Low Stock Alert</h3>
      <ul>
        {lowStockProducts.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong>: {product.stockQuantity} units remaining
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlert;
