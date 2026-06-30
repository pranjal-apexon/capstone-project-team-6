import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { orderApi } from "../api/orderApi";
import type { CreateOrderRequest } from "../types/order.types";
import Breadcrumbs from "../components/Layout/Breadcrumbs";
import "../components/styles/orders.css"; // Reusing your orders styles

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab live data from your Redux cart
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  // Local component states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Build the order request from cart items
      const orderRequest: CreateOrderRequest = {
        items: items.map((item) => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
        })),
      };

      // Call the backend API to create the order
      const createdOrder = await orderApi.create(orderRequest);
      console.log("Order created successfully:", createdOrder);

      setIsProcessing(false);
      setIsSuccess(true);

      // Clear the cart globally upon successful order creation
      dispatch(clearCart());

      // Navigate to orders page after 2 seconds
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Failed to create order:", error);
      setIsProcessing(false);
      alert("Failed to place order. Please try again.");
    }
  };

  // 1. Inline Success View
  if (isSuccess) {
    return (
      <div className="page-container checkout-page-layout">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Cart", to: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="cart-empty success-container">
          <div className="success-icon">✓</div>
          <h3>Order Placed Successfully!</h3>
          <p>
            Thank you for your purchase. Your order has been submitted and will
            appear in your order history shortly.
          </p>
          <button
            className="btn-filter-apply"
            onClick={() => navigate("/orders")}
          >
            View Order History
          </button>
        </div>
      </div>
    );
  }

  // 2. Fallback if they visit checkout with an empty cart
  if (items.length === 0) {
    return (
      <div className="page-container checkout-page-layout">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Cart", to: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="cart-empty">
          <h3>Your checkout is empty</h3>
          <p>Add some items to your cart before checking out.</p>
          <button className="btn-filter-clear" onClick={() => navigate("/")}>
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  // 3. Main Checkout Form Layout
  return (
    <div className="page-container checkout-page-layout">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h2>Checkout Details</h2>

      <div className="checkout-grid">
        {/* Left Side: Shipping & Mock Payment Form */}
        <form
          onSubmit={handleSubmit}
          className="product-search-panel checkout-form"
        >
          <h3>Shipping Information</h3>
          <div className="form-row">
            <div className="filter-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            <div className="filter-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="filter-group" style={{ marginTop: "12px" }}>
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main St"
            />
          </div>

          <div className="form-row" style={{ marginTop: "12px" }}>
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
              />
            </div>
            <div className="filter-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                required
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="10001"
              />
            </div>
          </div>

          <hr
            style={{
              margin: "30px 0",
              border: "none",
              borderTop: "1px solid #e2e8f0",
            }}
          />

          <h3>Payment (Mock)</h3>
          <div className="filter-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              required
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
            />
          </div>

          <div className="form-row" style={{ marginTop: "12px" }}>
            <div className="filter-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiry"
                required
                value={formData.expiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="filter-group">
              <label>CVV</label>
              <input
                type="password"
                name="cvv"
                required
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-checkout"
            style={{ marginTop: "30px" }}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing Payment..."
              : `Pay $ ${(totalAmount * 1.1).toFixed(2)}`}
          </button>
        </form>

        {/* Right Side: Quick Order Summary Review */}
        <div className="cart-summary checkout-summary-box">
          <h3>Review Your Order</h3>
          <div
            className="checkout-items-list"
            style={{
              marginBottom: "20px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>
                  {item.product.name} (x{item.quantity})
                </span>
                <span style={{ fontWeight: 600 }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
