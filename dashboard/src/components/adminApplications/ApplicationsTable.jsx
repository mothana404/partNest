import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const statusConfig = {
  PENDING: { color: 'yellow', icon: Clock, label: 'Pending' },
  REVIEWED: { color: 'blue', icon: Eye, label: 'Reviewed' },
//   INTERVIEW_SCHEDULED: { color: 'purple', icon: Calendar, label: 'Interview' },
  ACCEPTED: { color: 'green', icon: CheckCircle, label: 'Accepted' },
  REJECTED: { color: 'red', icon: XCircle, label: 'Rejected' },
  WITHDRAWN: { color: 'gray', icon: XCircle, label: 'Withdrawn' }
};

// Badge Component
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

// Checkbox Component
const Checkbox = ({ checked, onCheckedChange, indeterminate = false }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
    />
  );
};

// Dropdown Component - Fixed positioning
const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 280; // Approximate height
      const dropdownWidth = 200;
      
      let top = rect.bottom + 8;
      let left = align === 'right' ? rect.right - dropdownWidth : rect.left;

      // Check if dropdown would go below viewport
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 8;
      }

      // Check if dropdown would go outside right edge
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 16;
      }

      // Check if dropdown would go outside left edge
      if (left < 16) {
        left = 16;
      }

      setPosition({ top, left });
    }
  }, [isOpen, align]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-52 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
          style={{ top: position.top, left: position.left }}
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: (e) => {
                  if (child.props.onClick) {
                    child.props.onClick(e);
                  }
                  setIsOpen(false);
                }
              });
            }
            return child;
          })}
        </div>
      )}
    </>
  );
};

// Dropdown Item Component
const DropdownItem = ({ children, onClick, disabled = false, variant = 'default' }) => {
  const variantStyles = {
    default: 'text-gray-700 hover:bg-gray-100',
    danger: 'text-red-600 hover:bg-red-50'
  };

  return (
    <button
      className={`${disabled ? 'text-gray-300 cursor-not-allowed' : variantStyles[variant]} 
        group flex items-center px-4 py-2 text-sm w-full text-left transition-colors duration-150`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Action Button Component
const ActionButton = ({ children, onClick, disabled = false }) => (
  <button
    className="inline-flex items-center justify-center rounded-lg font-medium 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      text-gray-500 hover:text-gray-900 hover:bg-gray-100 
      h-9 w-9 transition-colors duration-150"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

// Avatar Component
const Avatar = ({ src, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
      flex items-center justify-center ring-2 ring-white`}>
      <span className="text-white font-medium text-sm">
        {name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4 text-white" />}
      </span>
    </div>
  );
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
  const isAllSelected = applications.length > 0 && selectedApplications.length === applications.length;
  const isSomeSelected = selectedApplications.length > 0 && selectedApplications.length < applications.length;

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateResponseDays = (appliedAt, respondedAt) => {
    if (!respondedAt) return null;
    const days = Math.round(
      (new Date(respondedAt) - new Date(appliedAt)) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-gray-500 text-sm">Loading applications...</p>
      </div>
    );
  }

  // Empty State
  if (!applications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          There are no applications matching your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection info bar */}
      {selectedApplications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => onSelectionChange([])}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table Container - No horizontal scroll */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Job
              </th>
              <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applied
              </th>
              <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Response
              </th>
              <th className="w-16 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((application) => {
              const statusInfo = statusConfig[application.status] || statusConfig.PENDING;
              const StatusIcon = statusInfo.icon;
              const isSelected = selectedApplications.includes(application.id);
              const responseDays = calculateResponseDays(application.appliedAt, application.respondedAt);
              
              return (
                <tr 
                  key={application.id} 
                  className={`${isSelected ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors duration-150`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleSelectApplication(application.id, checked)
                      }
                    />
                  </td>

                  {/* Applicant */}
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <Avatar 
                        src={application.student?.user?.image}
                        name={application.student?.user?.fullName}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {application.student?.user?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {application.student?.user?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Job */}
                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={application.job?.title}>
                        {application.job?.title || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {application.job?.category?.name && (
                          <span>{application.job.category.name}</span>
                        )}
                        {application.job?.category?.name && application.job?.jobType && (
                          <span> • </span>
                        )}
                        {application.job?.jobType && (
                          <span>{application.job.jobType}</span>
                        )}
                      </p>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate" title={application.job?.company?.companyName}>
                        {application.job?.company?.companyName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {application.job?.company?.industry || '—'}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <Badge 
                      variant={statusInfo.color}
                      className="inline-flex items-center gap-1"
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span className="truncate">{statusInfo.label}</span>
                    </Badge>
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {formatDate(application.appliedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(application.appliedAt)}
                      </p>
                    </div>
                  </td>

                  {/* Response Time */}
                  <td className="px-4 py-4">
                    {responseDays !== null ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                        {responseDays} day{responseDays !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Pending</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <Dropdown
                      trigger={
                        <ActionButton>
                          <MoreHorizontal className="h-4 w-4" />
                        </ActionButton>
                      }
                      align="right"
                    >
                      <DropdownItem onClick={() => onViewApplication(application)}>
                        <Eye className="mr-3 h-4 w-4 text-gray-400" />
                        View Details
                      </DropdownItem>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <DropdownItem 
                        onClick={() => onStatusUpdate(application.id, 'REVIEWED')}
                        disabled={application.status === 'REVIEWED'}
                      >
                        <Eye className="mr-3 h-4 w-4 text-blue-400" />
                        Mark as Reviewed
                      </DropdownItem>
                      
                      <DropdownItem 
                        onClick={() => onStatusUpdate(application.id, 'ACCEPTED')}
                        disabled={application.status === 'ACCEPTED'}
                      >
                        <CheckCircle className="mr-3 h-4 w-4 text-green-400" />
                        Accept
                      </DropdownItem>
                      
                      <DropdownItem 
                        onClick={() => onStatusUpdate(application.id, 'REJECTED')}
                        disabled={application.status === 'REJECTED'}
                      >
                        <XCircle className="mr-3 h-4 w-4 text-red-400" />
                        Reject
                      </DropdownItem>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <DropdownItem 
                        onClick={() => onDelete(application.id)}
                        variant="danger"
                      >
                        <Trash2 className="mr-3 h-4 w-4" />
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
      {pagination && pagination.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Results info */}
          <p className="text-sm text-gray-600 order-2 sm:order-1">
            Showing{' '}
            <span className="font-medium">
              {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
            </span>
            {' '}to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{pagination.totalItems}</span>
            {' '}results
          </p>

          {/* Pagination controls */}
          <div className="flex items-center gap-1 order-1 sm:order-2">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-300 
                bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
                transition-colors duration-150"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {generatePageNumbers(pagination.currentPage, pagination.totalPages).map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="inline-flex items-center justify-center h-9 w-9 text-gray-400"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrentPage = page === pagination.currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium
                      transition-colors duration-150 ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-300 
                bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
                transition-colors duration-150"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate page numbers with ellipsis
const generatePageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const showEllipsisThreshold = 7;

  if (totalPages <= showEllipsisThreshold) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
};

export default ApplicationsTable;