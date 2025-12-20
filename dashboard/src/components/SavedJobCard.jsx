import { 
  Building2, MapPin, Calendar, DollarSign, Users, 
  BookmarkCheck, Send, Eye, Share2, Trash2, AlertCircle, Star
} from "lucide-react";

const SavedJobCard = ({ savedJob, application, onUnsave, onApply, onViewDetails, onShare }) => {
  // Handle different possible data structures with extensive logging
  if (!savedJob) {
    console.error("SavedJobCard: savedJob is null or undefined");
    return <div className="bg-white border border-red-200 rounded-lg p-6 text-red-600">
      Error: No job data provided
    </div>;
  }

  // Extract job data - handle different structures
  const job = savedJob?.job || savedJob;
  
  if (!job) {
    console.error("SavedJobCard: No job found in savedJob:", savedJob);
    return <div className="bg-white border border-red-200 rounded-lg p-6 text-red-600">
      Error: Invalid job data structure
    </div>;
  }

  console.log("SavedJobCard rendering job:", job);

  const hasApplied = !!application;

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
    new Date(job.applicationDeadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Calculate days saved with multiple fallback options
  const savedDate = savedJob?.createdAt || savedJob?.savedAt || savedJob?.updatedAt || new Date();
  const daysSaved = Math.max(0, Math.floor((new Date() - new Date(savedDate)) / (1000 * 60 * 60 * 24)));

  const handleUnsaveClick = () => {
    if (onUnsave && job?.id) {
      onUnsave(job.id);
    } else {
      console.error("Cannot unsave: missing onUnsave function or job.id");
    }
  };

  const handleApplyClick = () => {
    if (onApply && job) {
      onApply(job);
    } else {
      console.error("Cannot apply: missing onApply function or job data");
    }
  };

  const handleViewDetailsClick = () => {
    if (onViewDetails && job) {
      onViewDetails(job);
    } else {
      console.error("Cannot view details: missing onViewDetails function or job data");
    }
  };

  const handleShareClick = () => {
    if (onShare && job) {
      onShare(job);
    } else {
      console.error("Cannot share: missing onShare function or job data");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Company Logo */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.company?.user?.image ? (
                <img 
                  src={job.company.user.image} 
                  alt={job.company?.companyName || 'Company'}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-600" />
              )}
            </div>
            
            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-1 break-words line-clamp-2 leading-tight">
                {job.title || 'Job Title Not Available'}
              </h3>
              <p className="text-sm text-gray-600 mb-2 break-words">
                {job.company?.companyName || 'Company Not Available'}
              </p>
              
              {/* Saved Badge */}
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                <BookmarkCheck className="w-3 h-3" />
                <span>
                  Saved {daysSaved === 0 ? 'today' : `${daysSaved} day${daysSaved !== 1 ? 's' : ''} ago`}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                        <button
              onClick={handleShareClick}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleUnsaveClick}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove from saved"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job Meta Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">{job.jobType?.replace('_', ' ') || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">{job.applicationCount || 0} applicants</span>
          </div>
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
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${isDeadlineNear ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={isDeadlineNear ? 'text-red-600 font-medium' : 'text-gray-600'}>
                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                {isDeadlineNear && (
                  <span className="ml-1 text-red-500 font-bold">• Urgent!</span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div className="px-6 mb-4 flex-1">
        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
          {job.description || 'No description available'}
        </p>
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="px-6 mb-4">
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
              >
                {tag.name || tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{job.tags.length - 3} more
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
            Applied - {application.status?.replace('_', ' ') || 'Unknown Status'}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto p-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewDetailsClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          
          {!hasApplied ? (
            <button
              onClick={handleApplyClick}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Send className="w-4 h-4" />
              Apply Now
            </button>
          ) : (
            <div className="flex-1 text-center text-sm text-gray-500">
              Applied {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Recently'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobCard;