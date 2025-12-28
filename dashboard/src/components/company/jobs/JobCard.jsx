import { useState } from "react";
import { 
  Building2, MapPin, Calendar, DollarSign, Star, Users, 
  Bookmark, BookmarkCheck, Send, Eye, Briefcase, AlertCircle
} from "lucide-react";
import CompanyProfileModal from "../../CompanyProfileModal";


const JobCard = ({ job, isSaved, application, onSave, onApply, onViewDetails }) => {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const hasApplied = !!application;
  
  // Check if deadline has passed
  const isPastDeadline = job.applicationDeadline && 
    new Date(job.applicationDeadline) < new Date();

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isDeadlineNear = job.applicationDeadline && 
    new Date(job.applicationDeadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    !isPastDeadline;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-200 flex flex-col h-full">
        {/* Header with Save Button */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Company Logo - Clickable */}
              <button
                onClick={() => setShowCompanyModal(true)}
                className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                title="View company profile"
              >
                {job.company?.user?.image ? (
                  <img 
                    src={job.company.user.image} 
                    alt={job.company.companyName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-blue-600" />
                )}
              </button>
              
              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 break-words line-clamp-2 leading-tight">
                  {job.title}
                </h3>
                <button
                  onClick={() => setShowCompanyModal(true)}
                  className="text-sm text-gray-600 mb-2 break-words hover:text-blue-600 transition-colors text-left"
                >
                  {job.company?.companyName}
                </button>
                
                {/* Job Meta Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">{job.jobType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save Button - Better positioned */}
            <button
              onClick={onSave}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ml-3 ${
                isSaved 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          {/* Job Details Grid */}
          <div className="space-y-2 mb-4">
            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-medium text-green-600">
                  ${job.salaryMin || 0}k - ${job.salaryMax || 'Open'}k / month
                </span>
              </div>
            )}

            {/* Experience */}
            {job.experienceRequired && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 flex-shrink-0" />
                <span>Experience: {job.experienceRequired}</span>
              </div>
            )}

            {/* Deadline */}
            {job.applicationDeadline && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
                  isPastDeadline ? 'text-gray-400' : isDeadlineNear ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <span className={
                  isPastDeadline ? 'text-gray-500' : 
                  isDeadlineNear ? 'text-red-600 font-medium' : 
                  'text-gray-600'
                }>
                  Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                  {isPastDeadline && ' (Expired)'}
                </span>
              </div>
            )}

            {/* Applicants */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{job.applicationCount} applicants</span>
            </div>
          </div>
        </div>

        {/* Job Description - Controlled height */}
        <div className="px-6 mb-4 flex-1">
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="px-6 mb-4">
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                >
                  {tag.name}
                </span>
              ))}
              {job.tags.length > 4 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{job.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Application Status */}
        {hasApplied && (
          <div className="px-6 mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border ${getStatusColor(application.status)}`}>
              <Send className="w-4 h-4" />
              Applied - {application.status.replace('_', ' ')}
            </div>
          </div>
        )}

        {/* Deadline Expired Warning */}
        {isPastDeadline && !hasApplied && (
          <div className="px-6 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border bg-gray-100 text-gray-600 border-gray-300">
              <AlertCircle className="w-4 h-4" />
              Application deadline has passed
            </div>
          </div>
        )}

        {/* Actions - Fixed at bottom */}
        <div className="mt-auto p-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onViewDetails}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            
            {!hasApplied ? (
              <button
                onClick={isPastDeadline ? undefined : onApply}
                disabled={isPastDeadline}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                  isPastDeadline 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title={isPastDeadline ? 'Application deadline has passed' : 'Apply for this job'}
              >
                <Send className="w-4 h-4" />
                {isPastDeadline ? 'Deadline Passed' : 'Apply Now'}
              </button>
            ) : (
              <div className="flex-1 text-center">
                <div className="text-sm text-gray-500">
                  Applied on {new Date(application.appliedAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Profile Modal */}
      {showCompanyModal && job.company?.id && (
        <CompanyProfileModal
          companyId={job.company.id}
          onClose={() => setShowCompanyModal(false)}
        />
      )}
    </>
  );
};

export default JobCard;