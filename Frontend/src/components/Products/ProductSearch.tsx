import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ProductFilters } from '../../types/product.types';
import { setFilters } from '../../store/productSlice';
import type { RootState } from '../../store/store';
import '../styles/products.css';

interface ProductSearchProps {
  onFiltersChange: (filters: ProductFilters) => void;
  isAdmin?: boolean;
  onAddProduct?: () => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onFiltersChange,
  isAdmin = false,
  onAddProduct,
}) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.product);
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters || {});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, searchTerm: e.target.value };
    setLocalFilters(newFilters);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...localFilters, category: e.target.value || undefined };
    setLocalFilters(newFilters);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
    };
    setLocalFilters(newFilters);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
    };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: ProductFilters = {};
    setLocalFilters(emptyFilters);
    dispatch(setFilters(emptyFilters));
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="product-search">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={localFilters.searchTerm || ''}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={localFilters.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            placeholder="Min"
            value={localFilters.minPrice || ''}
            onChange={handleMinPriceChange}
            min="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            placeholder="Max"
            value={localFilters.maxPrice || ''}
            onChange={handleMaxPriceChange}
            min="0"
          />
        </div>

        <button onClick={handleApplyFilters} className="btn-primary">
          Apply Filters
        </button>
        <button onClick={handleClearFilters} className="btn-secondary">
          Clear Filters
        </button>
      </div>

      {isAdmin && onAddProduct && (
        <div className="admin-actions">
          <button onClick={onAddProduct} className="btn-primary">
            + Add Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
