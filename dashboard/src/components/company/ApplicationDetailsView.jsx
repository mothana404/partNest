import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, GraduationCap, Star, Briefcase, Link as LinkIcon, Download, MessageCircle, Clock, User, FileText, Eye } from 'lucide-react';

const ApplicationDetailsView = ({ application, onUpdateStatus, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState(application?.status || 'PENDING');
  const [interviewDate, setInterviewDate] = useState(
    application?.interviewDate ? new Date(application.interviewDate).toISOString().slice(0, 16) : ''
  );
  const [interviewType, setInterviewType] = useState(application?.interviewType || 'VIRTUAL');
  const [notes, setNotes] = useState(application?.interviewNotes || '');
  const [feedback, setFeedback] = useState(application?.feedback || '');
  const [rejectionReason, setRejectionReason] = useState(application?.rejectionReason || '');

  const handleStatusUpdate = async () => {
    const additionalData = {};
    
    if (selectedStatus === 'INTERVIEW_SCHEDULED') {
      additionalData.interviewDate = interviewDate;
      additionalData.interviewType = interviewType;
      additionalData.interviewNotes = notes;
    }
    
    if (selectedStatus === 'REJECTED' && rejectionReason) {
      additionalData.rejectionReason = rejectionReason;
    }
    
    if (feedback) {
      additionalData.feedback = feedback;
    }

    await onUpdateStatus(application.id, selectedStatus, additionalData);
  };

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

  if (!application) return null;

  const { student, job } = application;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {student?.user?.fullName}
          </h1>
          <p className="text-gray-600 mt-1">
            Application for: {job?.title}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(application.status)}`}>
          {application.status.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Applied Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(application.appliedAt).toLocaleDateString()} at {new Date(application.appliedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {application.viewedAt && (
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Viewed Date</p>
                    <p className="text-sm text-gray-600">
                                            {new Date(application.viewedAt).toLocaleDateString()} at {new Date(application.viewedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {application.respondedAt && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Responded Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(application.respondedAt).toLocaleDateString()} at {new Date(application.respondedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {application.interviewDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Interview Scheduled</p>
                    <p className="text-sm text-gray-600">
                      {new Date(application.interviewDate).toLocaleDateString()} at {new Date(application.interviewDate).toLocaleTimeString()}
                    </p>
                    {application.interviewType && (
                      <p className="text-xs text-gray-500">{application.interviewType}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Student Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{student?.user?.email}</p>
                </div>
              </div>
              
              {student?.user?.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{student.user.phoneNumber}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{student?.user?.location || 'Not specified'}</p>
                </div>
              </div>

              {student?.age && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Age</p>
                    <p className="text-sm text-gray-600">{student.age} years old</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{student?.university}</p>
                <p className="text-sm text-gray-600">{student?.major}</p>
                <div className="flex items-center gap-4 mt-2">
                  {student?.year && (
                    <span className="text-sm text-gray-500">Year {student.year}</span>
                  )}
                  {student?.gpa && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">GPA: {student.gpa}/4.0</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {student?.skills && student.skills.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      {skill.level && (
                        <p className="text-sm text-gray-500">{skill.level}</p>
                      )}
                    </div>
                    {skill.yearsOfExp && (
                      <span className="text-sm text-gray-600">{skill.yearsOfExp} years</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {student?.experiences && student.experiences.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
              <div className="space-y-4">
                {student.experiences.map((exp, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{exp.title}</h4>
                      {exp.companyName && (
                        <p className="text-sm text-gray-600">{exp.companyName}</p>
                      )}
                      {exp.location && (
                        <p className="text-sm text-gray-500">{exp.location}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString()} - 
                          {exp.isCurrent ? ' Present' : (exp.endDate ? ` ${new Date(exp.endDate).toLocaleDateString()}` : ' Present')}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Feedback */}
          {application.feedback && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Feedback</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {application.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Management */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Interview Details */}
              {selectedStatus === 'INTERVIEW_SCHEDULED' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Type
                    </label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="VIRTUAL">Virtual</option>
                      <option value="IN_PERSON">In Person</option>
                      <option value="PHONE">Phone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add interview details, location, meeting link, etc."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Rejection Reason */}
              {selectedStatus === 'REJECTED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select reason</option>
                    <option value="QUALIFICATIONS">Qualifications not met</option>
                    <option value="EXPERIENCE">Insufficient experience</option>
                    <option value="POSITION_FILLED">Position filled</option>
                    <option value="NOT_A_FIT">Not a good fit</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              )}

              {/* General Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add feedback about this candidate..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Application
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {student?.cvLink && (
                <a
                  href={student.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              )}

              {application.customCvLink && (
                <a
                  href={application.customCvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Custom CV
                </a>
              )}

              <a
                href={`mailto:${student?.user?.email}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>

              {student?.user?.phoneNumber && (
                <a
                  href={`tel:${student.user.phoneNumber}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          </div> */}

          {/* Job Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Position</p>
                <p className="text-sm text-gray-900">{job?.title}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="text-sm text-gray-900">{job?.jobType?.replace('_', ' ')}</p>
              </div>
              
              {job?.location && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">{job.location}</p>
                </div>
              )}
              
              {job?.salaryMin && job?.salaryMax && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Salary Range</p>
                  <p className="text-sm text-gray-900">
                    {job.salaryCurrency || '$'}{job.salaryMin} - {job.salaryCurrency || '$'}{job.salaryMax}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700">Posted</p>
                <p className="text-sm text-gray-900">
                  {new Date(job?.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Applications</p>
                <p className="text-sm text-gray-900">
                  {job?.applicationCount || 0} total applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsView;