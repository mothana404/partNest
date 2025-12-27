import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Tag,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  RefreshCw,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CategoryStatsCards from '../../components/CategoryStatsCards';
import FilterDropdown from '../../components/adminCategory/FilterDropdown';
import BulkActionsBar from '../../components/adminCategory/BulkActionsBar';
import CategoryAnalyticsModal from '../../components/adminCategory/CategoryAnalyticsModal';
import CreateCategoryModal from '../../components/adminCategory/CreateCategoryModal';

const AdminCategories = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [pagination.currentPage, filters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...filters
      });

      const response = await axios.get(
        `http://localhost:8080/api/admin/categories?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCategories(response.data.data.categories);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        'http://localhost:8080/api/admin/categories/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleCategoryAction = async (action, categoryId, data = {}) => {
    try {
      const token = getToken();
      let response;

      switch (action) {
        case 'toggleStatus':
          response = await axios.patch(
            `http://localhost:8080/api/admin/categories/${categoryId}/status`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            response = await axios.delete(
              `http://localhost:8080/api/admin/categories/${categoryId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
          break;
        case 'update':
          response = await axios.put(
            `http://localhost:8080/api/admin/categories/${categoryId}`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
      }

      if (response?.data.success) {
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error ${action}:`, error);
      alert(error.response?.data?.message || `Failed to ${action} category`);
    }
  };

  const handleBulkAction = async (action, categoryIds, data = {}) => {
    try {
      const token = getToken();
      let response;

      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${categoryIds.length} categories?`)) {
            response = await axios.post(
              'http://localhost:8080/api/admin/categories/bulk/delete',
              { categoryIds },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
          break;
        case 'status':
          response = await axios.post(
            'http://localhost:8080/api/admin/categories/bulk/status',
            { categoryIds, ...data },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
      }

      if (response?.data.success) {
        setSelectedCategories([]);
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error bulk ${action}:`, error);
      alert(error.response?.data?.message || `Failed to ${action} categories`);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        'http://localhost:8080/api/admin/categories',
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowCreateModal(false);
        fetchCategories();
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  };

//   const handleExportCSV = async () => {
//     try {
//       const token = getToken();
//       const queryParams = new URLSearchParams({
//         status: filters.status
//       });

//       const response = await axios.get(
//         `http://localhost:8080/api/admin/categories/export/csv?${queryParams}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: 'blob'
//         }
//       );

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `categories-export-${Date.now()}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Error exporting CSV:', error);
//     }
//   };

  const toggleSelectCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(category => category.id));
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading && !categories.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Tag className="w-8 h-8 text-blue-600" />
                Category Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage job categories and organize platform content
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* <button
                onClick={handleExportCSV}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button> */}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {stats && <CategoryStatsCards stats={stats} />}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search categories by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => fetchCategories()}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <FilterDropdown
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedCategories.length}
            onBulkAction={handleBulkAction}
            selectedCategories={selectedCategories}
            onClearSelection={() => setSelectedCategories([])}
          />
        )}

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2"
                    >
                      {selectedCategories.length === categories.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSelectCategory(category.id)}
                        className="flex items-center"
                      >
                        {selectedCategories.includes(category.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {category.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(category.isActive)}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-medium">{category.jobCount || 0} total</span>
                        <span className="text-xs text-green-600">
                          {category.activeJobCount || 0} active
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{category.totalApplications || 0}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(category.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(category.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowAnalyticsModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-800"
                          title="View Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleCategoryAction('toggleStatus', category.id, { isActive: !category.isActive })}
                          className={`${category.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          title={category.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {category.isActive ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleCategoryAction('delete', category.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {categories.length === 0 && !loading && (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No categories found</p>
              <p className="text-gray-400">Create your first category to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Category
              </button>
            </div>
          )}

          {/* Pagination */}
          {categories.length > 0 && (
            <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {((pagination.currentPage - 1) * 10) + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * 10, pagination.totalCategories)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalCategories}</span>{' '}
                    results
                  </p>
                </div>
                
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCategoryCreate={handleCreateCategory}
        />
      )}

      {showCategoryModal && selectedCategory && (
        <CategoryAnalyticsModal
          category={selectedCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
          onCategoryUpdate={(updatedCategory) => {
            handleCategoryAction('update', selectedCategory.id, updatedCategory);
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {showAnalyticsModal && selectedCategory && (
        <CategoryAnalyticsModal
          category={selectedCategory}
          onClose={() => {
            setShowAnalyticsModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCategories;