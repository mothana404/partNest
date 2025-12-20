import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Building,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ApplicationDetails = ({ 
  application, 
  onBack, 
  onStatusUpdate, 
  onDelete 
}) => {
  const [newStatus, setNewStatus] = useState(application?.status || '');
  const [feedback, setFeedback] = useState(application?.feedback || '');
  const [rejectionReason, setRejectionReason] = useState(application?.rejectionReason || '');
  const [interviewDate, setInterviewDate] = useState(
    application?.interviewDate ? new Date(application.interviewDate).toISOString().slice(0, 16) : ''
  );
  const [interviewType, setInterviewType] = useState(application?.interviewType || '');
  const [interviewNotes, setInterviewNotes] = useState(application?.interviewNotes || '');

  const handleStatusUpdate = () => {
    const updateData = {
      status: newStatus,
      feedback,
      rejectionReason,
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      interviewType,
      interviewNotes
    };

    onStatusUpdate(application.id, newStatus, updateData);
  };

  if (!application) {
    return <div>Application not found</div>;
  }

  const statusConfig = {
    PENDING: { color: 'yellow', icon: Clock },
    REVIEWED: { color: 'blue', icon: CheckCircle },
    INTERVIEW_SCHEDULED: { color: 'purple', icon: Calendar },
    ACCEPTED: { color: 'green', icon: CheckCircle },
    REJECTED: { color: 'red', icon: XCircle },
    WITHDRAWN: { color: 'gray', icon: XCircle }
  };

  const StatusIcon = statusConfig[application.status]?.icon || Clock;

  const Badge = ({ children, variant = 'default', className = '' }) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-300 text-gray-700'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );

  const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, variant = 'primary', onClick, disabled = false, className = '', asChild = false, ...props }) => {
    const baseStyles = 'inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
      destructive: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: `${baseStyles} ${variantStyles[variant]} ${className}`,
        onClick: disabled ? undefined : onClick,
        ...props
      });
    }

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };

  const Select = ({ value, onValueChange, children, className = '' }) => {
    const handleChange = (e) => {
      onValueChange(e.target.value);
    };

    return (
      <select
        value={value}
        onChange={handleChange}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      >
        {children}
      </select>
    );
  };

  const SelectOption = ({ value, children }) => (
    <option value={value}>{children}</option>
  );

  const Textarea = ({ value, onChange, placeholder, rows = 3, className = '' }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">
              Applied on {formatDate ? formatDate(application.appliedAt) : new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge 
          variant={statusConfig[application.status]?.color || 'default'}
          className="flex items-center gap-1"
        >
          <StatusIcon className="w-3 h-3" />
          {application.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {application.student?.user?.image ? (
                    <img
                      src={application.student.user.image}
                      alt={application.student?.user?.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {application.student?.user?.fullName}
                  </h3>
                  <p className="text-gray-600">
                    {application.student?.university} • {application.student?.major}
                  </p>
                  {application.student?.year && (
                    <p className="text-sm text-gray-500">
                      Year {application.student.year} • GPA: {application.student?.gpa || 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{application.student?.user?.email}</span>
                </div>
                {application.student?.user?.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{application.student.user.phoneNumber}</span>
                  </div>
                )}
                {application.student?.user?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{application.student.user.location}</span>
                  </div>
                )}
              </div>

              {application.student?.about && (
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-gray-600">{application.student.about}</p>
                </div>
              )}

              {application.student?.cvLink && (
                <div>
                  <Button variant="outline" asChild>
                    <a href={application.student.cvLink} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4 mr-2" />
                      View CV
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{application.job?.title}</h3>
                <p className="text-gray-600">
                  {application.job?.company?.companyName} • {application.job?.category?.name}
                </p>
                <Badge variant="outline" className="mt-2">
                  {application.job?.jobType?.replace('_', ' ')}
                </Badge>
              </div>

              {application.job?.description && (
                <div>
                  <h4 className="font-medium mb-2">Job Description</h4>
                  <p className="text-gray-600">{application.job.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2 text-gray-600">{application.job?.location || 'Remote'}</span>
                </div>
                <div>
                  <span className="font-medium">Posted:</span>
                  <span className="ml-2 text-gray-600">
                    {formatDate ? formatDate(application.job?.createdAt) : new Date(application.job?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectOption value="">Select Status</SelectOption>
                  <SelectOption value="PENDING">Pending</SelectOption>
                  <SelectOption value="REVIEWED">Reviewed</SelectOption>
                  <SelectOption value="INTERVIEW_SCHEDULED">Interview Scheduled</SelectOption>
                  <SelectOption value="ACCEPTED">Accepted</SelectOption>
                  <SelectOption value="REJECTED">Rejected</SelectOption>
                  <SelectOption value="WITHDRAWN">Withdrawn</SelectOption>
                </Select>
              </div>

              {newStatus === 'INTERVIEW_SCHEDULED' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Interview Date</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Interview Type</label>
                    <Select value={interviewType} onValueChange={setInterviewType}>
                      <SelectOption value="">Select interview type</SelectOption>
                      <SelectOption value="Phone">Phone Interview</SelectOption>
                      <SelectOption value="Video">Video Interview</SelectOption>
                      <SelectOption value="In-person">In-person Interview</SelectOption>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Interview Notes</label>
                    <Textarea
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                      placeholder="Interview notes..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {newStatus === 'REJECTED' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                  <Select value={rejectionReason} onValueChange={setRejectionReason}>
                    <SelectOption value="">Select reason...</SelectOption>
                    <SelectOption value="Qualifications not met">Qualifications not met</SelectOption>
                    <SelectOption value="Position filled">Position filled</SelectOption>
                    <SelectOption value="Experience insufficient">Experience insufficient</SelectOption>
                    <SelectOption value="Not a cultural fit">Not a cultural fit</SelectOption>
                    <SelectOption value="Other">Other</SelectOption>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the applicant..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleStatusUpdate} 
                className="w-full"
                disabled={newStatus === application.status}
              >
                Update Application
              </Button>
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-gray-500">
                      {formatDate ? formatDate(application.appliedAt) : new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {application.viewedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <div>
                      <p className="text-sm font-medium">Viewed by Company</p>
                      <p className="text-xs text-gray-500">
                        {formatDate ? formatDate(application.viewedAt) : new Date(application.viewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {application.respondedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    <div>
                      <p className="text-sm font-medium">Response Given</p>
                      <p className="text-xs text-gray-500">
                        {formatDate ? formatDate(application.respondedAt) : new Date(application.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {application.interviewDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    <div>
                      <p className="text-sm font-medium">Interview Scheduled</p>
                      <p className="text-xs text-gray-500">
                        {formatDate ? formatDate(application.interviewDate) : new Date(application.interviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => onDelete(application.id)}
                className="w-full"
              >
                Delete Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;