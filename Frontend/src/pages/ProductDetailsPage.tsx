import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import productApi from "../api/productApi";
import Breadcrumbs from "../components/Layout/Breadcrumbs";
import { addToCart } from "../store/cartSlice";
import type { AppDispatch } from "../store/store";
import type { Product } from "../types/product.types";
import "../components/styles/products.css";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: id ? `Product #${id}` : "Product Details" },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Product id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await productApi.getById(id);
        setProduct(data);
        setQuantity(1);
      } catch {
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  if (isLoading) {
    return (
      <div className="page-container products-page">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container products-page">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="error-banner">{error || "Product not found."}</div>
        <button
          className="btn-filter-clear product-back-btn"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const stockLevel =
    product.stockQuantity === 0
      ? "Out of stock"
      : product.stockQuantity < 10
        ? `Low stock (${product.stockQuantity})`
        : `${product.stockQuantity} in stock`;

  const maxQuantity = Math.max(1, product.stockQuantity);
  const totalPrice = product.price * quantity;

  const updateQuantity = (nextValue: number) => {
    const safeValue = Math.min(Math.max(nextValue, 1), maxQuantity);
    setQuantity(safeValue);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stockQuantity: product.stockQuantity,
        },
        quantity,
      }),
    );

    setToastMessage(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="page-container products-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="product-details-shell">
        <div className="product-details-header">
          <h1 className="products-main-title">Product Details</h1>
          <button
            className="btn-filter-clear product-back-btn"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </button>
        </div>

        <div className="product-details-card">
          <div className="product-details-top">
            <div>
              <p className="product-card-category">
                {product.category.toUpperCase()}
              </p>
              <h2 className="product-details-name">{product.name}</h2>
            </div>
            <div className="product-details-price">
              ${totalPrice.toFixed(2)}
            </div>
          </div>
          <p className="product-details-description">{product.description}</p>

          <div className="pdp-purchase-row">
            <div className="qty-control" aria-label="Product quantity selector">
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={product.stockQuantity === 0}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => updateQuantity(Number(e.target.value || 1))}
                className="qty-input"
                disabled={product.stockQuantity === 0}
              />
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={product.stockQuantity === 0}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn-filter-apply"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          <div className="product-details-grid">
            <div className="product-detail-item">
              <span className="product-detail-label">Product ID</span>
              <span className="product-detail-value">{product.id}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Category</span>
              <span className="product-detail-value">{product.category}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Stock Status</span>
              <span className="product-detail-value">{stockLevel}</span>
            </div>
            <div className="product-detail-item">
              <span className="product-detail-label">Unit Price</span>
              <span className="product-detail-value">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="custom-toast">
          <span className="toast-icon">✓</span>
          <span className="toast-text">{toastMessage}</span>
          <button
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
