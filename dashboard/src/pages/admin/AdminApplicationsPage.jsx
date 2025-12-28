import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react';
import ApplicationsTable from '../../components/adminApplications/ApplicationsTable';
import ApplicationDetails from '../../components/adminApplications/ApplicationDetails';
import ApplicationsStats from '../../components/adminApplications/ApplicationsStats';
import ApplicationFilters from '../../components/adminApplications/ApplicationFilters';
import BulkActions from '../../components/adminApplications/BulkActions';
import { useApplications } from '../../hooks/useApplications';

const AdminApplicationsPage = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'details', 'analytics'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    jobId: '',
    companyId: '',
    page: 1,
    limit: 10
  });

  const {
    applications,
    loading,
    pagination,
    stats,
    trends,
    fetchApplications,
    updateApplicationStatus,
    deleteApplication,
    bulkUpdateStatus
  } = useApplications();

  useEffect(() => {
    fetchApplications(filters);
  }, [filters]);

  // Calculate real stats from applications data
  const calculatedStats = useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        totalApplications: 0,
        todayApplications: 0,
        recentApplications: 0,
        avgResponseTime: 0,
        successRate: 0
      };
    }

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Total applications
    const totalApplications = pagination?.totalItems || applications.length;

    // Today's applications
    const todayApplications = applications.filter(app => 
      new Date(app.appliedAt) >= todayStart
    ).length;

    // Recent applications (this week)
    const recentApplications = applications.filter(app => 
      new Date(app.appliedAt) >= weekAgo
    ).length;

    // Average response time
    const respondedApplications = applications.filter(app => app.respondedAt);
    const avgResponseTime = respondedApplications.length > 0
      ? Math.round(
          respondedApplications.reduce((sum, app) => {
            const applied = new Date(app.appliedAt);
            const responded = new Date(app.respondedAt);
            return sum + (responded - applied) / (1000 * 60 * 60 * 24);
          }, 0) / respondedApplications.length
        )
      : 0;

    // Success rate (accepted / total)
    const acceptedCount = applications.filter(app => app.status === 'ACCEPTED').length;
    const successRate = totalApplications > 0 
      ? Math.round((acceptedCount / totalApplications) * 100) 
      : 0;

    return {
      totalApplications,
      todayApplications,
      recentApplications,
      avgResponseTime,
      successRate
    };
  }, [applications, pagination]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setCurrentView('details');
  };

  const handleStatusUpdate = async (applicationId, status, additionalData = {}) => {
    try {
      await updateApplicationStatus(applicationId, { status, ...additionalData });
      fetchApplications(filters); // Refresh data
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleBulkStatusUpdate = async (status, additionalData = {}) => {
    try {
      await bulkUpdateStatus(selectedApplications, status, additionalData);
      setSelectedApplications([]);
      fetchApplications(filters); // Refresh data
    } catch (error) {
      console.error('Error bulk updating applications:', error);
    }
  };

  const handleDelete = async (applicationId) => {
    try {
      await deleteApplication(applicationId);
      fetchApplications(filters); // Refresh data
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  // UI Components
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-lg font-medium text-gray-900">
      {children}
    </h3>
  );

  const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
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

  const renderContent = () => {
    switch (currentView) {
      case 'details':
        return (
          <ApplicationDetails
            application={selectedApplication}
            onBack={() => setCurrentView('list')}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        );
      case 'analytics':
        return (
          <ApplicationsStats
            stats={stats}
            trends={trends}
            onBack={() => setCurrentView('list')}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {calculatedStats.totalApplications}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    +{calculatedStats.recentApplications} this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Applications</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {calculatedStats.todayApplications}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Applications received today</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {calculatedStats.avgResponseTime} days
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Average time to respond</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {calculatedStats.successRate}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Acceptance rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle>Applications Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setCurrentView('analytics')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ApplicationFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
                
                {selectedApplications.length > 0 && (
                  <BulkActions
                    selectedCount={selectedApplications.length}
                    onBulkStatusUpdate={handleBulkStatusUpdate}
                    onClearSelection={() => setSelectedApplications([])}
                  />
                )}

                <ApplicationsTable
                  applications={applications}
                  loading={loading}
                  selectedApplications={selectedApplications}
                  onSelectionChange={setSelectedApplications}
                  onViewApplication={handleViewApplication}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                  pagination={pagination}
                  onPageChange={(page) => handleFilterChange('page', page)}
                />
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="text-gray-600">Monitor and manage job applications</p>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default AdminApplicationsPage;