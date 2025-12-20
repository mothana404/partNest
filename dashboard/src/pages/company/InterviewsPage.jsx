import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const InterviewsPage = () => {
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    today: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    sort: "date_asc",
    view: "all", // all, upcoming, past
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sort: filters.sort,
      });
  
      const response = await axios.get(
        `http://localhost:8080/api/candidate/interviews?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        const { interviews, stats, pagination } = response.data.data;
        setInterviews(interviews || []);
        setStats(stats || {
          total: 0,
          upcoming: 0,
          past: 0,
          today: 0,
          thisWeek: 0,
        });
        setTotalPages(pagination?.totalPages || 0);
        setTotalItems(pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]);
      setStats({
        total: 0,
        upcoming: 0,
        past: 0,
        today: 0,
        thisWeek: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.sort, getToken]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== "search") {
      // Reset to first page when changing view or sort (but not search to allow real-time filtering)
      setCurrentPage(1);
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      !filters.search ||
      interview.student?.user?.fullName
        ?.toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      interview.job?.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesView =
      filters.view === "all" ||
      (filters.view === "upcoming" && !interview.isPast) ||
      (filters.view === "past" && interview.isPast);

    return matchesSearch && matchesView;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Interviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Past</p>
            <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student or job title..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <select
            value={filters.view}
            onChange={(e) => handleFilterChange("view", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Interviews</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date_asc">Date: Earliest First</option>
            <option value="date_desc">Date: Latest First</option>
            <option value="student_name">Student Name</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInterviewCard = (interview) => {
    const isPastInterview = interview.isPast;
    const isTodayInterview = isToday(interview.interviewDate);

    return (
      <div
        key={interview.id}
        className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 ${
          isPastInterview
            ? "border-gray-200 opacity-60"
            : isTodayInterview
            ? "border-purple-300 shadow-lg"
            : "border-green-200 hover:shadow-lg"
        }`}
      >
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isPastInterview
                ? "bg-gray-100 text-gray-700"
                : isTodayInterview
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            {isPastInterview
              ? "Completed"
              : isTodayInterview
              ? "Today"
              : "Upcoming"}
          </div>
          {interview.interviewType && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {interview.interviewType}
            </span>
          )}
        </div>

        {/* Student Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            {interview.student?.user?.image ? (
              <img
                src={interview.student.user.image}
                alt={interview.student.user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {interview.student?.user?.fullName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {interview.student?.major} • {interview.student?.university}
            </p>
            {interview.student?.gpa && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>GPA: {interview.student.gpa}/4.0</span>
              </div>
            )}
          </div>
        </div>

        {/* Job Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900">
              {interview.job?.title}
            </span>
          </div>
          {interview.job?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{interview.job.location}</span>
            </div>
          )}
        </div>

        {/* Interview Date & Time */}
        <div
          className={`rounded-lg p-4 mb-4 ${
            isPastInterview
              ? "bg-gray-50 border border-gray-200"
              : isTodayInterview
              ? "bg-purple-50 border border-purple-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar
              className={`w-5 h-5 ${
                isPastInterview
                  ? "text-gray-600"
                  : isTodayInterview
                  ? "text-purple-600"
                  : "text-green-600"
              }`}
            />
            <span
              className={`font-semibold ${
                isPastInterview
                  ? "text-gray-900"
                  : isTodayInterview
                  ? "text-purple-900"
                  : "text-green-900"
              }`}
            >
              {formatDate(interview.interviewDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock
              className={`w-5 h-5 ${
                isPastInterview
                  ? "text-gray-600"
                  : isTodayInterview
                  ? "text-purple-600"
                  : "text-green-600"
              }`}
            />
            <span
              className={`font-semibold ${
                isPastInterview
                  ? "text-gray-900"
                  : isTodayInterview
                  ? "text-purple-900"
                  : "text-green-900"
              }`}
            >
              {formatTime(interview.interviewDate)}
            </span>
          </div>
        </div>

        {/* Notes Preview */}
        {interview.interviewNotes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium text-gray-900">Notes: </span>
              {interview.interviewNotes}
            </p>
          </div>
        )}

        {/* Contact Actions */}
        <div className="flex gap-2">
          <a
            href={`mailto:${interview.student?.user?.email}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
          {interview.student?.user?.phoneNumber && (
            <a
              href={`tel:${interview.student.user.phoneNumber}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Schedule
          </h1>
          <p className="text-gray-600">
            Manage and track your scheduled interviews with candidates
          </p>
        </div>

        {/* Stats */}
        {renderStats()}

        {/* Filters */}
        {renderFilters()}

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {filters.search || filters.view !== "all" ? (
                <>
                  Showing {filteredInterviews.length} of {interviews.length} interviews on this page
                  {totalItems > interviews.length && ` (${totalItems} total)`}
                </>
              ) : (
                <>
                  Showing {interviews.length} of {totalItems} interviews
                </>
              )}
            </p>
          </div>
        )}

        {/* Interviews Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Loading interviews...</p>
            </div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No interviews scheduled
                </h3>
                <p className="text-gray-500">
                  {filters.search || filters.view !== "all"
                    ? "No interviews match your current filters."
                    : "Schedule interviews with candidates from your applications."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInterviews.map((interview) =>
                renderInterviewCard(interview)
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewsPage;