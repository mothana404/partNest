import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  MoreVertical,
  RefreshCw,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  Building
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import JobStatsCards from '../../components/adminjobs/JobStatsCards';
import FilterDropdown from '../../components/adminjobs/FilterDropdown';
import BulkActionsBar from '../../components/adminjobs/BulkActionsBar';
import JobAnalyticsModal from '../../components/adminjobs/JobAnalyticsModal';
import JobApplicationsModal from '../../components/adminjobs/JobApplicationsModal';
import JobModal from '../../components/adminjobs/JobModal';

const AdminJobs = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    jobType: 'all',
    categoryId: 'all',
    featured: 'all',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    dateFrom: '',
    dateTo: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchStats();
    fetchCategories();
  }, [pagination.currentPage, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        )
      });

      const response = await axios.get(
        `http://localhost:8080/api/admin/jobs?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobs(response.data.data.jobs);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        'http://localhost:8080/api/admin/jobs/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        'http://localhost:8080/api/admin/categories',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleJobAction = async (action, jobId, data = {}) => {
    try {
      const token = getToken();
      let response;

      switch (action) {
        case 'updateStatus':
          response = await axios.patch(
            `http://localhost:8080/api/admin/jobs/${jobId}/status`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'toggleFeature':
          response = await axios.patch(
            `http://localhost:8080/api/admin/jobs/${jobId}/feature`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this job?')) {
            response = await axios.delete(
              `http://localhost:8080/api/admin/jobs/${jobId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
          break;
        case 'approve':
          response = await axios.post(
            `http://localhost:8080/api/admin/jobs/${jobId}/approve`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'reject':
          const reason = prompt('Please provide a reason for rejection:');
          if (reason) {
            response = await axios.post(
              `http://localhost:8080/api/admin/jobs/${jobId}/reject`,
              { reason },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
          break;
      }

      if (response?.data.success) {
        fetchJobs();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error ${action}:`, error);
      alert(error.response?.data?.message || `Failed to ${action} job`);
    }
  };

  const handleBulkAction = async (action, jobIds, data = {}) => {
    try {
      const token = getToken();
      let response;

      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${jobIds.length} jobs?`)) {
            response = await axios.post(
              'http://localhost:8080/api/admin/jobs/bulk/delete',
              { jobIds },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
          break;
        case 'status':
          response = await axios.post(
            'http://localhost:8080/api/admin/jobs/bulk/status',
            { jobIds, ...data },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'approve':
          response = await axios.post(
            'http://localhost:8080/api/admin/jobs/bulk/approve',
            { jobIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
      }

      if (response?.data.success) {
        setSelectedJobs([]);
        fetchJobs();
        fetchStats();
      }
    } catch (error) {
      console.error(`Error bulk ${action}:`, error);
      alert(error.response?.data?.message || `Failed to ${action} jobs`);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = getToken();
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        )
      );

      const response = await axios.get(
        `http://localhost:8080/api/admin/jobs/export/csv?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jobs-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const toggleSelectJob = (jobId) => {
    setSelectedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job.id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
      PAUSED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CLOSED: 'bg-red-100 text-red-800 border-red-200',
      EXPIRED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      PART_TIME: 'bg-blue-100 text-blue-800',
      CONTRACT: 'bg-purple-100 text-purple-800',
      INTERNSHIP: 'bg-green-100 text-green-800',
      FREELANCE: 'bg-orange-100 text-orange-800',
      REMOTE: 'bg-indigo-100 text-indigo-800'
    };
    return colors[jobType] || 'bg-gray-100 text-gray-800';
  };

  const formatSalary = (job) => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()} ${job.salaryCurrency}`;
    }
    return 'Not specified';
  };

  if (loading && !jobs.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
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
                <Briefcase className="w-8 h-8 text-blue-600" />
                Job Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all job postings, applications, and analytics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
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
        {stats && <JobStatsCards stats={stats} />}

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
                    placeholder="Search jobs by title, description, or location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => fetchJobs()}
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
                categories={categories}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedJobs.length}
            onBulkAction={handleBulkAction}
            selectedJobs={selectedJobs}
            onClearSelection={() => setSelectedJobs([])}
          />
        )}

        {/* Jobs Table */}
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
                      {selectedJobs.length === jobs.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
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
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSelectJob(job.id)}
                        className="flex items-center"
                      >
                        {selectedJobs.includes(job.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {job.title}
                            </p>
                            {job.isFeatured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getJobTypeColor(job.jobType)}`}>
                              {job.jobType.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">{job.category?.name}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {formatSalary(job)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job.company?.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.company?.industry}
                        </div>
                        {job.company?.isVerified && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      {job.applicationDeadline && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(job.applicationDeadline).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {job.applicationCount || 0} total
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.metrics?.pendingApplications || 0} pending
                        </div>
                        <div className="text-xs text-green-600">
                          {job.metrics?.acceptedApplications || 0} accepted
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-900">
                          <Eye className="w-3 h-3" />
                          {job.viewCount || 0} views
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.metrics?.recentViews || 0} this week
                        </div>
                        <div className="text-xs text-blue-600">
                          {job.metrics?.conversionRate || 0}% conversion
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(job.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowAnalyticsModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="View Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowApplicationsModal(true);
                          }}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="View Applications"
                        >
                          <Users className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleJobAction('toggleFeature', job.id, { isFeatured: !job.isFeatured })}
                          className={`p-1 ${job.isFeatured ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-400 hover:text-yellow-600'}`}
                          title={job.isFeatured ? 'Remove Featured' : 'Make Featured'}
                        >
                          <Star className={`w-4 h-4 ${job.isFeatured ? 'fill-current' : ''}`} />
                        </button>

                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-800 p-1">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-1">
                              {job.status === 'DRAFT' && (
                                <button
                                  onClick={() => handleJobAction('approve', job.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                >
                                  Approve Job
                                </button>
                              )}
                              <button
                                onClick={() => handleJobAction('updateStatus', job.id, { status: job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' })}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {job.status === 'ACTIVE' ? 'Pause Job' : 'Activate Job'}
                              </button>
                              <button
                                onClick={() => handleJobAction('updateStatus', job.id, { status: 'CLOSED' })}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Close Job
                              </button>
                              <button
                                onClick={() => handleJobAction('delete', job.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete Job
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {jobs.length === 0 && !loading && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No jobs found</p>
              <p className="text-gray-400">Try adjusting your filters to see more results</p>
            </div>
          )}

          {/* Pagination */}
          {jobs.length > 0 && (
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
                      {Math.min(pagination.currentPage * 10, pagination.totalJobs)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalJobs}</span>{' '}
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
      {showJobModal && selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
          onJobUpdate={() => {
            fetchJobs();
            fetchStats();
          }}
        />
      )}

      {showAnalyticsModal && selectedJob && (
        <JobAnalyticsModal
          job={selectedJob}
          onClose={() => {
            setShowAnalyticsModal(false);
            setSelectedJob(null);
          }}
        />
      )}

      {showApplicationsModal && selectedJob && (
        <JobApplicationsModal
          job={selectedJob}
          onClose={() => {
            setShowApplicationsModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminJobs;