// components/dashboard/ProfileCompletionWidget.jsx
import { CheckCircle, AlertCircle, ArrowRight, User } from "lucide-react";

const ProfileCompletionWidget = ({ completeness, missingFields }) => {
  const getCompletionLevel = () => {
    if (completeness >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-500" };
    if (completeness >= 70) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-500" };
    if (completeness >= 50) return { level: "Average", color: "text-yellow-600", bgColor: "bg-yellow-500" };
    return { level: "Needs Work", color: "text-red-600", bgColor: "bg-red-500" };
  };

  const completion = getCompletionLevel();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          Profile Completion
        </h3>
        <button 
          onClick={() => window.location.href = "/student/dashboard/profile"}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          Edit Profile <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={completion.color}
              style={{
                strokeDasharray: `${2 * Math.PI * 40}`,
                strokeDashoffset: `${2 * Math.PI * 40 * (1 - completeness / 100)}`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{completeness}%</span>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          completeness >= 90 ? 'bg-green-100 text-green-800' :
          completeness >= 70 ? 'bg-blue-100 text-blue-800' :
          completeness >= 50 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {completeness >= 90 ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {completion.level}
        </div>
      </div>

      {/* Missing Fields */}
      {missingFields.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">To improve your profile:</h4>
          <div className="space-y-2">
            {missingFields.slice(0, 3).map((field, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span>{field}</span>
              </div>
            ))}
            {missingFields.length > 3 && (
              <div className="text-xs text-gray-500 mt-2">
                +{missingFields.length - 3} more items
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button 
        onClick={() => window.location.href = "/student/dashboard/profile"}
        className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        {completeness < 100 ? 'Complete Profile' : 'View Profile'}
      </button>

      {/* Benefits Text */}
      {completeness < 90 && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Complete profiles get 3x more views from recruiters
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionWidget;