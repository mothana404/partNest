// components/dashboard/StatsCard.jsx
import { ArrowRight } from "lucide-react";

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  subtitle, 
  action, 
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {action && (
          <button 
            onClick={() => window.location.href = action.link}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            {action.label}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className="text-green-600 text-xs mt-1 font-medium">{trend}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;