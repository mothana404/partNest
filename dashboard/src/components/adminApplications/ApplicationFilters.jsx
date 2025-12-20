import React from 'react';
import { Search, X } from 'lucide-react';

const ApplicationFilters = ({ filters, onFilterChange }) => {
  const handleClearFilters = () => {
    onFilterChange('search', '');
    onFilterChange('status', '');
    onFilterChange('dateFrom', '');
    onFilterChange('dateTo', '');
    onFilterChange('companyId', '');
  };

  const hasActiveFilters = filters.search || filters.status || filters.dateFrom || filters.dateTo;

  const Input = ({ placeholder, value, onChange, className = '', type = 'text' }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
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
    const baseStyles = 'inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
    };

    return (
      <button
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
            placeholder="Search by applicant name or email..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full lg:w-[200px]"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </Select>

        {/* Date From */}
        <Input
          type="date"
          placeholder="From date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e.target.value)}
          className="w-full lg:w-[150px]"
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="To date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange('dateTo', e.target.value)}
          className="w-full lg:w-[150px]"
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
            className="w-full lg:w-auto"
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

export default ApplicationFilters;