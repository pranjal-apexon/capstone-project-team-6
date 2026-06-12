export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  orderItems: OrderItem[];
}

export const OrderStatus = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface CreateOrderRequest {
  orderItems: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CartItem {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    stockQuantity: number;
  };
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  cartState: CartState;
}
