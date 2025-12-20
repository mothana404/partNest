// components/ApplicationCard.jsx
import { useState } from "react";
import { Calendar, MapPin, Building2, Eye, FileText, X, AlertTriangle } from "lucide-react";

const ApplicationCard = ({ 
  application, 
  statusConfig, 
  onViewDetails, 
  onViewJob, 
  onWithdraw 
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (!application || !application.job) {
    return null;
  }

  const job = application.job;
  const company = job.company || {};
  const status = statusConfig[application.status] || statusConfig.PENDING;
  
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canWithdraw = application.status === "PENDING" || application.status === "UNDER_REVIEW";

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        {/* Header with Company Logo and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
              {company.logoUrl && !imageError ? (
                <img
                  src={company.logoUrl}
                  alt={company.companyName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
              <p className="text-sm text-gray-600">{company.companyName}</p>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full border ${status.color} ${status.borderColor} flex items-center gap-1`}>
            <status.icon className="w-3 h-3" />
            <span className="text-xs font-medium">{status.label}</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Applied: {formatDate(application.createdAt || application.appliedAt)}</span>
          </div>
          
          {job.applicationDeadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Deadline: {formatDate(job.applicationDeadline)}</span>
            </div>
          )}
        </div>

                {/* Application Notes/Cover Letter Preview */}
        {application.coverLetter && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Cover Letter: </span>
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onViewDetails}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Application
          </button>
          
          <button
            onClick={onViewJob}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Job
          </button>
          
          {canWithdraw && (
            <button
              onClick={onWithdraw}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;