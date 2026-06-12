import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { removeFromCart, updateCartQuantity, clearCart } from '../store/cartSlice';
import Cart from '../components/Orders/Cart';
import OrderHistory from '../components/Orders/OrderHistory';
import type { Order } from '../types/order.types';
import orderApi from '../api/orderApi';
import '../components/styles/orders.css';

const OrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      loadOrderHistory();
    }
  }, [activeTab]);

  const loadOrderHistory = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      alert('Failed to load order history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ productId, quantity }));
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      setIsLoading(true);
      const orderData = {
        orderItems: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const newOrder = await orderApi.create(orderData);
      dispatch(clearCart());
      setActiveTab('history');
      await loadOrderHistory();
      alert(`Order placed successfully! Order ID: ${newOrder.id.substring(0, 8)}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  return (
    <div className="page-container order-page">
      <h1>Orders & Cart</h1>

      <div className="tab-container">
        <button
          className={`tab ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          Shopping Cart ({items.length})
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Order History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'cart' && (
          <Cart
            items={items}
            totalAmount={totalAmount}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'history' && (
          <>
            <OrderHistory
              orders={orders}
              isLoading={isLoading}
              onViewDetails={handleViewOrderDetails}
            />

            {selectedOrder && (
              <div className="order-detail-modal">
                <div className="modal-content">
                  <h3>Order Details</h3>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}
                  </p>

                  <h4>Items:</h4>
                  <ul>
                    {selectedOrder.orderItems.map((item) => (
                      <li key={item.id}>
                        {item.product?.name} - Quantity: {item.quantity}, Price: $
                        {item.unitPrice.toFixed(2)}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
