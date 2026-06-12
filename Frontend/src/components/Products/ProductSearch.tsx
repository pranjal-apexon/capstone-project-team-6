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
    setLocalFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updated = { ...localFilters, category: e.target.value || undefined };
    setLocalFilters(updated);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
    }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({
      ...prev,
      maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
    }));
  };

  // ⚡ THE FIX: Explicitly intercepting the Enter keypress
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Stop any bubble up or default actions
      executeSearch();
    }
  };

  const executeSearch = () => {
    dispatch(setFilters(localFilters));
    onFiltersChange(localFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleClearFilters = () => {
    const emptyFilters: ProductFilters = {};
    setLocalFilters(emptyFilters);
    dispatch(setFilters(emptyFilters));
    onFiltersChange(emptyFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="product-search-panel">
      <div className="search-filter-grid">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={localFilters.searchTerm || ''}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} /* 👈 Added */
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={localFilters.category || ''}
            onChange={handleCategoryChange}
            onKeyDown={handleKeyDown} /* 👈 Added */
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
          <label htmlFor="minPrice">Min price ($)</label>
          <input
            type="number"
            id="minPrice"
            placeholder="0"
            value={localFilters.minPrice !== undefined ? localFilters.minPrice : ''}
            onChange={handleMinPriceChange}
            onKeyDown={handleKeyDown} /* 👈 Added */
            min="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max price ($)</label>
          <input
            type="text"
            id="maxPrice"
            placeholder="∞"
            value={localFilters.maxPrice !== undefined ? localFilters.maxPrice : ''}
            onChange={handleMaxPriceChange}
            onKeyDown={handleKeyDown} /* 👈 Added */
          />
        </div>
      </div>

      <div className="search-buttons-row">
        <button type="submit" className="btn-filter-apply">
          Apply
        </button>

        <button type="button" onClick={handleClearFilters} className="btn-filter-clear">
          Clear
        </button>

        {isAdmin && onAddProduct && (
          <button type="button" onClick={onAddProduct} className="btn-filter-apply style-admin-add">
            + Add Product
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductSearch;