import React from 'react';
import type { CartItem } from '../../types/order.types';
import '../styles/orders.css';

interface CartProps {
  items: CartItem[];
  totalAmount: number;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

const Cart: React.FC<CartProps> = ({
  items,
  totalAmount,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  isLoading = false,
}) => {
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Continue shopping to add items to your cart</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>Shopping Cart</h2>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId}>
                <td>{item.product.name}</td>
                <td>${item.product.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={item.product.stockQuantity}
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)
                    }
                    className="quantity-input"
                  />
                </td>
                <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%):</span>
          <span>${(totalAmount * 0.1).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${(totalAmount * 1.1).toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="btn-checkout"
          disabled={isLoading || items.length === 0}
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
