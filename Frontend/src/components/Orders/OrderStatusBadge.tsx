import React from 'react';
import { OrderStatus } from '../../types/order.types';
import '../styles/orders.css';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.PROCESSING:
        return 'status-processing';
      case OrderStatus.SHIPPED:
        return 'status-shipped';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  };

  return <span className={`status-badge ${getStatusColor(status)}`}>{status}</span>;
};

export default OrderStatusBadge;
