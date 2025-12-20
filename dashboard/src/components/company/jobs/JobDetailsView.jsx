import { ArrowLeft, Edit, MapPin, Clock, DollarSign, Users, Eye, Calendar } from 'lucide-react';

const JobDetailsView = ({ job, onEdit, onClose }) => {
  if (!job) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-200';
      case 'DRAFT': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">Job Details</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Job
        </button>
      </div>

      {/* Job Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {job.jobType?.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary Range</p>
              <p className="font-medium text-gray-900">
                ${job.salaryMin} - ${job.salaryMax}/hr
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Applications</p>
              <p className="font-medium text-gray-900">{job.applicationCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Views</p>
              <p className="font-medium text-gray-900">{job.viewCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="prose max-w-none text-gray-700">
              <p>{job.description}</p>
            </div>
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            </div>
          )}

          {job.responsibilities && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{job.responsibilities}</p>
              </div>
            </div>
          )}

          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{job.benefits}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
          <div className="space-y-3">
            {job.experienceRequired && (
              <div className="flex justify-between">
                <span className="text-gray-500">Experience Required:</span>
                <span className="font-medium text-gray-900">{job.experienceRequired}</span>
              </div>
            )}
            {job.educationRequired && (
              <div className="flex justify-between">
                <span className="text-gray-500">Education Required:</span>
                <span className="font-medium text-gray-900">{job.educationRequired}</span>
              </div>
            )}
            {job.maxApplications && (
              <div className="flex justify-between">
                <span className="text-gray-500">Max Applications:</span>
                <span className="font-medium text-gray-900">{job.maxApplications}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Posted:</span>
              <span className="font-medium text-gray-900">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
            {job.applicationDeadline && (
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="font-medium text-gray-900">
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Applications</span>
              <span className="text-2xl font-bold text-blue-600">{job.applicationCount}</span>
            </div>
            <div className="flex items-center justify-between">
                            <span className="text-gray-500">Total Views</span>
              <span className="text-2xl font-bold text-green-600">{job.viewCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: job.maxApplications ? `${Math.min((job.applicationCount / job.maxApplications) * 100, 100)}%` : '0%' 
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {job.maxApplications 
                ? `${job.applicationCount} of ${job.maxApplications} applications received`
                : `${job.applicationCount} applications received`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsView;