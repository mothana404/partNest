import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { Briefcase, FilterX } from "lucide-react";
import QuickStats from "../../components/company/jobs/QuickStats";
import FiltersSection from "../../components/company/jobs/FiltersSection";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import JobCard from "../../components/company/jobs/JobCard";
import Pagination from "../../components/common/Pagination";
import ApplicationModal from "../../components/company/jobs/ApplicationModal";
import JobDetailsModal from "../../components/company/jobs/JobDetailsModal";

const BrowseJobsPage = () => {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [userApplications, setUserApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    locations: [],
    companies: [],
    jobTypes: ["PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE"]
  });

  const itemsPerPage = 12;

  // Search and filter state
  const [filters, setFilters] = useState({
    search: "",
    category: "ALL",
    jobType: "ALL", 
    location: "ALL",
    company: "ALL",
    minSalary: "",
    maxSalary: "",
    experienceLevel: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
    hasDeadline: "ALL",
    isRecent: false
  });

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchFilterOptions();
    fetchUserApplications();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchJobs();
    }, 300);
    
    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [currentPage, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "ALL" && value !== "" && value !== false) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `http://localhost:8080/api/student/job?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const { jobs, pagination } = response.data.data;
        setJobs(jobs);
        setTotalPages(pagination.totalPages);
        setTotalJobs(pagination.total);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/student/job/filter-options",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
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
      // Fix: Use response.data.data.applications, not response.data
      setUserApplications(response.data.data.applications || []);
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
    // Set to empty array on error
    setUserApplications([]);
  }
};

  const fetchSavedJobs = async () => {
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
      // Fix: Use response.data.data.savedJobs, not response.data.data
      const savedJobsData = response.data.data.savedJobs || [];
      setSavedJobs(savedJobsData.map(item => item.jobId));
    }
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    // Set to empty array on error
    setSavedJobs([]);
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

  const handleSaveJob = async (jobId) => {
    try {
      const token = getToken();
      const isSaved = savedJobs.includes(jobId);
      
      if (isSaved) {
        await axios.delete(`http://localhost:8080/api/student/job/saved-jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        await axios.post(`http://localhost:8080/api/student/job/saved-jobs/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "ALL",
      jobType: "ALL",
      location: "ALL", 
      company: "ALL",
      minSalary: "",
      maxSalary: "",
      experienceLevel: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
      hasDeadline: "ALL",
      isRecent: false
    });
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      if (value === "ALL" || value === "" || value === false) return false;
      return true;
    }).length;
  }, [filters]);

  const getApplicationStatus = (jobId) => {
    return userApplications.find(app => app.jobId === jobId);
  };

  const onApplicationSuccess = () => {
    fetchUserApplications();
    setShowApplicationModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quick Stats */}
        <QuickStats
          totalJobs={totalJobs}
          userApplications={userApplications}
          savedJobs={savedJobs}
        />

        {/* Filters */}
        <FiltersSection
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800 font-medium">
              Showing {jobs.length} of {totalJobs} jobs
              {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
            </span>
            <span className="text-blue-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="min-h-[500px]">
          {loading ? (
            <LoadingSpinner message="Loading jobs..." />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description={
                activeFiltersCount > 0 
                  ? "No jobs match your current filters. Try adjusting your search criteria."
                  : "No jobs are available at the moment. Check back later for new opportunities."
              }
              action={
                activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FilterX className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.includes(job.id)}
                    application={getApplicationStatus(job.id)}
                    onSave={() => handleSaveJob(job.id)}
                    onApply={() => handleApplyToJob(job)}
                    onViewDetails={() => handleViewJobDetails(job)}
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
            isSaved={savedJobs.includes(selectedJob.id)}
            application={getApplicationStatus(selectedJob.id)}
            onClose={() => {
              setShowJobDetails(false);
              setSelectedJob(null);
            }}
            onSave={() => handleSaveJob(selectedJob.id)}
            onApply={() => {
              setShowJobDetails(false);
              handleApplyToJob(selectedJob);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseJobsPage;