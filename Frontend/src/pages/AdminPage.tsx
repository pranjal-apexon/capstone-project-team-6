import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setLoading, setError, setProducts, addProduct, updateProduct, deleteProduct } from '../store/productSlice';
import AdminProductPanel from '../components/Admin/AdminProductPanel';
import AdminOrderPanel from '../components/Admin/AdminOrderPanel';
import LowStockAlert from '../components/Admin/LowStockAlert';
import type { CreateProductRequest, UpdateProductRequest } from '../types/product.types';
import { OrderStatus } from '../types/order.types';
import type { Order } from '../types/order.types';
import productApi from '../api/productApi';
import orderApi from '../api/orderApi';
import '../components/styles/admin.css';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error } = useSelector((state: RootState) => state.product);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    try {
      dispatch(setLoading(true));
      const data = await productApi.getAll();
      dispatch(setProducts(data));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load products';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (err: any) {
      alert('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAddProduct = async (data: CreateProductRequest) => {
    try {
      dispatch(setLoading(true));
      const newProduct = await productApi.create(data);
      dispatch(addProduct(newProduct));
      alert('Product added successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateProduct = async (id: string, data: UpdateProductRequest) => {
    try {
      dispatch(setLoading(true));
      const updatedProduct = await productApi.update(id, data);
      dispatch(updateProduct(updatedProduct));
      alert('Product updated successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      dispatch(setLoading(true));
      await productApi.delete(id);
      dispatch(deleteProduct(id));
      alert('Product deleted successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setOrdersLoading(true);
      const updatedOrder = await orderApi.updateStatus(orderId, { status });
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      alert('Order status updated successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="page-container admin-page">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-banner">{error}</div>}

      <LowStockAlert products={products} />

      <div className="tab-container">
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'products' && (
          <AdminProductPanel
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrderPanel
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            isLoading={ordersLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
