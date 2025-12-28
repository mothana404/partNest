// components/CompanyProfileModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Users, 
  Calendar,
  CheckCircle,
  ExternalLink,
  Briefcase,
  Award,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CompanyProfileModal = ({ companyId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchCompanyProfile();
  }, [companyId]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      
      const response = await axios.get(
        `http://localhost:8080/api/Profiles/companyProfileDetails/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setCompany(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching company profile:', err);
      setError(err.response?.data?.message || 'Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-center text-gray-600 mt-6 font-medium">Loading company profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Company</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!company) return null;

  const { user, company: companyData, links } = company;
  const yearsInBusiness = new Date().getFullYear() - (companyData.foundedYear || new Date().getFullYear());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Company Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Company Header with Banner */}
          <div className="relative">
            {/* Background Banner */}
            <div 
              className="h-56 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 relative overflow-hidden"
              style={user.background && !user.background.includes('dasdasd') ? { 
                backgroundImage: `url(${user.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Company Logo and Info Overlay */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-24">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-44 h-44 bg-white rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={companyData.companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  {companyData.isVerified && (
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  )}
                </div>

                {/* Company Name and Info */}
                <div className="flex-1 lg:mb-8 w-full">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {companyData.companyName}
                    </h3>
                    {companyData.industry && (
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span className="text-lg font-medium">{companyData.industry}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {companyData.isVerified && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Verified Company
                        </span>
                      )}
                      {yearsInBusiness > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          <Award className="w-4 h-4" />
                          {yearsInBusiness}+ Years in Business
                        </span>
                      )}
                      {companyData.size && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          <Users className="w-4 h-4" />
                          {companyData.size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-8">
            {/* About Section */}
            {companyData.description && (
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  About Company
                </h4>
                <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                    {companyData.description}
                  </p>
                </div>
              </section>
            )}

            {/* Company Stats - Moved Up */}
            <section>
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 shadow-xl">
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-7 h-7" />
                  Company Overview
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">
                      {yearsInBusiness > 0 ? `${yearsInBusiness}+` : 'New'}
                    </p>
                    <p className="text-sm text-blue-100 font-medium">Years Active</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">
                      {companyData.isVerified ? '✓' : '✗'}
                    </p>
                    <p className="text-sm text-blue-100 font-medium">Verified Status</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2 truncate px-2">
                      {companyData.size?.split(' ')[0] || 'N/A'}
                    </p>
                    <p className="text-sm text-blue-100 font-medium">Team Size</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-white mb-2 truncate px-2">
                      {companyData.industry?.split(' ')[0] || 'N/A'}
                    </p>
                    <p className="text-sm text-blue-100 font-medium">Industry</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Details Grid */}
            <section>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                Company Details
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Company Information */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-md hover:shadow-xl transition-shadow">
                  <h5 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    Company Information
                  </h5>
                  
                  <div className="space-y-4">
                    {companyData.size && (
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Company Size</p>
                          <p className="text-gray-900 font-bold text-lg">{companyData.size}</p>
                        </div>
                      </div>
                    )}

                    {companyData.foundedYear && (
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Founded</p>
                          <p className="text-gray-900 font-bold text-lg">{companyData.foundedYear}</p>
                        </div>
                      </div>
                    )}

                    {companyData.address && (
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl border border-purple-100">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Location</p>
                          <p className="text-gray-900 font-bold text-base leading-relaxed">{companyData.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Contact Information */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-md hover:shadow-xl transition-shadow">
                  <h5 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-indigo-600" />
                    </div>
                    Contact Information
                  </h5>
                  
                  <div className="space-y-4">
                    {companyData.contactEmail && (
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Email</p>
                          <a 
                            href={`mailto:${companyData.contactEmail}`}
                            className="text-blue-600 hover:text-blue-700 font-bold break-all hover:underline text-base"
                          >
                            {companyData.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {companyData.contactPhone && (
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Phone</p>
                          <a 
                            href={`tel:${companyData.contactPhone}`}
                            className="text-blue-600 hover:text-blue-700 font-bold hover:underline text-lg"
                          >
                            {companyData.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}

                    {companyData.website && (
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Website</p>
                          <a 
                            href={companyData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-bold break-all hover:underline inline-flex items-center gap-1.5 text-base"
                          >
                            <span className="truncate">{companyData.website}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Social Links - Better positioned */}
            {links && links.length > 0 && (
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  Links & Social Media
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all border-2 border-gray-200 hover:border-blue-400 group shadow-sm hover:shadow-lg"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow flex-shrink-0">
                        <LinkIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 truncate mb-1">
                          {link.label || link.type}
                        </p>
                        <p className="text-sm text-gray-500 truncate font-medium">{link.url}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 p-6 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0">
          {companyData.website && (
            <a
              href={companyData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold border-2 border-gray-300 hover:border-gray-400 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileModal;