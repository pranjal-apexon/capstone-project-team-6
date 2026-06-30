import React from "react";
import { Link } from "react-router-dom";
import type { Order } from "../../types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";
import "../styles/orders.css";

interface OrderHistoryProps {
  orders: Order[];
  isLoading?: boolean;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders yet. Start shopping!</p>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="order-id">
                <Link className="order-id-link" to={`/orders/${order.id}`}>
                  {order.id}
                </Link>
              </td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>
                <OrderStatusBadge status={order.status} />
              </td>
              <td>{order.items.length} item(s)</td>
              <td>
                <Link className="order-action-link" to={`/orders/${order.id}`}>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
