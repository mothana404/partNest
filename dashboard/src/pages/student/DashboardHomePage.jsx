// pages/student/DashboardHomePage.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { 
  TrendingUp, 
  Briefcase, 
  BookmarkIcon, 
  User, 
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Building2,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatsCard from "../../components/StatsCard";
import ApplicationChart from "../../components/ApplicationChart";
import RecentActivity from "../../components/RecentActivity";
import ProfileCompletionWidget from "../../components/ProfileCompletionWidget";
import JobRecommendations from "../../components/JobRecommendations";

const DashboardHomePage = () => {
  const { getToken, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      savedJobs: 0,
      profileCompleteness: 0,
      skillsCount: 0,
      experienceCount: 0,
      linksCount: 0
    },
    applicationStats: {
      pending: 0,
      reviewed: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0
    },
    recentApplications: [],
    recentSavedJobs: [],
    jobRecommendations: [],
    upcomingInterviews: [],
    applicationTrend: [],
    topCompanies: [],
    preferredJobTypes: [],
    averageSalaryRange: null,
    gpaProgress: null,
    studentInfo: {}
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/studentDash/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const { stats, applicationStats, studentInfo } = dashboardData;

  // Calculate application success rate
  const totalApplications = stats.totalApplications;
  const successfulApplications = applicationStats.accepted;
  const successRate = totalApplications > 0 ? ((successfulApplications / totalApplications) * 100).toFixed(1) : 0;

  // Calculate profile strength
  const getProfileStrength = () => {
    if (stats.profileCompleteness >= 90) return { label: "Excellent", color: "text-green-600 bg-green-100" };
    if (stats.profileCompleteness >= 70) return { label: "Good", color: "text-blue-600 bg-blue-100" };
    if (stats.profileCompleteness >= 50) return { label: "Average", color: "text-yellow-600 bg-yellow-100" };
    return { label: "Needs Work", color: "text-red-600 bg-red-100" };
  };

  const profileStrength = getProfileStrength();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your job search today
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {studentInfo.major} • {studentInfo.university}
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                studentInfo.availability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${studentInfo.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                {studentInfo.availability ? 'Available for work' : 'Not available'}
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Applications Submitted"
            value={stats.totalApplications}
            icon={Briefcase}
            color="bg-blue-500"
            trend={dashboardData.applicationTrend.length > 1 ? "+12% this month" : null}
          />
          <StatsCard
            title="Jobs Saved"
            value={stats.savedJobs}
            icon={BookmarkIcon}
            color="bg-green-500"
            action={{ label: "Browse Jobs", link: "/student/dashboard/jobs" }}
          />
          <StatsCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={Target}
            color="bg-purple-500"
            subtitle={`${successfulApplications} accepted`}
          />
          <StatsCard
            title="Profile Strength"
            value={profileStrength.label}
            icon={User}
            color="bg-orange-500"
            subtitle={`${stats.profileCompleteness}% complete`}
            className={profileStrength.color}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Status Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Application Status</h2>
                <button 
                  onClick={() => window.location.href = "/student/dashboard/applications"}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <ApplicationChart applicationStats={applicationStats} />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{applicationStats.pending}</div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{applicationStats.reviewed}</div>
                  <div className="text-sm text-blue-700">Under Review</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{applicationStats.accepted}</div>
                  <div className="text-sm text-green-700">Accepted</div>
                </div>
              </div>
            </div>

            {/* Academic Progress & Goals */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Academic Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {studentInfo.gpa || "N/A"}
                  </div>
                  <div className="text-sm text-blue-700">Current GPA</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {studentInfo.gpa >= 3.5 ? "Excellent" : studentInfo.gpa >= 3.0 ? "Good" : "Improving"}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {studentInfo.year || "N/A"}
                  </div>
                  <div className="text-sm text-purple-700">Year of Study</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {4 - (studentInfo.year || 0)} years remaining
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {stats.skillsCount}
                  </div>
                  <div className="text-sm text-green-700">Skills Listed</div>
                  <div className="text-xs text-green-600 mt-1">
                    {stats.skillsCount >= 5 ? "Well-rounded" : "Add more skills"}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <RecentActivity
              recentApplications={dashboardData.recentApplications}
              recentSavedJobs={dashboardData.recentSavedJobs}
              upcomingInterviews={dashboardData.upcomingInterviews}
            />

            {/* Job Market Insights */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Job Market Insights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Companies Applied To */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Companies You've Applied To</h3>
                  <div className="space-y-2">
                    {dashboardData.topCompanies.slice(0, 5).map((company, index) => (
                      <div key={company.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <Building2 className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900">{company.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{company.applicationCount} applications</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Types Interest */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Your Job Type Preferences</h3>
                  <div className="space-y-2">
                    {studentInfo.preferredJobTypes && studentInfo.preferredJobTypes.length > 0 ? (
                      studentInfo.preferredJobTypes.slice(0, 5).map((type, index) => (
                        <div key={type || index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">{(type || '').replace(/_/g, ' ')}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No preferences set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <ProfileCompletionWidget
              completeness={stats.profileCompleteness}
              missingFields={[
                ...(stats.skillsCount < 3 ? ['Add more skills'] : []),
                ...(stats.experienceCount === 0 ? ['Add work experience'] : []),
                ...(stats.linksCount === 0 ? ['Add portfolio links'] : []),
                ...(!studentInfo.about ? ['Write about section'] : [])
              ]}
            />

            {/* Job Recommendations */}
            <JobRecommendations
              recommendations={dashboardData.jobRecommendations}
              studentPreferences={studentInfo}
            />

            {/* Upcoming Deadlines */}
            {dashboardData.upcomingInterviews.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {dashboardData.upcomingInterviews.map((interview, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-medium text-red-900">{interview.jobTitle}</div>
                      <div className="text-sm text-red-700">{interview.company}</div>
                      <div className="text-xs text-red-600 mt-1">
                        {new Date(interview.date).toLocaleDateString()} at {interview.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Progress Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Career Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Applications this month</span>
                  <span className="font-bold">{stats.totalApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Success rate</span>
                  <span className="font-bold">{successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Profile completion</span>
                  <span className="font-bold">{stats.profileCompleteness}%</span>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 bg-white bg-opacity-20 rounded-lg text-white font-medium hover:bg-opacity-30 transition-colors">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;