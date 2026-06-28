import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { orderApi } from "../api/orderApi";
import OrderHistory from "../components/Orders/OrderHistory"; // Import your component
import type { Order } from "../types/order.types"; // Import your type
import "../components/styles/orders.css";

const OrderPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let fetchedOrders: Order[];
        if (user.isAdmin) {
          fetchedOrders = await orderApi.getAll();
        } else {
          fetchedOrders = await orderApi.getMyOrders();
        }

        console.log("Orders fetched:", fetchedOrders);
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="page-container order-page">
      <header className="order-page-header">
        <h1>{user?.isAdmin ? "All System Orders" : "My Order History"}</h1>
      </header>

      <main className="order-page-content">
        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: "#fee",
              border: "1px solid #f99",
              borderRadius: "4px",
              color: "#c33",
            }}
          >
            {error}
            <button
              onClick={() => window.location.reload()}
              style={{ marginLeft: "12px", cursor: "pointer" }}
            >
              Retry
            </button>
          </div>
        )}
        {/* Pass the state to your reusable component */}
        <OrderHistory orders={orders} isLoading={loading} />
      </main>
    </div>
  );
};

export default OrderPage;
