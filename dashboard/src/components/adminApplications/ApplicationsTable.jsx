import React from 'react';
import { 
  Eye, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Trash2,
  User
} from 'lucide-react';

const statusConfig = {
  PENDING: { color: 'yellow', icon: Clock },
  REVIEWED: { color: 'blue', icon: Eye },
  INTERVIEW_SCHEDULED: { color: 'purple', icon: Calendar },
  ACCEPTED: { color: 'green', icon: CheckCircle },
  REJECTED: { color: 'red', icon: XCircle },
  WITHDRAWN: { color: 'gray', icon: XCircle }
};

const ApplicationsTable = ({
  applications = [],
  loading,
  selectedApplications = [],
  onSelectionChange,
  onViewApplication,
  onStatusUpdate,
  onDelete,
  pagination,
  onPageChange
}) => {
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(applications.map(app => app.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectApplication = (applicationId, checked) => {
    if (checked) {
      onSelectionChange([...selectedApplications, applicationId]);
    } else {
      onSelectionChange(selectedApplications.filter(id => id !== applicationId));
    }
  };

  const Badge = ({ children, variant = 'default', className = '' }) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  const Button = ({ children, variant = 'ghost', onClick, disabled = false, className = '' }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-8 w-8 p-0'
    };

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  const Checkbox = ({ checked, onCheckedChange }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
  );

  const Dropdown = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="relative inline-block text-left">
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                {children}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const DropdownItem = ({ children, onClick, disabled = false, className = '' }) => (
    <button
      className={`${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'} group flex items-center px-4 py-2 text-sm w-full text-left ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox
                  checked={selectedApplications.length === applications.length}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => {
              const StatusIcon = statusConfig[application.status]?.icon || Clock;
              const isSelected = selectedApplications.includes(application.id);
              
              return (
                <tr key={application.id} className={`${isSelected ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleSelectApplication(application.id, checked)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {application.student?.user?.image ? (
                          <img
                            src={application.student.user.image}
                            alt={application.student?.user?.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {application.student?.user?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {application.student?.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{application.job?.title}</p>
                      <p className="text-sm text-gray-500">
                        {application.job?.category?.name} • {application.job?.jobType}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {application.job?.company?.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {application.job?.company?.industry}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={statusConfig[application.status]?.color || 'default'}
                      className="flex items-center gap-1 w-fit"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {application.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">
                        {formatDate(application.appliedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.appliedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.respondedAt ? (
                      <span className="text-sm text-gray-600">
                        {Math.round(
                          (new Date(application.respondedAt) - new Date(application.appliedAt)) / 
                          (1000 * 60 * 60 * 24)
                        )} days
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Dropdown
                      trigger={
                        <Button>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    >
                      <DropdownItem onClick={() => onViewApplication(application)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownItem>
                      <div className="border-t border-gray-100"></div>
                      <DropdownItem 
                        onClick={() => onStatusUpdate(application.id, 'REVIEWED')}
                        disabled={application.status === 'REVIEWED'}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Reviewed
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => onStatusUpdate(application.id, 'ACCEPTED')}
                        disabled={application.status === 'ACCEPTED'}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => onStatusUpdate(application.id, 'REJECTED')}
                        disabled={application.status === 'REJECTED'}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownItem>
                      <div className="border-t border-gray-100"></div>
                      <DropdownItem 
                        onClick={() => onDelete(application.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalItems}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === pagination.currentPage;
                  
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isCurrentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  
                  if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;