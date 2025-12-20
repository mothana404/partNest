import React, { useState, useEffect } from 'react';
import { 
  Building,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';
import { useCompanies } from '../../hooks/useCompanies';
import CompanyDetails from '../../components/adminCompany/CompanyDetails';
import CompaniesStats from '../../components/adminCompany/CompaniesStats';
import CompanyFilters from '../../components/adminCompany/CompanyFilters';
import CompaniesTable from '../../components/adminCompany/CompaniesTable';

const AdminCompaniesPage = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'details', 'stats'
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    isVerified: '',
    isActive: '',
    industry: '',
    page: 1,
    limit: 10
  });

  const {
    companies,
    loading,
    pagination,
    stats,
    fetchCompanies,
    fetchStats,
    verifyCompany,
    toggleCompanyStatus,
    deleteCompany
  } = useCompanies();

  useEffect(() => {
    fetchCompanies(filters);
    fetchStats();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setCurrentView('details');
  };

  const handleVerifyCompany = async (companyId, isVerified) => {
    try {
      await verifyCompany(companyId, isVerified);
      fetchCompanies(filters); // Refresh data
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error verifying company:', error);
    }
  };

  const handleToggleStatus = async (companyId) => {
    try {
      await toggleCompanyStatus(companyId);
      fetchCompanies(filters); // Refresh data
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error toggling company status:', error);
    }
  };

  const handleDelete = async (companyId) => {
    try {
      await deleteCompany(companyId);
      fetchCompanies(filters); // Refresh data
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error deleting company:', error);
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
          <CompanyDetails
            company={selectedCompany}
            onBack={() => setCurrentView('list')}
            onVerify={handleVerifyCompany}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        );
      case 'stats':
        return (
          <CompaniesStats
            stats={stats}
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
                      <p className="text-sm font-medium text-gray-600">Total Companies</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.totalCompanies || 0}
                      </p>
                    </div>
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    +{stats?.recentCompanies || 0} this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Companies</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.activeCompanies || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Verified Companies</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.verifiedCompanies || 0}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Verified status</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats?.pendingVerification || 0}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Awaiting verification</p>
                </CardContent>
              </Card>
            </div>

            {/* Companies Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle>Companies Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setCurrentView('stats')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Statistics
                    </Button>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CompanyFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />

                <CompaniesTable
                  companies={companies}
                  loading={loading}
                  onViewCompany={handleViewCompany}
                  onVerifyCompany={handleVerifyCompany}
                  onToggleStatus={handleToggleStatus}
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
          <h1 className="text-3xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-600">Monitor and manage registered companies</p>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default AdminCompaniesPage;