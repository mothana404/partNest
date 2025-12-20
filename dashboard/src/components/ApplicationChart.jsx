// components/dashboard/ApplicationChart.jsx
import { CheckCircle, Clock, AlertCircle, XCircle, Calendar, UserX } from "lucide-react";

const ApplicationChart = ({ applicationStats }) => {
  const total = Object.values(applicationStats).reduce((sum, count) => sum + count, 0);
  
  const statusConfig = {
    pending: { 
      label: "Pending", 
      color: "bg-yellow-500", 
      lightColor: "bg-yellow-100", 
      textColor: "text-yellow-700",
      icon: Clock 
    },
    reviewed: { 
      label: "Under Review", 
      color: "bg-blue-500", 
      lightColor: "bg-blue-100", 
      textColor: "text-blue-700",
      icon: AlertCircle 
    },
    interviewed: { 
      label: "Interview Scheduled", 
      color: "bg-purple-500", 
      lightColor: "bg-purple-100", 
      textColor: "text-purple-700",
      icon: Calendar 
    },
    accepted: { 
      label: "Accepted", 
      color: "bg-green-500", 
      lightColor: "bg-green-100", 
      textColor: "text-green-700",
      icon: CheckCircle 
    },
    rejected: { 
      label: "Rejected", 
      color: "bg-red-500", 
      lightColor: "bg-red-100", 
      textColor: "text-red-700",
      icon: XCircle 
    },
    withdrawn: { 
      label: "Withdrawn", 
      color: "bg-gray-500", 
      lightColor: "bg-gray-100", 
      textColor: "text-gray-700",
      icon: UserX 
    }
  };

  const getPercentage = (count) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  const getBarWidth = (count) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (total === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-2">No applications yet</p>
        <p className="text-sm text-gray-400">Start applying to jobs to see your progress here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Application Progress</span>
          <span>{total} total applications</span>
        </div>
        
        {/* Stacked Progress Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full flex">
            {Object.entries(applicationStats).map(([status, count]) => {
              const config = statusConfig[status];
              const width = getBarWidth(count);
              
              if (count === 0) return null;
              
              return (
                <div
                  key={status}
                  className={`h-full ${config.color} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${width}%` }}
                  title={`${config.label}: ${count} (${getPercentage(count)}%)`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(applicationStats).map(([status, count]) => {
          const config = statusConfig[status];
          const IconComponent = config.icon;
          const percentage = getPercentage(count);
          
          return (
            <div
              key={status}
              className={`p-3 ${config.lightColor} rounded-lg border border-gray-200 hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-xs font-medium ${config.textColor}`}>
                  {percentage}%
                </span>
              </div>
              <div className={`text-lg font-bold ${config.textColor} mb-1`}>
                {count}
              </div>
              <div className="text-xs text-gray-600">
                {config.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Rate Indicator */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Success Rate</span>
          <span className={`font-semibold ${
            applicationStats.accepted > 0 
              ? 'text-green-600' 
              : applicationStats.pending > 0 
                ? 'text-yellow-600' 
                : 'text-gray-500'
          }`}>
            {total > 0 ? `${getPercentage(applicationStats.accepted)}%` : '0%'}
          </span>
        </div>
        
        {applicationStats.accepted > 0 && (
          <div className="mt-2 text-xs text-green-600">
            🎉 {applicationStats.accepted} offer{applicationStats.accepted !== 1 ? 's' : ''} received!
          </div>
        )}
        
        {applicationStats.pending > 0 && applicationStats.accepted === 0 && (
          <div className="mt-2 text-xs text-yellow-600">
            ⏳ {applicationStats.pending} application{applicationStats.pending !== 1 ? 's' : ''} still pending
          </div>
        )}
        
        {total === applicationStats.rejected && applicationStats.rejected > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            💪 Keep applying! Every "no" gets you closer to your "yes"
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Insights</h4>
        <div className="space-y-1 text-xs text-gray-600">
          {applicationStats.pending > 0 && (
            <div>• You have {applicationStats.pending} applications awaiting response</div>
          )}
          {applicationStats.interviewed > 0 && (
            <div>• {applicationStats.interviewed} interview{applicationStats.interviewed !== 1 ? 's' : ''} scheduled - great progress!</div>
          )}
          {applicationStats.accepted > 0 && (
            <div>• Congratulations on {applicationStats.accepted} job offer{applicationStats.accepted !== 1 ? 's' : ''}!</div>
          )}
          {total >= 10 && applicationStats.accepted === 0 && (
            <div>• Consider reviewing and updating your application materials</div>
          )}
          {applicationStats.rejected > applicationStats.accepted && applicationStats.rejected > 2 && (
            <div>• Don't give up! Consider seeking feedback to improve your applications</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationChart;