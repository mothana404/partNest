import React from 'react';
import { 
  Eye, 
  MoreHorizontal, 
  Building,
  Trash2,
  Shield,
  ShieldCheck,
  Power,
  PowerOff
} from 'lucide-react';

const CompaniesTable = ({
  companies = [],
  loading,
  onViewCompany,
  onVerifyCompany,
  onToggleStatus,
  onDelete,
  pagination,
  onPageChange
}) => {
  const Badge = ({ children, variant = 'default', className = '' }) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800'
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
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5">
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

  if (!companies.length) {
    return (
      <div className="text-center py-8">
        <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No companies found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/8">
                Industry
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/8">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/10">
                Jobs
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                Joined Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-blue-50 transition-colors duration-150">
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {company.companyName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        ID: {company.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-700">
                    {company.industry || 'Not specified'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {company.user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {company.user?.email}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1.5">
                    <Badge 
                      variant={company.user?.isActive ? 'green' : 'red'}
                      className="flex items-center gap-1 w-fit"
                    >
                      {company.user?.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                      {company.user?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge 
                      variant={company.isVerified ? 'blue' : 'yellow'}
                      className="flex items-center gap-1 w-fit"
                    >
                      {company.isVerified ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {company.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {company.jobCount || 0} total
                    </p>
                    <p className="text-xs text-gray-500">
                      {company.activeJobCount || 0} active
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm text-gray-900">
                      {formatDate(company.user?.createdAt)}
                    </p>
                    {company.user?.lastLogin && (
                      <p className="text-xs text-gray-500">
                        Last: {formatDate(company.user.lastLogin)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <Dropdown
                    trigger={
                      <Button>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  >
                    <DropdownItem onClick={() => onViewCompany(company)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownItem>
                    <div className="border-t border-gray-100"></div>
                    {/* <DropdownItem 
                      onClick={() => onVerifyCompany(company.id, !company.isVerified)}
                    >
                      {company.isVerified ? (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Unverify
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Verify
                        </>
                      )}
                    </DropdownItem> */}
                    <DropdownItem onClick={() => onToggleStatus(company.id)}>
                      {company.user?.isActive ? (
                        <>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownItem>
                    <div className="border-t border-gray-100"></div>
                    <DropdownItem 
                      onClick={() => onDelete(company.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </td>
              </tr>
            ))}
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
                {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === pagination.currentPage;
                  
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

export default CompaniesTable;