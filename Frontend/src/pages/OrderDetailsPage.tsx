import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import type { Order } from "../types/order.types";
import Breadcrumbs from "../components/Layout/Breadcrumbs";
import OrderStatusBadge from "../components/Orders/OrderStatusBadge";
import "../components/styles/orders.css";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Orders", to: "/orders" },
    { label: id ? `Order #${id}` : "Order Details" },
  ];

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError("Order id is missing.");
        setIsLoading(false);
        return;
      }

      const parsedId = Number(id);
      if (Number.isNaN(parsedId)) {
        setError("Order id is invalid.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await orderApi.getById(parsedId);
        setOrder(data);
      } catch {
        setError("Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-container order-page">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container order-page">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="error-banner">{error || "Order not found."}</div>
        <button className="btn-back" onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  const orderTotal = order.totalAmount;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-container order-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="order-details-container">
        <div className="order-details-header">
          <h1 className="order-details-title">Order Details #{order.id}</h1>
          <button className="btn-back" onClick={() => navigate("/orders")}>
            Back to Orders
          </button>
        </div>

        <div className="order-details-grid">
          <div className="details-card">
            <h3>Order Summary</h3>
            <div className="details-row">
              <span className="details-label">Order ID</span>
              <span className="details-value">{order.id}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Date</span>
              <span className="details-value">
                {new Date(order.orderDate).toLocaleString()}
              </span>
            </div>
            <div className="details-row">
              <span className="details-label">Status</span>
              <span className="details-value">
                <OrderStatusBadge status={order.status} />
              </span>
            </div>
            <div className="details-row">
              <span className="details-label">Total Items</span>
              <span className="details-value">{totalItems}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Total Amount</span>
              <span className="details-value">${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="details-card">
            <h3>Customer</h3>
            <div className="details-row">
              <span className="details-label">User ID</span>
              <span className="details-value">{order.userId}</span>
            </div>
            <div className="details-row">
              <span className="details-label">Name</span>
              <span className="details-value">
                {order.userFullName || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Items</h3>
          <table className="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const subtotal =
                  item.subtotal ?? item.quantity * item.unitPrice;
                return (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
