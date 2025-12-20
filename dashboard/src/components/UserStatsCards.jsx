import { Users, UserCheck, UserPlus, Building } from 'lucide-react';

const UserStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.overview.recentUsers} this month`
    },
    {
      title: 'Active Users',
      value: stats.overview.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      percentage: `${((stats.overview.activeUsers / stats.overview.totalUsers) * 100).toFixed(1)}%`
    },
    {
      title: 'Students',
      value: stats.byRole.students,
      icon: UserPlus,
      color: 'bg-purple-500',
      percentage: `${((stats.byRole.students / stats.overview.totalUsers) * 100).toFixed(1)}%`
    },
    {
      title: 'Companies',
      value: stats.byRole.companies,
      icon: Building,
      color: 'bg-orange-500',
      percentage: `${((stats.byRole.companies / stats.overview.totalUsers) * 100).toFixed(1)}%`
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

export default UserStatsCards;