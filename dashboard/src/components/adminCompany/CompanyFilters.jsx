import React from 'react';
import { Search, X } from 'lucide-react';

const CompanyFilters = ({ filters, onFilterChange }) => {
  // Local debounced search to update parent only after user stops typing
  const [localSearch, setLocalSearch] = React.useState(filters.search || '');

  React.useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange('search', localSearch);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(t);
  }, [localSearch, filters.search, onFilterChange]);

  const handleClearFilters = () => {
    setLocalSearch('');
    onFilterChange('search', '');
    onFilterChange('isVerified', '');
    onFilterChange('isActive', '');
    onFilterChange('industry', '');
  };

  const hasActiveFilters = filters.search || filters.isVerified || filters.isActive || filters.industry;

  const Input = ({ placeholder, value, onChange, className = '', type = 'text' }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      autoComplete="off"
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );

  const Select = ({ value, onChange, children, className = '' }) => (
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
    </select>
  );

  const Button = ({ children, variant = 'outline', onClick, className = '' }) => {
    const baseStyles = 'inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const variantStyles = {
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
    };

    return (
      <button
        type="button"
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by company name, industry, or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
          {(localSearch !== '' && localSearch !== filters.search) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400 italic">searching...</span>
            </div>
          )}
        </div>

        {/* Verification Status Filter */}
        <Select
          value={filters.isVerified}
          onChange={(e) => onFilterChange('isVerified', e.target.value)}
          className="w-full lg:w-[180px]"
        >
          <option value="">All Verification</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </Select>

        {/* Active Status Filter */}
        <Select
          value={filters.isActive}
          onChange={(e) => onFilterChange('isActive', e.target.value)}
          className="w-full lg:w-[150px]"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>

        {/* Industry Filter */}
        <Select
          value={filters.industry}
          onChange={(e) => onFilterChange('industry', e.target.value)}
          className="w-full lg:w-[180px]"
        >
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="Retail">Retail</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Other">Other</option>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            className="w-full lg:w-auto whitespace-nowrap"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Show:</span>
        <Select
          value={filters.limit.toString()}
          onChange={(e) => onFilterChange('limit', parseInt(e.target.value))}
          className="w-[80px]"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
        <span className="text-sm text-gray-600">items per page</span>
      </div>
    </div>
  );
};

export default CompanyFilters;