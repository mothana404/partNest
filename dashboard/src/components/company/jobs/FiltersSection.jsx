import { useState } from "react";
import { 
  Search, Filter, SortAsc, SortDesc, FilterX, 
  ChevronDown, ChevronUp 
} from "lucide-react";

const FiltersSection = ({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters, 
  activeFiltersCount 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <>
      {/* Basic Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Categories</option>
            {filterOptions.categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          {/* Job Type */}
          <select
            value={filters.jobType}
            onChange={(e) => onFilterChange('jobType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            {filterOptions.jobTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ')}</option>
            ))}
          </select>

                   {/* Location */}
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Locations</option>
            {filterOptions.locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Date Posted</option>
              <option value="salaryMax">Salary</option>
              <option value="title">Job Title</option>
              <option value="applicationCount">Applications</option>
            </select>
            <button
              onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {filters.sortOrder === 'asc' ? 
                <SortAsc className="w-4 h-4" /> : 
                <SortDesc className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full ml-1">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.isRecent}
                onChange={(e) => onFilterChange('isRecent', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Recent Jobs (Last 7 days)
            </label>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <FilterX className="w-4 h-4" />
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Company */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Company</label>
              <select
                value={filters.company}
                onChange={(e) => onFilterChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Companies</option>
                {filterOptions.companies.map(company => (
                  <option key={company.id} value={company.id}>{company.companyName}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Experience Level</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="No Experience">No Experience Required</option>
              </select>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Salary Range ($/month)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minSalary}
                  onChange={(e) => onFilterChange('minSalary', e.target.value)}
                  className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxSalary}
                  onChange={(e) => onFilterChange('maxSalary', e.target.value)}
                  className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Application Deadline</label>
              <select
                value={filters.hasDeadline}
                onChange={(e) => onFilterChange('hasDeadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All</option>
                <option value="true">Has Deadline</option>
                <option value="false">No Deadline</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FiltersSection;