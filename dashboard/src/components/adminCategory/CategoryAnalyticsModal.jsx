import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CategoryAnalyticsModal = ({ category, onClose }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [category.id, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8080/api/admin/categories/${category.id}/analytics?period=${period}`,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics - {category.name}
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-600">
                  {analytics.jobsOverTime?.reduce((sum, item) => sum + item.count, 0) || 0}
                </div>
                <div className="text-sm text-blue-700">Jobs Posted</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-600">
                  {analytics.applicationsOverTime?.reduce((sum, item) => sum + item.count, 0) || 0}
                </div>
                <div className="text-sm text-green-700">Applications</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-600">
                  {analytics.jobTypeDistribution?.length || 0}
                </div>
                <div className="text-sm text-purple-700">Job Types</div>
              </div>
            </div>

            {/* Job Type Distribution */}
            {analytics.jobTypeDistribution && analytics.jobTypeDistribution.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Type Performance</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {analytics.jobTypeDistribution.map((type, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{type.jobType}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{type.jobCount} jobs</div>
                          <div className="text-sm text-gray-500">
                            {type.applicationCount} applications
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Jobs Posted Over Time</h4>
                <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-600 text-sm">Chart Placeholder</p>
                  </div>
                </div>
                {analytics.jobsOverTime && (
                  <div className="mt-2 text-xs text-gray-600">
                    Total: {analytics.jobsOverTime.reduce((sum, item) => sum + item.count, 0)} jobs
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Applications Over Time</h4>
                <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center border-2 border-dashed border-green-200">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-1" />
                    <p className="text-green-600 text-sm">Chart Placeholder</p>
                  </div>
                </div>
                {analytics.applicationsOverTime && (
                  <div className="mt-2 text-xs text-gray-600">
                    Total: {analytics.applicationsOverTime.reduce((sum, item) => sum + item.count, 0)} applications
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Analytics for the {period} period. Integrate with Chart.js or Recharts for visual charts.
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryAnalyticsModal;