import React, { useState } from 'react';
import type { Product } from '../../types/product.types';
import ProductList from '../Products/ProductList';
import ProductForm from '../Products/ProductForm';
import '../styles/admin.css';

interface AdminProductPanelProps {
  products: Product[];
  onAddProduct: (data: any) => void;
  onUpdateProduct: (id: string, data: any) => void;
  onDeleteProduct: (id: string) => void;
  isLoading?: boolean;
}

const AdminProductPanel: React.FC<AdminProductPanelProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isLoading = false,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleAddClick = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, data);
    } else {
      onAddProduct(data);
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="admin-panel">
      <h2>Product Management</h2>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}

      {!showForm && (
        <>
          <button onClick={handleAddClick} className="btn-primary btn-add-product">
            + Add New Product
          </button>

          <ProductList
            products={products}
            onAddToCart={() => {}}
            onEdit={handleEditClick}
            onDelete={onDeleteProduct}
            isAdmin={true}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default AdminProductPanel;
