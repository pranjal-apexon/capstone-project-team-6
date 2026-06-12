import React, { useState } from 'react';
import type { Order } from '../../types/order.types';
import { OrderStatus } from '../../types/order.types';
import OrderStatusBadge from '../Orders/OrderStatusBadge';
import '../styles/admin.css';

interface AdminOrderPanelProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  isLoading?: boolean;
}

const AdminOrderPanel: React.FC<AdminOrderPanelProps> = ({
  orders,
  onUpdateStatus,
  isLoading = false,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateStatus(orderId, newStatus);
  };

  return (
    <div className="admin-panel">
      <h2>Order Management</h2>

      {orders.length === 0 ? (
        <div className="empty-state">No orders to manage</div>
      ) : (
        <div className="order-management-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className={expandedOrderId === order.id ? 'expanded' : ''}>
                    <td>{order.id.substring(0, 8)}...</td>
                    <td>{order.userId.substring(0, 8)}...</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id
                          )
                        }
                        className="btn-small"
                      >
                        {expandedOrderId === order.id ? 'Collapse' : 'Expand'}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderId === order.id && (
                    <tr className="order-detail-row">
                      <td colSpan={6}>
                        <div className="order-detail">
                          <div className="order-items">
                            <h4>Items:</h4>
                            <ul>
                              {order.orderItems.map((item) => (
                                <li key={item.id}>
                                  {item.product?.name} (Qty: {item.quantity}) - $
                                  {item.unitPrice.toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="status-update">
                            <label htmlFor={`status-${order.id}`}>Update Status:</label>
                            <select
                              id={`status-${order.id}`}
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                              disabled={isLoading}
                            >
                              <option value={OrderStatus.PENDING}>Pending</option>
                              <option value={OrderStatus.PROCESSING}>Processing</option>
                              <option value={OrderStatus.SHIPPED}>Shipped</option>
                              <option value={OrderStatus.DELIVERED}>Delivered</option>
                              <option value={OrderStatus.CANCELLED}>Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPanel;
