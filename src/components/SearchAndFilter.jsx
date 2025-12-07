import { useState, useEffect } from 'react';

export default function SearchAndFilter({ 
  onSearch, 
  onFilter, 
  placeholder = "Search...", 
  filters = [], 
  searchValue = "",
  filterValue = "",
  showClearButton = true,
  className = ""
}) {
  const [search, setSearch] = useState(searchValue);
  const [filter, setFilter] = useState(filterValue);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  // Trigger filter when filter changes
  useEffect(() => {
    if (onFilter) {
      onFilter(filter);
    }
  }, [filter, onFilter]);

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  function clearSearch() {
    setSearch('');
    setFilter('');
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(search);
      }
    }
  }

  return (
    <div className={`search-filter-container ${className}`}>
      <div className="search-filter-inputs">
        {/* Search Input */}
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="search-input"
            />
            {search && showClearButton && (
              <button
                onClick={() => setSearch('')}
                className="search-clear-button"
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdown */}
        {filters.length > 0 && (
          <div className="filter-input-group">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {filters.map((filterOption) => (
                <option key={filterOption.value} value={filterOption.value}>
                  {filterOption.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear All Button */}
        {(search || filter) && showClearButton && (
          <button
            onClick={clearSearch}
            className="clear-all-button"
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(search || filter) && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="active-filters-list">
            {search && (
              <span className="active-filter">
                Search: "{search}"
                <button
                  onClick={() => setSearch('')}
                  className="active-filter-remove"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
            {filter && (
              <span className="active-filter">
                Category: {filters.find(f => f.value === filter)?.label || filter}
                <button
                  onClick={() => setFilter('')}
                  className="active-filter-remove"
                  type="button"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Advanced Search Component
export function AdvancedSearch({ onSearch, onFilter, placeholder = "Search..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    priority: '',
    tags: ''
  });

  const categories = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'general', label: 'General' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  function handleInputChange(field, value) {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSearch() {
    if (onSearch) {
      onSearch(searchParams);
    }
  }

  function handleClear() {
    setSearchParams({
      query: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      priority: '',
      tags: ''
    });
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="advanced-search-container">
      <div className="advanced-search-toggle">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="advanced-search-toggle-button"
          type="button"
        >
          <svg className={`toggle-icon ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
          Advanced Search
        </button>
      </div>

      {isOpen && (
        <div className="advanced-search-form">
          <div className="advanced-search-grid">
            {/* Basic Search */}
            <div className="search-field">
              <label>Search Query</label>
              <input
                type="text"
                value={searchParams.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
              />
            </div>

            {/* Category Filter */}
            <div className="search-field">
              <label>Category</label>
              <select
                value={searchParams.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="search-field">
              <label>Date From</label>
              <input
                type="date"
                value={searchParams.dateFrom}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Date To</label>
              <input
                type="date"
                value={searchParams.dateTo}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="search-field">
              <label>Status</label>
              <select
                value={searchParams.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="search-field">
              <label>Priority</label>
              <select
                value={searchParams.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="search-field search-field-full">
              <label>Tags</label>
              <input
                type="text"
                value={searchParams.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <div className="advanced-search-actions">
            <button onClick={handleSearch} className="search-button primary">
              Search
            </button>
            <button onClick={handleClear} className="clear-button secondary">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick Filter Pills Component
export function FilterPills({ filters, activeFilters, onFilterChange, onClearAll }) {
  return (
    <div className="filter-pills-container">
      <div className="filter-pills">
        {filters.map(filter => {
          const isActive = activeFilters.includes(filter.value);
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              type="button"
            >
              {filter.icon && <span className="filter-pill-icon">{filter.icon}</span>}
              <span className="filter-pill-label">{filter.label}</span>
              {filter.count !== undefined && (
                <span className="filter-pill-count">{filter.count}</span>
              )}
            </button>
          );
        })}
      </div>
      {activeFilters.length > 0 && (
        <button onClick={onClearAll} className="clear-filters-button" type="button">
          Clear All ({activeFilters.length})
        </button>
      )}
    </div>
  );
}













