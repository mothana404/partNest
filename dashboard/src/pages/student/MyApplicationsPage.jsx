// pages/student/MyApplicationsPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { FileText, Search, FilterX, Building2, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ApplicationCard from "../../components/ApplicationCard";
import Pagination from "../../components/common/Pagination";
import JobDetailsModal from "../../components/company/jobs/JobDetailsModal";
import WithdrawApplicationModal from "../../components/WithdrawApplicationModal";
import ApplicationDetailsModal from "../../components/ApplicationDetailsModal";

const MyApplicationsPage = () => {
  const { getToken } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("applicationDate");
  const [filterBy, setFilterBy] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  const itemsPerPage = 12;

  // Application status options
  const applicationStatuses = ["PENDING", "UNDER_REVIEW", "INTERVIEW_SCHEDULED", "ACCEPTED", "REJECTED", "WITHDRAWN"];
  
  // Status configurations for styling and display
  const statusConfig = {
    PENDING: {
      label: "Pending",
      icon: Clock,
      color: "text-yellow-600 bg-yellow-100",
      borderColor: "border-yellow-200"
    },
    UNDER_REVIEW: {
      label: "Under Review",
      icon: AlertCircle,
      color: "text-blue-600 bg-blue-100",
      borderColor: "border-blue-200"
    },
    INTERVIEW_SCHEDULED: {
      label: "Interview Scheduled",
      icon: Calendar,
      color: "text-purple-600 bg-purple-100",
      borderColor: "border-purple-200"
    },
    ACCEPTED: {
      label: "Accepted",
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
      borderColor: "border-green-200"
    },
    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      color: "text-red-600 bg-red-100",
      borderColor: "border-red-200"
    },
    WITHDRAWN: {
      label: "Withdrawn",
      icon: XCircle,
      color: "text-gray-600 bg-gray-100",
      borderColor: "border-gray-200"
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, sortBy, filterBy]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredApplications.length / itemsPerPage));
  }, [filteredApplications]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("Fetching user applications...");
      
      const response = await axios.get(
        "http://localhost:8080/api/student/job/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Applications response:", response.data);

      if (response.data.success) {
        const applicationsData = response.data.data.applications || response.data.data || [];
        console.log("Processed applications:", applicationsData);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      } else {
        throw new Error(response.data.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(error.message || "Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      const token = getToken();
      await axios.patch(
        `http://localhost:8080/api/student/job/applications/${applicationId}/withdraw`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: "WITHDRAWN", withdrawnAt: new Date().toISOString() }
            : app
        )
      );
      
      setShowWithdrawModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error withdrawing application:", error);
      // You might want to show a toast notification here
    }
  };

  const handleViewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowApplicationDetails(true);
  };

  const handleViewJobDetails = (application) => {
    setSelectedApplication(application);
    setShowJobDetails(true);
  };

  const handleWithdrawClick = (application) => {
    setSelectedApplication(application);
    setShowWithdrawModal(true);
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Filter out invalid entries
    filtered = filtered.filter(application => {
      if (!application) {
        console.warn("Found null/undefined application");
        return false;
      }
      return true;
    });

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(application => {
        const job = application?.job;
        if (!job) return false;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          job.title?.toLowerCase().includes(searchLower) ||
          job.company?.companyName?.toLowerCase().includes(searchLower) ||
          job.location?.toLowerCase().includes(searchLower) ||
          application.status?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (filterBy !== "ALL") {
      filtered = filtered.filter(application => application.status === filterBy);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "applicationDate":
          return new Date(b.createdAt || b.appliedAt) - new Date(a.createdAt || a.appliedAt);
        case "jobTitle":
          return (a.job?.title || "").localeCompare(b.job?.title || "");
        case "company":
          return (a.job?.company?.companyName || "").localeCompare(b.job?.company?.companyName || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "deadline":
          if (!a.job?.applicationDeadline && !b.job?.applicationDeadline) return 0;
          if (!a.job?.applicationDeadline) return 1;
          if (!b.job?.applicationDeadline) return -1;
          return new Date(a.job.applicationDeadline) - new Date(b.job.applicationDeadline);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("applicationDate");
    setFilterBy("ALL");
  };

  const getCurrentPageApplications = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  };

  const getStatusCounts = () => {
    return applicationStatuses.reduce((counts, status) => {
      counts[status] = applications.filter(app => app.status === status).length;
      return counts;
    }, {});
  };

  const getEngagementStats = () => {
    const total = applications.length;
    if (total === 0) return { viewedCount: 0, viewedPercentage: 0, respondedCount: 0, respondedPercentage: 0 };
    
    const viewedCount = applications.filter(app => app.viewedByCompany).length;
    const respondedCount = applications.filter(app => app.respondedAt).length;
    
    return {
      viewedCount,
      viewedPercentage: Math.round((viewedCount / total) * 100),
      respondedCount,
      respondedPercentage: Math.round((respondedCount / total) * 100)
    };
  };

  const statusCounts = getStatusCounts();
  const engagementStats = getEngagementStats();
  const hasActiveFilters = searchTerm.trim() || filterBy !== "ALL";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              My Applications
            </h1>
            <p className="text-gray-600 mt-2">
              Track your job applications and their status
            </p>
          </div>
          <div className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-700">{filteredApplications.length}</span>
            <span> application{filteredApplications.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {applicationStatuses.map(status => {
            const config = statusConfig[status];
            const count = statusCounts[status] || 0;
            const isActive = filterBy === status;
            
            return (
              <button
                key={status}
                onClick={() => setFilterBy(isActive ? "ALL" : status)}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isActive 
                    ? `${config.color} ${config.borderColor} border-2` 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <config.icon className={`w-5 h-5 ${isActive ? config.color.split(' ')[0] : 'text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${isActive ? config.color.split(' ')[0] : 'text-gray-900'}`}>
                    {count}
                  </div>
                  <div className={`text-xs ${isActive ? config.color.split(' ')[0] : 'text-gray-500'}`}>
                    {config.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Engagement Statistics */}
        {applications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">Applications Viewed</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-blue-900">{engagementStats.viewedCount}</p>
                    <p className="text-sm text-blue-600">of {applications.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <span className="text-2xl font-bold text-blue-700">{engagementStats.viewedPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">Company Responses</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-green-900">{engagementStats.respondedCount}</p>
                    <p className="text-sm text-green-600">of {applications.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <span className="text-2xl font-bold text-green-700">{engagementStats.respondedPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Statuses</option>
              {applicationStatuses.map(status => (
                <option key={status} value={status}>{statusConfig[status].label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="applicationDate">Application Date</option>
              <option value="jobTitle">Job Title</option>
              <option value="company">Company</option>
              <option value="status">Status</option>
              <option value="deadline">Application Deadline</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredApplications.length} of {applications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                <FilterX className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Applications Grid */}
        <div className="min-h-[500px]">
          {loading ? (
            <LoadingSpinner message="Loading applications..." />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={fetchApplications}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="Start applying to jobs to see your applications here."
              action={
                <button
                  onClick={() => window.location.href = "/student/dashboard/jobs"}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Browse Jobs
                </button>
              }
            />
          ) : filteredApplications.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No applications match your filters"
              description="Try adjusting your search or filter criteria to find your applications."
              action={
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FilterX className="w-4 h-4" />
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getCurrentPageApplications().map((application, index) => {
                  if (!application || !application.id) {
                    console.warn("Invalid application data at index", index, ":", application);
                    return null;
                  }
                  
                  return (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      statusConfig={statusConfig}
                      onViewDetails={() => handleViewApplicationDetails(application)}
                      onViewJob={() => handleViewJobDetails(application)}
                      onWithdraw={() => handleWithdrawClick(application)}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {showApplicationDetails && selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            statusConfig={statusConfig}
            onClose={() => {
              setShowApplicationDetails(false);
              setSelectedApplication(null);
            }}
            onWithdraw={() => {
              setShowApplicationDetails(false);
              handleWithdrawClick(selectedApplication);
            }}
          />
        )}

        {showJobDetails && selectedApplication && (
          <JobDetailsModal
            job={selectedApplication.job}
            application={selectedApplication}
            onClose={() => {
              setShowJobDetails(false);
              setSelectedApplication(null);
            }}
            onApply={() => {}} // Already applied
            onSave={() => {}} // Handle save/unsave if needed
          />
        )}

        {showWithdrawModal && selectedApplication && (
          <WithdrawApplicationModal
            application={selectedApplication}
            onClose={() => {
              setShowWithdrawModal(false);
              setSelectedApplication(null);
            }}
            onConfirm={() => handleWithdrawApplication(selectedApplication.id)}
          />
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;