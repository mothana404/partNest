import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
  RefreshCw,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import UserStatsCards from '../../components/UserStatsCards';
import FilterDropdown from '../../components/FilterDropdown';
import BulkActionsBar from '../../components/BulkActionsBar';
import UserModal from '../../components/UserModal';

const AdminUsers = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    verified: 'all',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [pagination.currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...filters
      });

      const response = await axios.get(
        `http://localhost:8080/api/admin/users?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        'http://localhost:8080/api/admin/users/stats',
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

  const handleUserAction = async (action, userId, data = {}) => {
    try {
      const token = getToken();
      let response;

      switch (action) {
        case 'toggleStatus':
          response = await axios.patch(
            `http://localhost:8080/api/admin/users/${userId}/status`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'verify':
          response = await axios.patch(
            `http://localhost:8080/api/admin/users/${userId}/verify`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'delete':
          response = await axios.delete(
            `http://localhost:8080/api/admin/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'resetPassword':
          response = await axios.post(
            `http://localhost:8080/api/admin/users/${userId}/reset-password`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
      }

      if (response?.data.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error ${action}:`, error);
    }
  };

  const handleBulkAction = async (action, userIds, data = {}) => {
    try {
      const token = getToken();
      let response;

      switch (action) {
        case 'delete':
          response = await axios.post(
            'http://localhost:8080/api/admin/users/bulk/delete',
            { userIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'status':
          response = await axios.post(
            'http://localhost:8080/api/admin/users/bulk/status',
            { userIds, ...data },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'verify':
          response = await axios.post(
            'http://localhost:8080/api/admin/users/bulk/verify',
            { userIds, ...data },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
      }

      if (response?.data.success) {
        setSelectedUsers([]);
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error bulk ${action}:`, error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = getToken();
      const queryParams = new URLSearchParams({
        role: filters.role,
        status: filters.status,
        verified: filters.verified
      });

      const response = await axios.get(
        `http://localhost:8080/api/admin/users/export/csv?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.user_id));
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800 border-red-200',
      COMPANY: 'bg-blue-100 text-blue-800 border-blue-200',
      STUDENT: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading && !users.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
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
                <Users className="w-8 h-8 text-blue-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all platform users, roles, and permissions
              </p>
            </div>

            <div className="flex items-center gap-3">
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {stats && <UserStatsCards stats={stats} />}

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
                    placeholder="Search by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => fetchUsers()}
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
        {selectedUsers.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedUsers.length}
            onBulkAction={handleBulkAction}
            selectedUsers={selectedUsers}
            onClearSelection={() => setSelectedUsers([])}
          />
        )}

        {/* Users Table */}
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
                      {selectedUsers.length === users.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Additional Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSelectUser(user.user_id)}
                        className="flex items-center"
                      >
                        {selectedUsers.includes(user.user_id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.image ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.image}
                              alt={user.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.phoneNumber && (
                            <div className="text-xs text-gray-400">
                              {user.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.isActive)}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {/* Only show verified badge for COMPANY role */}
                        {user.role === 'COMPANY' && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${user.isVerified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.student && (
                        <div>
                          <div className="font-medium">{user.student.university}</div>
                          <div className="text-xs">{user.student.major}</div>
                          {user.student.year && (
                            <div className="text-xs">Year {user.student.year}</div>
                          )}
                        </div>
                      )}
                      {user.company && (
                        <div>
                          <div className="font-medium">{user.company.companyName}</div>
                          <div className="text-xs">{user.company.industry}</div>
                          {user.company.isVerified && (
                            <div className="text-xs text-green-600">Verified Company</div>
                          )}
                        </div>
                      )}
                      {user.location && (
                        <div className="text-xs text-gray-400 mt-1">
                          📍 {user.location}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.stats && (
                        <div className="text-xs">
                          {user.role === 'STUDENT' && (
                            <>
                              <div>Apps: {user.stats.applicationCount || 0}</div>
                              <div>Saved: {user.stats.savedJobCount || 0}</div>
                            </>
                          )}
                          {user.role === 'COMPANY' && (
                            <>
                              <div>Jobs: {user.stats.jobCount || 0}</div>
                              <div>Apps: {user.stats.totalApplications || 0}</div>
                            </>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                      {user.lastLogin && (
                        <div className="text-xs text-gray-400">
                          Last: {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleUserAction('toggleStatus', user.user_id, { isActive: !user.isActive })}
                          className={`${user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          disabled={user.role === 'ADMIN' && !user.isActive}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        {/* Only show verify button for COMPANY role */}
                        {user.role === 'COMPANY' && (
                          <button
                            onClick={() => handleUserAction('verify', user.user_id, { isVerified: !user.isVerified })}
                            className={`${user.isVerified ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                            title={user.isVerified ? 'Unverify company' : 'Verify company'}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}

                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleUserAction('delete', user.user_id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
                    {Math.min(pagination.currentPage * 10, pagination.totalUsers)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalUsers}</span>{' '}
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
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onUserUpdate={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;