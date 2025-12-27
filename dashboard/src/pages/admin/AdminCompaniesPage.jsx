import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building,
  Users,
  CheckCircle,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useCompanies } from '../../hooks/useCompanies';
import CompanyDetails from '../../components/adminCompany/CompanyDetails';
import CompaniesStats from '../../components/adminCompany/CompaniesStats';
import CompanyFilters from '../../components/adminCompany/CompanyFilters';
import CompaniesTable from '../../components/adminCompany/CompaniesTable';

const AdminCompaniesPage = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Separate state for each filter - prevents unnecessary re-renders
  const [searchInput, setSearchInput] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    allCompanies,
    loading,
    stats,
    fetchAllCompanies,
    fetchStats,
    verifyCompany,
    toggleCompanyStatus,
    deleteCompany
  } = useCompanies();

  // Fetch all companies when server filters change (not search)
  useEffect(() => {
    const serverFilters = {
      isVerified: verifiedFilter,
      isActive: activeFilter,
      industry: industryFilter
    };
    fetchAllCompanies(serverFilters);
  }, [verifiedFilter, activeFilter, industryFilter, fetchAllCompanies]);

  // Fetch stats once on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Client-side filtering with useMemo - prevents re-renders
  const { paginatedCompanies, pagination } = useMemo(() => {
    let filtered = [...allCompanies];

    // Apply search filter (client-side)
    if (searchInput) {
      const searchLower = searchInput.toLowerCase();
      filtered = filtered.filter(company => 
        company.companyName?.toLowerCase().includes(searchLower) ||
        company.industry?.toLowerCase().includes(searchLower) ||
        company.user?.email?.toLowerCase().includes(searchLower) ||
        company.user?.fullName?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      paginatedCompanies: paginated,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage
      }
    };
  }, [allCompanies, searchInput, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, verifiedFilter, activeFilter, industryFilter]);

  const handleFilterChange = (key, value) => {
    switch(key) {
      case 'search':
        setSearchInput(value);
        break;
      case 'isVerified':
        setVerifiedFilter(value);
        break;
      case 'isActive':
        setActiveFilter(value);
        break;
      case 'industry':
        setIndustryFilter(value);
        break;
      case 'limit':
        setItemsPerPage(value);
        setCurrentPage(1);
        break;
      case 'page':
        setCurrentPage(value);
        break;
      default:
        break;
    }
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setCurrentView('details');
  };

  const handleVerifyCompany = async (companyId, isVerified) => {
    await verifyCompany(companyId, isVerified);
    await fetchStats();
  };

  const handleToggleStatus = async (companyId) => {
    await toggleCompanyStatus(companyId);
    await fetchStats();
  };

  const handleDelete = async (companyId) => {
    await deleteCompany(companyId);
    await fetchStats();
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CompanyFilters
                  filters={{
                    search: searchInput,
                    isVerified: verifiedFilter,
                    isActive: activeFilter,
                    industry: industryFilter,
                    limit: itemsPerPage
                  }}
                  onFilterChange={handleFilterChange}
                />

                <CompaniesTable
                  companies={paginatedCompanies}
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