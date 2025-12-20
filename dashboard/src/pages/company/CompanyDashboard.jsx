import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Building2,
  Users,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CompanyDashboard = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const token = getToken();
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, analyticsRes, activityRes] = await Promise.all([
      axios.get('http://localhost:8080/api/companyDashboard/stats', { headers }),
      axios.get(`http://localhost:8080/api/companyDashboard/analytics?period=${selectedPeriod}`, { headers }),
      axios.get('http://localhost:8080/api/companyDashboard/recent-activity?limit=8', { headers })
    ]);

      // Check if responses have the expected structure
      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (analyticsRes.data?.success) {
        setAnalytics(analyticsRes.data.data);
      }
      if (activityRes.data?.success) {
        setRecentActivity(activityRes.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Company role required.');
      } else if (error.response?.status === 404) {
        setError('Company profile not found. Please complete your company setup.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num) => {
    if (!num && num !== 0) return '0';
    return Math.abs(num).toFixed(1);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      REVIEWED: 'bg-blue-100 text-blue-800 border-blue-200',
      INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-800 border-purple-200',
      ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      WITHDRAWN: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActivityIcon = (type, status) => {
    if (type === 'application') {
      switch (status) {
        case 'PENDING': return <FileText className="w-4 h-4 text-yellow-600" />;
        case 'ACCEPTED': return <CheckCircle className="w-4 h-4 text-green-600" />;
        case 'REJECTED': return <XCircle className="w-4 h-4 text-red-600" />;
        default: return <FileText className="w-4 h-4 text-blue-600" />;
      }
    }
    return <Eye className="w-4 h-4 text-gray-600" />;
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(value)}</p>
          {change !== undefined && change !== null && (
            <div className="flex items-center gap-1">
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(change)}% vs last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="text-white">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Company Dashboard</h1>
              <p className="text-blue-100">
                Welcome back! Here's what's happening with your job postings today.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="7d" className="text-gray-900">Last 7 days</option>
                <option value="30d" className="text-gray-900">Last 30 days</option>
                <option value="90d" className="text-gray-900">Last 90 days</option>
                <option value="1y" className="text-gray-900">Last year</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Jobs"
            value={stats?.overview?.totalJobs || 0}
            icon={Briefcase}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Jobs"
            value={stats?.overview?.activeJobs || 0}
            change={stats?.views?.growthRate}
            changeType={stats?.views?.growthRate >= 0 ? 'increase' : 'decrease'}
            icon={Building2}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Total Applications"
            value={stats?.applications?.total || 0}
            change={stats?.applications?.growthRate}
            changeType={stats?.applications?.growthRate >= 0 ? 'increase' : 'decrease'}
            icon={FileText}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Job Views"
            value={stats?.views?.total || 0}
            change={stats?.views?.growthRate}
            changeType={stats?.views?.growthRate >= 0 ? 'increase' : 'decrease'}
            icon={Eye}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Application Status Breakdown */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <PieChart className="w-6 h-6 text-blue-600" />
                  Application Status Overview
                </h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {stats?.applications?.pending || 0}
                  </div>
                  <div className="text-sm text-yellow-700">Pending Review</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {stats?.applications?.accepted || 0}
                  </div>
                  <div className="text-sm text-green-700">Accepted</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {stats?.applications?.rejected || 0}
                  </div>
                  <div className="text-sm text-red-700">Rejected</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {stats?.metrics?.conversionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">View to Application Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {stats?.metrics?.acceptanceRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Acceptance Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {stats?.metrics?.averageApplicationsPerJob || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Apps per Job</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Jobs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-blue-600" />
              Top Performing Jobs
            </h2>
            
            <div className="space-y-4">
              {stats?.topPerformingJobs && stats.topPerformingJobs.length > 0 ? (
                stats.topPerformingJobs.slice(0, 5).map((job, index) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {job.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {job.applications || 0} apps
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {job.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No job data available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Analytics Chart Placeholder */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Applications & Views Trend ({selectedPeriod})
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Views</span>
                  </div>
                </div>
              </div>
              
              {/* Show actual data summary instead of placeholder */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {analytics?.applicationsOverTime?.reduce((sum, item) => sum + item.count, 0) || 0}
                    </div>
                    <div className="text-sm text-blue-700">Total Applications</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {analytics?.viewsOverTime?.reduce((sum, item) => sum + item.count, 0) || 0}
                    </div>
                    <div className="text-sm text-green-700">Total Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {analytics?.applicationStatusDistribution?.length || 0}
                    </div>
                    <div className="text-sm text-purple-700">Status Types</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {analytics?.jobTypePerformance?.length || 0}
                    </div>
                    <div className="text-sm text-orange-700">Job Types</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-600" />
                Recent Activity
              </h2>
              {recentActivity?.summary?.newApplications > 0 && (
                <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                  {recentActivity.summary.newApplications} new
                </div>
              )}
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity?.recentActivity && recentActivity.recentActivity.length > 0 ? (
                recentActivity.recentActivity.map((activity, index) => (
                  <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type, activity.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.student?.name || 'Unknown Student'}
                        </p>
                        {activity.isNew && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-1">
                        {activity.type === 'application' ? 'Applied to' : 'Viewed'} "{activity.job?.title || 'Unknown Job'}"
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {activity.student?.university || 'Unknown University'} • {activity.student?.major || 'Unknown Major'}
                        </p>
                        {activity.status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                            {activity.status.toLowerCase().replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Today's Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {recentActivity?.summary?.totalApplicationsToday || 0}
              </div>
              <div className="text-sm text-blue-700">Applications Today</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {recentActivity?.summary?.totalViewsToday || 0}
              </div>
              <div className="text-sm text-green-700">Views Today</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats?.applications?.weekly || 0}
              </div>
              <div className="text-sm text-purple-700">This Week</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {stats?.applications?.monthly || 0}
              </div>
              <div className="text-sm text-orange-700">This Month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;