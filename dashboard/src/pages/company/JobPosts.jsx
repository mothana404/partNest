import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, MapPin, Clock, DollarSign, Users, TrendingUp } from "lucide-react";
import CreateJobForm from "../../components/company/jobs/CreateJobForm";
import EditJobForm from "../../components/company/jobs/EditJobForm";
import JobDetailsView from "../../components/company/jobs/JobDetailsView";
import Pagination from "../../components/company/jobs/Pagination";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const JobPosts = () => {
  const { user, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      if (statusFilter && statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      const response = await axios.get(
        `http://localhost:8080/api/job?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const { jobs, pagination } = response.data.data;
        setJobs(jobs || []);
        setTotalPages(pagination?.totalPages || 0);
        setTotalJobs(pagination?.totalItems || jobs?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.post(
        "http://localhost:8080/api/job/create",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setActiveTab("list");
        await fetchJobs();
        Swal.fire({ icon: "success", title: "Job Posted", text: "Your job has been posted successfully." });
      }
      
      if (response.data.success === false && response.status === 403) {
        setJobs([]);
        setTotalPages(0);
        Swal.fire({ icon: "error", title: "Company Not Verified", text: response.data.message || "Your company is not verified to post jobs. Please contact support." });
      }
    } catch (error) {
      console.error("Error creating job:", error);
      if (error?.response?.status === 403) {
        setJobs([]);
        setTotalPages(0);
        Swal.fire({ icon: "error", title: "Company Not Verified", text: error.response?.data?.message || "Your company is not verified to post jobs. Please contact support." });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: error.response.data.errors || "There was an error creating the job. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = async (jobData) => {
    setLoading(true);
    try {
      const token = getToken();
      const { id, ...updateData } = jobData;

      const response = await axios.put(
        `http://localhost:8080/api/job/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setActiveTab("list");
        await fetchJobs();
        Swal.fire({ icon: "success", title: "Job Updated", text: "Job updated successfully." });
      }
    } catch (error) {
      console.error("Error updating job:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update job. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete this job.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (confirmation.isConfirmed) {
      try {
        const token = getToken();
        const response = await axios.delete(
          `http://localhost:8080/api/job/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          await fetchJobs();
          Swal.fire({ icon: "success", title: "Deleted", text: "Job deleted successfully." });
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete job. Please try again." });
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      PAUSED: "bg-yellow-100 text-yellow-800",
      CLOSED: "bg-gray-100 text-gray-800",
      EXPIRED: "bg-red-100 text-red-800",
      DRAFT: "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatSalary = (job) => {
    if (!job.salaryMin && !job.salaryMax) return "Not specified";
    const currency = job.salaryCurrency || "USD";
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin}-${job.salaryMax} ${currency}`;
    }
    if (job.salaryMin) return `From ${job.salaryMin} ${currency}`;
    if (job.salaryMax) return `Up to ${job.salaryMax} ${currency}`;
    return "Not specified";
  };

  const formatJobType = (type) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <div className="p-6">
            <CreateJobForm
              onSubmit={handleCreateJob}
              onCancel={() => setActiveTab("list")}
            />
          </div>
        );
      case "edit":
        return (
          <div className="p-6">
            <EditJobForm
              job={selectedJob}
              onSubmit={handleEditJob}
              onCancel={() => setActiveTab("list")}
            />
          </div>
        );
      case "view":
        return (
          <div className="p-6">
            <JobDetailsView
              job={selectedJob}
              onEdit={() => setActiveTab("edit")}
              onClose={() => setActiveTab("list")}
            />
          </div>
        );
      default:
        return renderJobsList();
    }
  };

  const renderJobsList = () => (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Posts</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and track performance</p>
        </div>
        <button
          onClick={() => setActiveTab("create")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-green-600">
                {jobs.filter(job => job.status === 'ACTIVE').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-purple-600">
                {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-orange-600">
                {jobs.reduce((sum, job) => sum + (job.viewCount || 0), 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-[160px]">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="CLOSED">Closed</option>
              <option value="EXPIRED">Expired</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-2">
              {searchTerm || statusFilter !== "ALL" ? "No jobs match your filters" : "No jobs found"}
            </div>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "ALL" 
                ? "Try adjusting your search criteria or filters." 
                : "Create your first job posting to get started."
              }
            </p>
            <button
              onClick={() => setActiveTab("create")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary Range
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {job.category?.name || 'Uncategorized'}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900 mb-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatJobType(job.jobType)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{job.location || "Remote"}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatSalary(job)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 mb-1">
                            <span className="font-medium">{job.applicationCount || 0}</span> applications
                          </div>
                          <div className="text-gray-500">
                            <span className="font-medium">{job.viewCount || 0}</span> views
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{new Date(job.createdAt).toLocaleDateString()}</div>
                        <div className="text-gray-500 text-xs">
                          {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setActiveTab("view");
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                              setActiveTab("edit");
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete Job"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default JobPosts;