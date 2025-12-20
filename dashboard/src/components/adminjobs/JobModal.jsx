import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Briefcase, Building, MapPin, DollarSign, Calendar, Users, Eye, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const JobModal = ({ job, onClose, onJobUpdate }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [job.id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8080/api/admin/jobs/${job.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
      PAUSED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CLOSED: 'bg-red-100 text-red-800 border-red-200',
      EXPIRED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading && !jobDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {jobDetails && (
          <div className="p-6">
            {/* Job Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{jobDetails.job.title}</h1>
                  {jobDetails.job.isFeatured && (
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {jobDetails.job.company?.companyName}
                  </div>
                  {jobDetails.job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {jobDetails.job.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted {new Date(jobDetails.job.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(jobDetails.job.status)}`}>
                    {jobDetails.job.status}
                  </span>
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {jobDetails.job.jobType?.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                    {jobDetails.job.category?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-600">{jobDetails.job.applicationCount || 0}</div>
                <div className="text-sm text-blue-700">Applications</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-600">{jobDetails.viewStats?.reduce((sum, stat) => sum + stat.count, 0) || 0}</div>
                <div className="text-sm text-green-700">Views</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-600">
                  {jobDetails.job.applicationDeadline ? 
                    new Date(jobDetails.job.applicationDeadline).toLocaleDateString() : 
                    'No deadline'
                  }
                </div>
                <div className="text-sm text-purple-700">Deadline</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-orange-600">
                  {jobDetails.job.salaryMin && jobDetails.job.salaryMax ? 
                    `${jobDetails.job.salaryMin.toLocaleString()}-${jobDetails.job.salaryMax.toLocaleString()}` : 
                    'Not specified'
                  }
                </div>
                <div className="text-sm text-orange-700">
                  {jobDetails.job.salaryCurrency || 'Salary'}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.job.description}</p>
              </div>
            </div>

            {/* Requirements & Responsibilities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {jobDetails.job.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.job.requirements}</p>
                  </div>
                </div>
              )}
              {jobDetails.job.responsibilities && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.job.responsibilities}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            {jobDetails.job.benefits && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{jobDetails.job.benefits}</p>
                </div>
              </div>
            )}

            {/* Company Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Company</span>
                    <p className="font-medium">{jobDetails.job.company?.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Industry</span>
                    <p className="font-medium">{jobDetails.job.company?.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Contact</span>
                    <p className="font-medium">{jobDetails.job.company?.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <p className="font-medium">
                      {jobDetails.job.company?.isVerified ? 'Verified Company' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Status Distribution */}
            {jobDetails.applicationStats && jobDetails.applicationStats.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {jobDetails.applicationStats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-medium text-gray-900">{stat.count}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {stat.status.toLowerCase().replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Applications */}
            {jobDetails.recentApplications && jobDetails.recentApplications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Applications</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {jobDetails.recentApplications.map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium text-sm">{app.student?.user?.fullName}</div>
                          <div className="text-xs text-gray-500">
                            {app.student?.university} • {app.student?.major}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded ${
                            app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {app.status}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {jobDetails.job.tags && jobDetails.job.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.job.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobModal;