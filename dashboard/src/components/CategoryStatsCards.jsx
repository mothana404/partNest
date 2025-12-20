import { Tag, TrendingUp, Briefcase, Users } from 'lucide-react';

const CategoryStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Categories',
      value: stats.overview.totalCategories,
      icon: Tag,
      color: 'bg-blue-500',
      change: `+${stats.overview.recentCategories} this month`
    },
    {
      title: 'Active Categories',
      value: stats.overview.activeCategories,
      icon: TrendingUp,
      color: 'bg-green-500',
      percentage: `${((stats.overview.activeCategories / stats.overview.totalCategories) * 100).toFixed(1)}%`
    },
    {
      title: 'Total Jobs',
      value: stats.overview.totalJobs,
      icon: Briefcase,
      color: 'bg-purple-500',
      average: `${stats.overview.averageJobsPerCategory} avg per category`
    },
    {
      title: 'Total Applications',
      value: stats.overview.totalApplications,
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{card.value.toLocaleString()}</p>
              {card.change && (
                <p className="text-sm text-green-600">{card.change}</p>
              )}
              {card.percentage && (
                <p className="text-sm text-gray-500">{card.percentage} of total</p>
              )}
              {card.average && (
                <p className="text-sm text-gray-500">{card.average}</p>
              )}
            </div>
            <div className={`p-4 rounded-2xl ${card.color}`}>
              <card.icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStatsCards;