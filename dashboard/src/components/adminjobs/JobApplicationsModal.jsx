import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const JobApplicationsModal = ({ job, onClose }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationDetail, setShowApplicationDetail] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [job.id, pagination.currentPage, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        )
      });

      const response = await axios.get(
        `http://localhost:8080/api/admin/jobs/${job.id}/applications?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setApplications(response.data.data.applications);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus, feedback = '') => {
    try {
      const token = getToken();
      const response = await axios.patch(
        `http://localhost:8080/api/admin/jobs/applications/${applicationId}/status`,
        { 
          status: newStatus,
          feedback,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      REVIEWED: 'bg-blue-100 text-blue-800 border-blue-200',
      INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-800 border-purple-200',
      ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      WITHDRAWN: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="w-4 h-4" />,
      REVIEWED: <Eye className="w-4 h-4" />,
      INTERVIEW_SCHEDULED: <Calendar className="w-4 h-4" />,
      ACCEPTED: <CheckCircle className="w-4 h-4" />,
      REJECTED: <XCircle className="w-4 h-4" />,
      WITHDRAWN: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const handleQuickAction = (application, action) => {
    switch (action) {
      case 'accept':
        if (window.confirm('Accept this application?')) {
          handleStatusUpdate(application.id, 'ACCEPTED');
        }
        break;
      case 'review':
        handleStatusUpdate(application.id, 'REVIEWED');
        break;
      case 'interview':
        if (window.confirm('Schedule interview for this candidate?')) {
          handleStatusUpdate(application.id, 'INTERVIEW_SCHEDULED');
        }
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Applications - {job.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.totalApplications} total applications
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, university, or major..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading applications...</p>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No applications found</p>
                <p className="text-gray-400">No one has applied to this job yet</p>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto h-full">
              <div className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <div key={application.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {application.student?.user?.image ? (
                            <img
                              className="h-12 w-12 rounded-full"
                              src={application.student.user.image}
                              alt={application.student.user.fullName}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {application.student?.user?.fullName?.charAt(0) || 'A'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Applicant Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-lg font-medium text-gray-900">
                              {application.student?.user?.fullName}
                            </p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              {application.status.toLowerCase().replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {application.student?.university}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {application.student?.major}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(application.appliedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {application.student?.user?.email}
                            </div>
                            {application.student?.user?.phoneNumber && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {application.student.user.phoneNumber}
                              </div>
                            )}
                          </div>

                          {/* Cover Letter Preview */}
                          {application.coverLetter && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <p className="text-gray-700 line-clamp-2">
                                {application.coverLetter.length > 150 
                                  ? `${application.coverLetter.substring(0, 150)}...` 
                                  : application.coverLetter
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApplicationDetail(true);
                          }}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          View Details
                        </button>

                        {application.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleQuickAction(application, 'review')}
                              className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleQuickAction(application, 'accept')}
                              className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleQuickAction(application, 'reject')}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {application.status === 'REVIEWED' && (
                          <>
                            <button
                              onClick={() => handleQuickAction(application, 'interview')}
                              className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors"
                            >
                              Interview
                            </button>
                            <button
                              onClick={() => handleQuickAction(application, 'accept')}
                              className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                            >
                              Accept
                            </button>
                          </>
                        )}

                        {application.student?.cvLink && (
                          <a
                            href={application.student.cvLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                          >
                            View CV
                          </a>
                        )}

                        {application.customCvLink && (
                          <a
                            href={application.customCvLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            Custom CV
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {applications.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalApplications)} of {pagination.totalApplications} applications
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {showApplicationDetail && selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => {
            setShowApplicationDetail(false);
            setSelectedApplication(null);
          }}
          onStatusUpdate={(applicationId, status, feedback) => {
            handleStatusUpdate(applicationId, status, feedback);
            setShowApplicationDetail(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

// Application Detail Modal Sub-component
const ApplicationDetailModal = ({ application, onClose, onStatusUpdate }) => {
  const [feedback, setFeedback] = useState('');

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(application.id, newStatus, feedback);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Applicant Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              {application.student?.user?.image ? (
                <img
                  className="h-16 w-16 rounded-full"
                  src={application.student.user.image}
                  alt={application.student.user.fullName}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xl">
                    {application.student?.user?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
              )}
              <div>
                <h4 className="text-xl font-semibold">{application.student?.user?.fullName}</h4>
                <p className="text-gray-600">{application.student?.university} • {application.student?.major}</p>
                {application.student?.year && (
                  <p className="text-gray-500">Year {application.student.year}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p>{application.student?.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p>{application.student?.user?.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Applied Date</label>
                <p>{new Date(application.appliedAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p>{application.status.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-2">Cover Letter</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* CV Links */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-2">Documents</h5>
            <div className="flex gap-2">
              {application.student?.cvLink && (
                <a
                  href={application.student.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-600 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
                >
                  View CV
                </a>
              )}
              {application.customCvLink && (
                <a
                  href={application.customCvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-600 px-3 py-2 rounded hover:bg-green-200 transition-colors"
                >
                  Custom CV
                </a>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="border-t pt-6">
            <h5 className="font-medium text-gray-900 mb-4">Update Application Status</h5>
            
            {/* Feedback */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Provide feedback for the applicant..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('REVIEWED')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Mark as Reviewed
              </button>
              <button
                onClick={() => handleStatusChange('ACCEPTED')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange('REJECTED')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsModal;