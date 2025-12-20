import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, BarChart3, TrendingUp, Users, Eye, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const JobAnalyticsModal = ({ job, onClose }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [job.id, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8080/api/admin/jobs/${job.id}/analytics?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      REVIEWED: 'bg-blue-100 text-blue-800',
      INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      WITHDRAWN: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics - {job.title}
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-600">
                  {analytics.summary?.totalViews || 0}
                </div>
                <div className="text-sm text-blue-700">Total Views</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-600">
                  {analytics.summary?.totalApplications || 0}
                </div>
                <div className="text-sm text-green-700">Applications</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-600">
                  {analytics.summary?.conversionRate || 0}%
                </div>
                <div className="text-sm text-purple-700">Conversion Rate</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-orange-600">
                  {analytics.topUniversities?.length || 0}
                </div>
                <div className="text-sm text-orange-700">Universities</div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Views Over Time</h4>
                <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-600 font-medium">Views Chart</p>
                    <p className="text-blue-500 text-sm">
                      {analytics.viewsOverTime?.reduce((sum, item) => sum + item.count, 0) || 0} total views
                    </p>
                  </div>
                </div>
                {analytics.viewsOverTime && analytics.viewsOverTime.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Daily breakdown:</span>
                      <span>Peak: {Math.max(...analytics.viewsOverTime.map(v => v.count))}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Applications Over Time</h4>
                <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center border-2 border-dashed border-green-200">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Applications Chart</p>
                    <p className="text-green-500 text-sm">
                      {analytics.applicationsOverTime?.reduce((sum, item) => sum + item.count, 0) || 0} total applications
                    </p>
                  </div>
                </div>
                {analytics.applicationsOverTime && analytics.applicationsOverTime.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Daily breakdown:</span>
                      <span>Peak: {Math.max(...analytics.applicationsOverTime.map(a => a.count))}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Status Distribution */}
            {analytics.applicationStatusDistribution && analytics.applicationStatusDistribution.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {analytics.applicationStatusDistribution.map((status, index) => (
                      <div key={index} className={`p-3 rounded-lg text-center ${getStatusColor(status.status)}`}>
                        <div className="font-bold text-lg">{status.count}</div>
                        <div className="text-sm capitalize">
                          {status.status.toLowerCase().replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Top Universities */}
            {analytics.topUniversities && analytics.topUniversities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Applicant Universities</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {analytics.topUniversities.map((uni, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{uni.university}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                          {uni.count} student{uni.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Time Series Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {/* Combine views and applications data */}
                {[
                  ...(analytics.viewsOverTime || []).map(item => ({
                    ...item,
                    type: 'view'
                  })),
                  ...(analytics.applicationsOverTime || []).map(item => ({
                    ...item,
                    type: 'application'
                  }))
                ]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 10)
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        {item.type === 'view' ? (
                          <Eye className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Users className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm font-medium">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.count} {item.type === 'view' ? 'view' : 'application'}{item.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
              Analytics for {analytics.period} period. Data updates in real-time.
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No analytics data available for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAnalyticsModal;