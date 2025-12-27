import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  Edit3,
  CheckCircle,
  AlertCircle,
  Camera,
  ExternalLink,
  Link as LinkIcon,
  Award,
  Clock,
  Shield,
  Eye,
  Settings,
  Briefcase,
  Lock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CompanyProfileEdit from '../../components/CompanyProfileEdit';

const CompanyProfile = () => {
  const { user, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    user: {
      user_id: '',
      email: '',
      fullName: '',
      phoneNumber: '',
      location: '',
      image: '',
      background: '',
      role: '',
      isActive: false,
      isVerified: false,
      createdAt: '',
      updatedAt: ''
    },
    company: {
      id: '',
      userId: '',
      companyName: '',
      industry: '',
      description: '',
      website: '',
      size: '',
      foundedYear: null,
      contactEmail: '',
      contactPhone: '',
      address: '',
      isVerified: false,
      createdAt: '',
      updatedAt: ''
    },
    links: []
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:8080/api/profiles/companyProfile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load company profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedData) => {
    setProfileData(updatedData);
    setEditing(false);
    setMessage({ 
      type: 'success', 
      text: 'Company profile updated successfully' 
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleUpdateError = (errorMessage) => {
    setMessage({ 
      type: 'error', 
      text: errorMessage 
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <CompanyProfileEdit
        profileData={profileData}
        onCancel={() => setEditing(false)}
        onSuccess={handleUpdateSuccess}
        onError={handleUpdateError}
      />
    );
  }

  const getVerificationBadge = (isVerified) => (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
      isVerified 
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
        : 'bg-amber-100 text-amber-700 border border-amber-200'
    }`}>
      {isVerified ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Verified
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3" />
          Pending
        </>
      )}
    </div>
  );

  const getStatusBadge = (isActive) => (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
      isActive 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-red-100 text-red-700 border border-red-200'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      {isActive ? 'Active' : 'Inactive'}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                {profileData.user.image ? (
                  <img 
                    src={profileData.user.image} 
                    alt="Company Logo"
                    className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white/20 group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20 group-hover:scale-105 transition-transform duration-200">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className="absolute -top-2 -right-2">
                  {profileData.company.isVerified && (
                    <div className="bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    {profileData.company.companyName || 'Company Name'}
                  </h1>
                  {getStatusBadge(profileData.user.isActive)}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">{profileData.company.industry || 'Industry not specified'}</span>
                  </div>
                  {profileData.company.size && (
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{profileData.company.size}</span>
                    </div>
                  )}
                  {profileData.company.foundedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Founded {profileData.company.foundedYear}</span>
                    </div>
                  )}
                </div>
                
                {profileData.user.location && (
                  <div className="flex items-center gap-2 text-blue-200">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.user.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setEditing(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-lg ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Company Description */}
            {(profileData.company.description || profileData.user.background) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  About {profileData.company.companyName || 'Our Company'}
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {profileData.company.description || profileData.user.background || 'No description available.'}
                  </p>
                </div>
              </div>
            )}

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-5">
                  
                  {profileData.company.website && (
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Website</p>
                        <a 
                          href={profileData.company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group"
                        >
                          {profileData.company.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    </div>
                  )}

                  {profileData.company.contactEmail && (
                    <div className="flex items-center gap-4">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <a 
                          href={`mailto:${profileData.company.contactEmail}`}
                          className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                        >
                          {profileData.company.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {profileData.company.contactPhone && (
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <a 
                          href={`tel:${profileData.company.contactPhone}`}
                          className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                        >
                          {profileData.company.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {profileData.company.address && (
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-50 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Address</p>
                        <p className="text-gray-900 font-medium whitespace-pre-wrap">
                          {profileData.company.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  Company Details
                </h3>
                <div className="space-y-5">
                  
                  {profileData.company.industry && (
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Industry</p>
                        <p className="text-gray-900 font-medium">{profileData.company.industry}</p>
                      </div>
                    </div>
                  )}

                  {profileData.company.size && (
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-50 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Company Size</p>
                        <p className="text-gray-900 font-medium">{profileData.company.size}</p>
                      </div>
                    </div>
                  )}

                  {profileData.company.foundedYear && (
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-50 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Founded</p>
                        <p className="text-gray-900 font-medium">{profileData.company.foundedYear}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Member Since</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(profileData.company.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Links */}
            {profileData.links && profileData.links.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                  Company Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{link.type || 'Link'}</p>
                        <p className="text-sm text-gray-600">{link.label || link.url}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Verification Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                Verification Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Account Status</span>
                    {getStatusBadge(profileData.user.isActive)}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Email Verification</span>
                    {getVerificationBadge(profileData.user.isVerified)}
                  </div>
                  <p className="text-xs text-gray-500">Email: {profileData.user.email}</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Company Verification</span>
                    {getVerificationBadge(profileData.company.isVerified)}
                  </div>
                  {!profileData.company.isVerified && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                      Complete your profile to get verified faster
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                Profile Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Joined</p>
                    <p className="text-xs text-gray-500">
                      {new Date(profileData.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(profileData.company.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;