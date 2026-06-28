export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  userId: number;
  userFullName?: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  updatedAt?: string;
  items: OrderItemDto[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export const OrderStatus = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface CreateOrderRequest {
  items: {
    productId: number;
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
