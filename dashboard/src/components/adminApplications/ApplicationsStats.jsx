import React from 'react';
import { ArrowLeft, TrendingUp, Users, Calendar, Clock } from 'lucide-react';

const ApplicationsStats = ({ stats, trends, onBack }) => {
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-lg font-medium text-gray-900">
      {children}
    </h3>
  );

  const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, variant = 'outline', onClick, className = '' }) => {
    const baseStyles = 'inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
    };

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const COLORS = {
    PENDING: '#f59e0b',
    REVIEWED: '#3b82f6',
    INTERVIEW_SCHEDULED: '#8b5cf6',
    ACCEPTED: '#10b981',
    REJECTED: '#ef4444',
    WITHDRAWN: '#6b7280'
  };

  const statusData = stats?.statusDistribution?.map(item => ({
    name: item.status.replace('_', ' '),
    value: item.count,
    color: COLORS[item.status]
  })) || [];

  // Simple chart component since we can't use recharts
  const SimpleBarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-20 text-sm text-gray-600 text-right">
                {item.name}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="h-4 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-900">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const SimplePieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-sm">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500">{item.value} ({percentage}%)</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const SimpleLineChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    const minValue = Math.min(...data.map(d => d.count));
    const range = maxValue - minValue || 1;

    return (
      <div className="space-y-4">
        <div className="h-48 relative border border-gray-200 rounded">
          <svg className="w-full h-full">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((item.count - minValue) / range) * 80;
                return `${x}%,${y}%`;
              }).join(' ')}
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.count - minValue) / range) * 80;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#3b82f6"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.period}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications Analytics</h1>
            <p className="text-gray-600">Detailed insights and trends</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.overview?.totalApplications || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              +{stats?.overview?.recentApplications || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.overview?.todayApplications || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Applications received today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.overview?.avgResponseTime || 0} days
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Average time to respond</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.statusDistribution ? 
                    Math.round((stats.statusDistribution.find(s => s.status === 'ACCEPTED')?.count || 0) / 
                    (stats.overview.totalApplications || 1) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Acceptance rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="space-y-6">
                <SimplePieChart data={statusData} />
                <SimpleBarChart data={statusData} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {trends?.trends && trends.trends.length > 0 ? (
              <SimpleLineChart data={trends.trends} />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {statusData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statusData.map((item, index) => {
                    const percentage = ((item.value / (stats?.overview?.totalApplications || 1)) * 100).toFixed(1);
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No status data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsStats;