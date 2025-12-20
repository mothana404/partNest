import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  User,
  MapPin,
  Calendar,
  GraduationCap,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  FilterX,
  SortAsc,
  SortDesc,
  Briefcase,
  DollarSign,
  Mail,
  Award,
  Users,
} from "lucide-react";
import axios from "axios";
import CandidateDetailsView from "../../components/company/CandidateDetailsView";
import Pagination from "../../components/company/jobs/Pagination";
import { useAuth } from "../../hooks/useAuth";

const CandidatesPage = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState("list");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applicationID, setApplicationID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    university: "ALL",
    major: "ALL",
    minGpa: "",
    maxGpa: "",
    year: "ALL",
    availability: "ALL",
    minAge: "",
    maxAge: "",
    skills: "",
    minSalary: "",
    maxSalary: "",
    location: "ALL",
    hasExperience: "ALL",
    sortBy: "appliedAt",
    sortOrder: "desc",
  });

  const [filterOptions, setFilterOptions] = useState({
    universities: [],
    majors: [],
    locations: [],
    skills: [],
  });

  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchCandidates();
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [currentPage, filters]);

  const fetchFilterOptions = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/candidate/filter-options",
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

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add all active filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "ALL" && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `http://localhost:8080/api/candidate?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const { candidates, pagination } = response.data.data;
        setCandidates(candidates);
        setTotalPages(pagination.totalPages);
        setTotalCandidates(pagination.totalItems);
      } else {
        console.error("API returned error:", response.data.message);
        setCandidates([]);
        setTotalPages(0);
        setTotalCandidates(0);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates([]);
      setTotalPages(0);
      setTotalCandidates(0);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId,
    updateData
  ) => {
    try {
      const token = getToken();

      // Prepare the request body to match backend expectations
      const requestBody = {
        status: {
          status: updateData.status,
          feedBack: updateData.feedback || "",
        },
      };

      // Add interviewDate if it exists
      if (updateData.interviewDate) {
        requestBody.status.interviewDate = updateData.interviewDate;
      }

      const response = await axios.put(
        `http://localhost:8080/api/candidate/applications/${applicationId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        await fetchCandidates();
        // Show success notification
      } else {
        console.error(
          "Failed to update application status:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      university: "ALL",
      major: "ALL",
      minGpa: "",
      maxGpa: "",
      year: "ALL",
      availability: "ALL",
      minAge: "",
      maxAge: "",
      skills: "",
      minSalary: "",
      maxSalary: "",
      location: "ALL",
      hasExperience: "ALL",
      sortBy: "appliedAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "sortBy" || key === "sortOrder") return false;
      if (value === "ALL" || value === "") return false;
      return true;
    }).length;
  }, [filters]);

  const exportCandidates = async () => {
    try {
      const token = getToken();
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "ALL" && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `http://localhost:8080/api/company/candidates/export?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `candidates_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting candidates:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      case "INTERVIEW_SCHEDULED":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const jordanianUniversities = [
    "University of Jordan",
    "Jordan University of Science and Technology",
    "Yarmouk University",
    "Hashemite University",
    "Mutah University",
    "Al al-Bayt University",
    "Al-Balqa Applied University",
    "Tafila Technical University",
    "German Jordanian University",
    "Princess Sumaya University for Technology",
    "Philadelphia University",
    "Applied Science Private University",
    "Middle East University",
    "Isra University",
    "Petra University",
    "Zarqa University",
    "Irbid National University",
    "Jerash University",
    "Amman Arab University",
    "Al-Ahliyya Amman University",
    "Al-Zaytoonah University of Jordan",
  ];

  const renderQuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Candidates</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalCandidates}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-gray-900">
              {candidates.filter((c) => c.status === "PENDING").length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Interviews</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                candidates.filter((c) => c.status === "INTERVIEW_SCHEDULED")
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="text-2xl font-bold text-gray-900">
              {candidates.filter((c) => c.status === "ACCEPTED").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBasicFilters = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, skills, or major..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* University */}
        <select
          value={filters.university}
          onChange={(e) => handleFilterChange("university", e.target.value)}
          className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <option value="ALL">All Universities</option>
          {jordanianUniversities.map((university) => (
            <option key={university} value={university}>
              {university}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="appliedAt">Applied Date</option>
            <option value="gpa">GPA</option>
            <option value="fullName">Name</option>
            <option value="university">University</option>
          </select>
          <button
            onClick={() =>
              handleFilterChange(
                "sortOrder",
                filters.sortOrder === "asc" ? "desc" : "asc"
              )
            }
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {filters.sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Filter className="w-4 h-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <FilterX className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );

  const renderAdvancedFilters = () =>
    showAdvancedFilters && (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Advanced Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Major */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Major</label>
            <select
              value={filters.major}
              onChange={(e) => handleFilterChange("major", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Majors</option>
              {filterOptions.majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Year of Graduation
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Years</option>
              {Array.from({ length: 10 }, (_, i) => 2025 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* GPA Range */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              GPA Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                max="4"
                step="0.1"
                value={filters.minGpa}
                onChange={(e) => handleFilterChange("minGpa", e.target.value)}
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                min="0"
                max="4"
                step="0.1"
                value={filters.maxGpa}
                onChange={(e) => handleFilterChange("maxGpa", e.target.value)}
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Age Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                min="18"
                max="65"
                value={filters.minAge}
                onChange={(e) => handleFilterChange("minAge", e.target.value)}
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                min="18"
                max="65"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange("maxAge", e.target.value)}
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Skills</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js"
              value={filters.skills}
              onChange={(e) => handleFilterChange("skills", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Expected Salary ($/month)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minSalary}
                onChange={(e) =>
                  handleFilterChange("minSalary", e.target.value)
                }
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxSalary}
                onChange={(e) =>
                  handleFilterChange("maxSalary", e.target.value)
                }
                className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) =>
                handleFilterChange("availability", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          {/* Has Experience */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Experience
            </label>
            <select
              value={filters.hasExperience}
              onChange={(e) =>
                handleFilterChange("hasExperience", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All</option>
              <option value="true">Has Experience</option>
              <option value="false">No Experience</option>
            </select>
          </div>
        </div>
      </div>
    );

  const renderCandidateCard = (candidate) => (
    <div
      key={candidate.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Profile Image */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
          {candidate.student?.user?.image ? (
            <img
              src={candidate.student.user.image}
              alt={candidate.student.user.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-blue-600" />
          )}
        </div>

        {/* Name and Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg break-words leading-tight">
            {candidate.student?.user?.fullName}
          </h3>
          <p className="text-sm text-gray-600 break-words">
            {candidate.student?.major}
          </p>
          {candidate.student?.user?.email && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 break-all">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{candidate.student.user.email}</span>
            </p>
          )}
        </div>

        {/* Status Badges - Fixed positioning */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
              candidate.status
            )} whitespace-nowrap`}
          >
            {getStatusIcon(candidate.status)}
            <span className="hidden sm:inline">
              {candidate.status.replace("_", " ")}
            </span>
          </div>
          {candidate.student?.availability && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full whitespace-nowrap">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="hidden sm:inline">Available</span>
            </span>
          )}
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-3 mb-4 flex flex-col">
        {/* University and Year */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <GraduationCap className="w-4 h-4 flex-shrink-0" />
          <span className="break-words flex-1 min-w-0">
            {candidate.student?.university}
          </span>
          {candidate.student?.year && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
              Year {candidate.student.year}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="break-words flex-1 min-w-0">
            {candidate.student?.user?.location || "Location not specified"}
          </span>
        </div>

        {/* Applied Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">
            Applied {new Date(candidate.appliedAt).toLocaleDateString()}
          </span>
        </div>

        {/* GPA and Age Row */}
        <div className="flex items-center justify-between gap-4">
          {candidate.student?.gpa && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="whitespace-nowrap">
                GPA: {candidate.student.gpa}/4.0
              </span>
            </div>
          )}

          {candidate.student?.age && (
            <div className="text-xs text-gray-500 whitespace-nowrap">
              Age: {candidate.student.age}
            </div>
          )}
        </div>

        {/* Expected Salary */}
        {(candidate.student?.expectedSalaryMin ||
          candidate.student?.expectedSalaryMax) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span className="break-words">
              Expected: ${candidate.student.expectedSalaryMin || 0}k - $
              {candidate.student.expectedSalaryMax || "Open"}k
            </span>
          </div>
        )}
      </div>

      {/* Skills */}
      {candidate.student?.user?.skills &&
        candidate.student.user.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Top Skills:
            </p>
            <div className="flex flex-wrap gap-1">
              {candidate.student.user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 break-words max-w-full"
                >
                  <Award className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {skill.name}
                    {skill.level && (
                      <span className="text-blue-500 ml-1">
                        ({skill.level})
                      </span>
                    )}
                  </span>
                </span>
              ))}
              {candidate.student.user.skills.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                  +{candidate.student.user.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

      {/* Experience Indicator */}
      {candidate.student?.user?.experiences &&
        candidate.student.user.experiences.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {candidate.student.user.experiences.length} Experience(s)
              </span>
            </div>
            {candidate.student.user.experiences[0] && (
              <p className="text-xs text-gray-500 break-words leading-tight">
                Latest:{" "}
                <span className="font-medium">
                  {candidate.student.user.experiences[0]?.title}
                </span>
                {candidate.student.user.experiences[0]?.companyName && (
                  <span>
                    {" "}
                    at {candidate.student.user.experiences[0].companyName}
                  </span>
                )}
              </p>
            )}
          </div>
        )}

      <div className="mt-auto pt-4 border-t border-gray-200">
        {/* View Profile Button */}
        <button
          onClick={() => {
            setSelectedCandidate(candidate);
            setActiveTab("view");
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Eye className="w-4 h-4" />
          View Profile
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "view":
        return (
          <CandidateDetailsView
            candidate={selectedCandidate}
            onUpdateStatus={handleUpdateApplicationStatus}
            onClose={() => setActiveTab("list")}
          />
        );
      default:
        return renderCandidatesList();
    }
  };

  const renderCandidatesList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage job applications • {totalCandidates} total
            candidates
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      {renderQuickStats()}

      {/* Filters */}
      {renderBasicFilters()}
      {renderAdvancedFilters()}

      {/* Results Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-800 font-medium">
            Showing {candidates.length} of {totalCandidates} candidates
            {activeFiltersCount > 0 &&
              ` with ${activeFiltersCount} filter${
                activeFiltersCount > 1 ? "s" : ""
              } applied`}
          </span>
          <span className="text-blue-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Loading candidates...</p>
            </div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No candidates found
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeFiltersCount > 0
                    ? "No candidates match your current filters. Try adjusting your search criteria."
                    : "No job applications have been received yet."}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FilterX className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {candidates.map((candidate) => renderCandidateCard(candidate))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CandidatesPage;
