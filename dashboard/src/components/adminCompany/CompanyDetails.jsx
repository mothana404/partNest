import React from 'react';
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Users,
  Briefcase,
  Shield,
  ShieldCheck,
  Power,
  PowerOff,
  ExternalLink
} from 'lucide-react';

const CompanyDetails = ({ 
  company, 
  onBack, 
  onVerify, 
  onToggleStatus, 
  onDelete 
}) => {
  if (!company) {
    return <div>Company not found</div>;
  }

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

  const Button = ({ children, variant = 'outline', onClick, className = '' }) => {
    const baseStyles = 'inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
      primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      success: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
      warning: 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      destructive: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
    };

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const Badge = ({ children, variant = 'default', className = '' }) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
            <p className="text-gray-600">Company ID: {company.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={company.user?.isActive ? 'green' : 'red'}
            className="flex items-center gap-1"
          >
            {company.user?.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
            {company.user?.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge 
            variant={company.isVerified ? 'blue' : 'yellow'}
            className="flex items-center gap-1"
          >
            {company.isVerified ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
            {company.isVerified ? 'Verified' : 'Pending'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <p className="text-sm text-gray-900">{company.companyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <p className="text-sm text-gray-900">{company.industry || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <p className="text-sm text-gray-900">{company.size || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                  <p className="text-sm text-gray-900">{company.foundedYear || 'Not specified'}</p>
                </div>
              </div>

              {company.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-900">{company.description}</p>
                </div>
              )}

              {company.website && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {company.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {company.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {company.address}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Account Email</label>
                    <p className="text-sm text-gray-900">{company.user?.email}</p>
                  </div>
                </div>
                
                {company.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Contact Email</label>
                      <p className="text-sm text-gray-900">{company.contactEmail}</p>
                    </div>
                  </div>
                )}

                {company.user?.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Account Phone</label>
                      <p className="text-sm text-gray-900">{company.user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {company.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Contact Phone</label>
                      <p className="text-sm text-gray-900">{company.contactPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Posted Jobs ({company.jobs?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.jobs && company.jobs.length > 0 ? (
                <div className="space-y-3">
                  {company.jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</p>
                      </div>
                      <Badge 
                        variant={job.status === 'ACTIVE' ? 'green' : job.status === 'CLOSED' ? 'red' : 'yellow'}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No jobs posted yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={company.isVerified ? 'warning' : 'success'}
                onClick={() => onVerify(company.id, !company.isVerified)}
                className="w-full"
              >
                {company.isVerified ? (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Unverify Company
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify Company
                  </>
                )}
              </Button>

              <Button
                variant={company.user?.isActive ? 'warning' : 'primary'}
                onClick={() => onToggleStatus(company.id)}
                className="w-full"
              >
                {company.user?.isActive ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                <p className="text-sm text-gray-900">{company.user?.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <p className="text-sm text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(company.user?.createdAt)}
                </p>
              </div>

              {company.user?.lastLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                  <p className="text-sm text-gray-900">{formatDate(company.user.lastLogin)}</p>
                </div>
              )}

              {company.user?.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {company.user.location}
                  </p>
                </div>
              )}
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
                onClick={() => onDelete(company.id)}
                className="w-full"
              >
                Delete Company
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This will deactivate the company and close all their job postings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;