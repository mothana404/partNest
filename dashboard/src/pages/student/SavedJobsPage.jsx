import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { 
  Bookmark, 
  Search, 
  FilterX, 
  Building2,
  CheckCircle,
  AlertCircle,
  X,
  Trash2
} from "lucide-react";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import JobDetailsModal from "../../components/company/jobs/JobDetailsModal";
import ApplicationModal from "../../components/company/jobs/ApplicationModal";
import SavedJobCard from "../../components/SavedJobCard";
import ShareJobModal from "../../components/ShareJobModal";

const SavedJobsPage = () => {
  const { getToken } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("savedDate");
  const [filterBy, setFilterBy] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Popup states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // success, error, warning
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jobToUnsave, setJobToUnsave] = useState(null);
  
  // Additional data
  const [userApplications, setUserApplications] = useState([]);
  
  const itemsPerPage = 12;

  useEffect(() => {
    fetchSavedJobs();
    fetchUserApplications();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [savedJobs, searchTerm, sortBy, filterBy]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setTotalPages(Math.ceil(filteredJobs.length / itemsPerPage));
  }, [filteredJobs]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/student/job/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSavedJobs(response.data.data.savedJobs || []);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      showNotificationMessage("Failed to load saved jobs. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/student/job/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUserApplications(response.data.data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleUnsaveJobClick = (job) => {
    setJobToUnsave(job);
    setShowConfirmDialog(true);
  };

  const confirmUnsaveJob = async () => {
    if (!jobToUnsave) return;

    try {
      const token = getToken();
      await axios.delete(`http://localhost:8080/api/student/job/saved-jobs/${jobToUnsave.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from local state
      setSavedJobs(prev => prev.filter(savedJob => savedJob.job.id !== jobToUnsave.id));
      
      // Show success notification
      showNotificationMessage(`"${jobToUnsave.title}" has been removed from your saved jobs.`, "success");
      
      // Close confirmation dialog
      setShowConfirmDialog(false);
      setJobToUnsave(null);
      
    } catch (error) {
      console.error("Error unsaving job:", error);
      showNotificationMessage("Failed to remove job from saved list. Please try again.", "error");
    }
  };

  const handleApplyToJob = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleShareJob = (job) => {
    setSelectedJob(job);
    setShowShareModal(true);
  };

  const getApplicationStatus = (jobId) => {
    return userApplications.find(app => app.jobId === jobId);
  };

  const filterAndSortJobs = () => {
    let filtered = [...savedJobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(savedJob => 
        savedJob.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        savedJob.job.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        savedJob.job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterBy !== "ALL") {
      filtered = filtered.filter(savedJob => savedJob.job.jobType === filterBy);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "savedDate":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "jobTitle":
          return a.job.title.localeCompare(b.job.title);
        case "company":
          return (a.job.company?.companyName || "").localeCompare(b.job.company?.companyName || "");
        case "deadline":
          if (!a.job.applicationDeadline && !b.job.applicationDeadline) return 0;
          if (!a.job.applicationDeadline) return 1;
          if (!b.job.applicationDeadline) return -1;
          return new Date(a.job.applicationDeadline) - new Date(b.job.applicationDeadline);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("savedDate");
    setFilterBy("ALL");
    showNotificationMessage("Filters cleared successfully.", "success");
  };

  const getCurrentPageJobs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  };

  const onApplicationSuccess = () => {
    fetchUserApplications();
    setShowApplicationModal(false);
    setSelectedJob(null);
    showNotificationMessage("Application submitted successfully!", "success");
  };

  const jobTypes = ["PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE"];

  // Notification Component
  const NotificationPopup = () => {
    if (!showNotification) return null;

    const getNotificationIcon = () => {
      switch (notificationType) {
        case "success":
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case "error":
          return <AlertCircle className="w-5 h-5 text-red-500" />;
        case "warning":
          return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        default:
          return <CheckCircle className="w-5 h-5 text-blue-500" />;
      }
    };

    const getNotificationColors = () => {
      switch (notificationType) {
        case "success":
          return "bg-green-50 border-green-200 text-green-800";
        case "error":
          return "bg-red-50 border-red-200 text-red-800";
        case "warning":
          return "bg-yellow-50 border-yellow-200 text-yellow-800";
        default:
          return "bg-blue-50 border-blue-200 text-blue-800";
      }
    };

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] ${getNotificationColors()}`}>
          {getNotificationIcon()}
          <span className="flex-1 text-sm font-medium">{notificationMessage}</span>
          <button
            onClick={() => setShowNotification(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Confirmation Dialog Component
  const ConfirmationDialog = () => {
    if (!showConfirmDialog || !jobToUnsave) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Remove Saved Job</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to remove this job from your saved list?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="font-medium text-gray-900">{jobToUnsave.title}</p>
                <p className="text-sm text-gray-600">{jobToUnsave.company?.companyName}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setJobToUnsave(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnsaveJob}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-blue-600" />
              Saved Jobs
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your bookmarked job opportunities
            </p>
          </div>
          <div className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg">
            {filteredJobs.length} saved job{filteredJobs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Job Type Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="savedDate">Date Saved</option>
              <option value="jobTitle">Job Title</option>
              <option value="company">Company</option>
              <option value="deadline">Application Deadline</option>
            </select>
          </div>

          {(searchTerm || filterBy !== "ALL") && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <FilterX className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="min-h-[500px]">
          {loading ? (
            <LoadingSpinner message="Loading saved jobs..." />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title={savedJobs.length === 0 ? "No saved jobs yet" : "No jobs match your filters"}
              description={
                savedJobs.length === 0
                  ? "Start exploring jobs and save the ones you're interested in to see them here."
                  : "Try adjusting your search or filter criteria to find your saved jobs."
              }
              action={
                savedJobs.length === 0 ? (
                  <button
                    onClick={() => window.location.href = "/student/dashboard/jobs"}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    Browse Jobs
                  </button>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FilterX className="w-4 h-4" />
                    Clear Filters
                  </button>
                )
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getCurrentPageJobs().map((savedJob) => (
                  <SavedJobCard
                    key={savedJob.id}
                    savedJob={savedJob}
                    application={getApplicationStatus(savedJob.job.id)}
                    onUnsave={() => handleUnsaveJobClick(savedJob.job)}
                    onApply={() => handleApplyToJob(savedJob.job)}
                    onViewDetails={() => handleViewJobDetails(savedJob.job)}
                    onShare={() => handleShareJob(savedJob.job)}
                  />
                ))}
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
        {showApplicationModal && selectedJob && (
          <ApplicationModal
            job={selectedJob}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedJob(null);
            }}
            onSuccess={onApplicationSuccess}
          />
        )}

        {showJobDetails && selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            isSaved={true}
            application={getApplicationStatus(selectedJob.id)}
            onClose={() => {
              setShowJobDetails(false);
              setSelectedJob(null);
            }}
            onSave={() => handleUnsaveJobClick(selectedJob)}
            onApply={() => {
              setShowJobDetails(false);
              handleApplyToJob(selectedJob);
            }}
          />
        )}

        {showShareModal && selectedJob && (
          <ShareJobModal
            job={selectedJob}
            onClose={() => {
              setShowShareModal(false);
              setSelectedJob(null);
            }}
          />
        )}

        {/* Notification Popup */}
        <NotificationPopup />

        {/* Confirmation Dialog */}
        <ConfirmationDialog />
      </div>

      {/* Add custom styles for the slide-in animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SavedJobsPage;