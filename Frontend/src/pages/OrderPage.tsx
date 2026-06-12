import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../store/store';
import OrderHistory from '../components/Orders/OrderHistory'; // Import your component
import type { Order } from '../types/order.types'; // Import your type
import '../components/styles/orders.css';

const OrderPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const url = user?.isAdmin ? '/api/orders' : '/api/orders/mine';
        const token = localStorage.getItem('token');
        
        const response = await axios.get<Order[]>(`http://localhost:61800${url}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("API Response:", response.data); // Debugging line
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.isAdmin]);

  return (
    <div className="page-container order-page">
      <header className="order-page-header">
        <h1>{user?.isAdmin ? "All System Orders" : "My Order History"}</h1>
      </header>

      <main className="order-page-content">
        {/* Pass the state to your reusable component */}
        <OrderHistory orders={orders} isLoading={loading} />
      </main>
    </div>
  );
};

export default OrderPage;