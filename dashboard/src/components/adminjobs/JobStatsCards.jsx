import { Briefcase, TrendingUp, Users, Eye, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

const JobStatsCards = ({ stats }) => {
  const mainCards = [
    {
      title: 'Total Jobs',
      value: stats.overview.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      change: `+${stats.overview.recentJobs} this week`
    },
    {
      title: 'Active Jobs',
      value: stats.overview.activeJobs,
      icon: TrendingUp,
      color: 'bg-green-500',
      percentage: `${((stats.overview.activeJobs / stats.overview.totalJobs) * 100).toFixed(1)}% of total`
    },
    {
      title: 'Applications',
      value: stats.metrics.totalApplications,
      icon: Users,
      color: 'bg-purple-500',
      average: `${stats.metrics.averageApplicationsPerJob} avg per job`
    },
    {
      title: 'Total Views',
      value: stats.metrics.totalViews,
      icon: Eye,
      color: 'bg-orange-500',
      conversion: `${stats.metrics.conversionRate}% conversion rate`
    }
  ];

  const statusCards = [
    { title: 'Draft', value: stats.overview.draftJobs, icon: Clock, color: 'text-gray-600' },
    { title: 'Paused', value: stats.overview.pausedJobs, icon: Clock, color: 'text-yellow-600' },
    { title: 'Closed', value: stats.overview.closedJobs, icon: XCircle, color: 'text-red-600' },
    { title: 'Featured', value: stats.overview.featuredJobs, icon: Star, color: 'text-yellow-500' }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value.toLocaleString()}</p>
                {card.change && (
                  <p className="text-sm text-green-600">{card.change}</p>
                )}
                {card.percentage && (
                  <p className="text-sm text-gray-500">{card.percentage}</p>
                )}
                {card.average && (
                  <p className="text-sm text-gray-500">{card.average}</p>
                )}
                {card.conversion && (
                  <p className="text-sm text-blue-600">{card.conversion}</p>
                )}
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusCards.map((card, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <card.icon className={`w-6 h-6 mx-auto mb-2 ${card.color}`} />
              <div className="text-xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-600">{card.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Jobs */}
      {stats.topPerformingJobs && stats.topPerformingJobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Jobs</h3>
          <div className="space-y-3">
            {stats.topPerformingJobs.slice(0, 5).map((job, index) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{job.applications} apps</div>
                  <div className="text-xs text-gray-500">{job.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStatsCards;