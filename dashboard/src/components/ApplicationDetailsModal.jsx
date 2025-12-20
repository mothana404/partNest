// components/ApplicationDetailsModal.jsx
import { useState } from "react";
import { X, FileText, Download, Calendar, MapPin, Building2, User, Mail, Phone } from "lucide-react";

const ApplicationDetailsModal = ({ 
  application, 
  statusConfig, 
  onClose, 
  onWithdraw 
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (!application) return null;

  const job = application.job || {};
  const company = job.company || {};
  const status = statusConfig[application.status] || statusConfig.PENDING;
  
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSimpleDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canWithdraw = application.status === "PENDING" || application.status === "UNDER_REVIEW";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
              {company.logoUrl && !imageError ? (
                <img
                  src={company.logoUrl}
                  alt={company.companyName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-gray-600">{company.companyName}</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${status.color} ${status.borderColor} mt-2`}>
                <status.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{status.label}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Application Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Applied on {formatDate(application.createdAt || application.appliedAt)}
                </span>
              </div>
              
              {application.reviewedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Under review since {formatDate(application.reviewedAt)}
                  </span>
                </div>
              )}
              
              {application.interviewScheduledAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Interview scheduled on {formatDate(application.interviewScheduledAt)}
                  </span>
                </div>
              )}
              
              {application.status === "ACCEPTED" && application.acceptedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Accepted on {formatDate(application.acceptedAt)}
                  </span>
                </div>
              )}
              
              {application.status === "REJECTED" && application.rejectedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Rejected on {formatDate(application.rejectedAt)}
                  </span>
                </div>
              )}
              
              {application.status === "WITHDRAWN" && application.withdrawnAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Withdrawn on {formatDate(application.withdrawnAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
              <div className="space-y-2">
                {job.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                
                {job.jobType && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{job.jobType.replace('_', ' ')}</span>
                  </div>
                )}
                
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 text-center">💰</span>
                    <span>{job.salary}</span>
                  </div>
                )}
                
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {formatSimpleDate(job.applicationDeadline)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{company.companyName || "Company name not available"}</span>
                </div>
                
                {company.industry && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 text-center">🏢</span>
                    <span>{company.industry}</span>
                  </div>
                )}
                
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 text-center">🌐</span>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Resume */}
          {application.resumeUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {application.resumeFileName || "Resume.pdf"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {formatSimpleDate(application.createdAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={application.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Interview Details (if applicable) */}
          {application.status === "INTERVIEW_SCHEDULED" && application.interviewDetails && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Details</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="space-y-2">
                  {application.interviewDetails.date && (
                    <div className="flex items-center gap-2 text-sm text-purple-700">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(application.interviewDetails.date)}</span>
                    </div>
                  )}
                  
                  {application.interviewDetails.type && (
                    <div className="flex items-center gap-2 text-sm text-purple-700">
                      <span className="w-4 h-4 text-center">📹</span>
                      <span>{application.interviewDetails.type}</span>
                    </div>
                  )}
                  
                  {application.interviewDetails.notes && (
                    <div className="mt-3">
                      <p className="text-sm text-purple-700">
                        <span className="font-medium">Notes: </span>
                        {application.interviewDetails.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {application.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 whitespace-pre-wrap">
                  {application.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Application ID: {application.id}
          </div>
          <div className="flex items-center gap-3">
            {canWithdraw && (
              <button
                onClick={onWithdraw}
                className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Withdraw Application
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;