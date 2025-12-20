import { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Star,
  Link,
  ExternalLink,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  Activity,
  Building2,
  Globe,
  FileText,
  Camera,
  Settings
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";

const ProfilePage = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    user: {
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      image: "",
      background: ""
    },
    student: {
      university: "",
      major: "",
      year: null,
      gpa: null,
      age: null,
      about: "",
      cvLink: "",
      availability: true,
      preferredJobTypes: [],
      preferredLocations: [],
      expectedSalaryMin: null,
      expectedSalaryMax: null
    },
    skills: [],
    experiences: [],
    links: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/Profiles/studentProfile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompleteness = () => {
    const fields = [
      profileData.user.fullName,
      profileData.user.phoneNumber,
      profileData.user.location,
      profileData.student.university,
      profileData.student.major,
      profileData.student.about,
      profileData.skills.length > 0,
      profileData.experiences.length > 0
    ];
    
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    {profileData.user.fullName || 'Your Name'}
                  </h1>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    profileData.student.availability 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${profileData.student.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {profileData.student.availability ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    <span className="font-medium">{profileData.student.major || 'Major not specified'}</span>
                  </div>
                  {profileData.student.university && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <span>{profileData.student.university}</span>
                    </div>
                  )}
                  {profileData.student.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Year {profileData.student.year}</span>
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
            
            <div className="flex items-center gap-3">
              <RouterLink
                to="/student/profile/edit"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </RouterLink>
              {/* {profileData.student.cvLink && (
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download CV
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* About Section */}
            {profileData.student.about && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {profileData.student.about}
                </p>
              </div>
            )}

            {/* Personal & Academic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900 font-medium">{profileData.user.email}</p>
                    </div>
                  </div>

                  {profileData.user.phoneNumber && (
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="text-gray-900 font-medium">{profileData.user.phoneNumber}</p>
                      </div>
                    </div>
                  )}

                  {profileData.user.location && (
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-50 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-gray-900 font-medium">{profileData.user.location}</p>
                      </div>
                    </div>
                  )}

                  {profileData.student.age && (
                    <div className="flex items-center gap-4">
                      <div className="bg-pink-50 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Age</p>
                        <p className="text-gray-900 font-medium">{profileData.student.age} years old</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Academic Details
                </h3>
                <div className="space-y-5">
                  {profileData.student.university && (
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">University</p>
                        <p className="text-gray-900 font-medium">{profileData.student.university}</p>
                      </div>
                    </div>
                  )}

                  {profileData.student.major && (
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-50 p-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Major</p>
                        <p className="text-gray-900 font-medium">{profileData.student.major}</p>
                      </div>
                    </div>
                  )}

                  {profileData.student.year && (
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-50 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Year of Study</p>
                        <p className="text-gray-900 font-medium">{profileData.student.year}{getOrdinalSuffix(profileData.student.year)} Year</p>
                      </div>
                    </div>
                  )}

                  {profileData.student.gpa && (
                    <div className="flex items-center gap-4">
                      <div className="bg-rose-50 p-2 rounded-lg">
                        <Star className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">GPA</p>
                        <p className="text-gray-900 font-medium">{profileData.student.gpa}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferred Job Types Section */}
            {profileData.student?.preferredJobTypes && Array.isArray(profileData.student.preferredJobTypes) && profileData.student.preferredJobTypes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Preferred Job Types
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.student.preferredJobTypes.map((jobType, index) => (
                    <div key={index} className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-200 font-medium">
                      {typeof jobType === 'string' ? jobType.replace(/_/g, ' ') : jobType}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {profileData.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-blue-600" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200 font-medium">
                      {skill.name}
                      {skill.level && (
                        <span className="ml-2 text-blue-500 text-sm">• {skill.level}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {profileData.experiences.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Work Experience
                </h3>
                <div className="space-y-6">
                  {profileData.experiences.map((experience, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{experience.title}</h4>
                          {experience.companyName && (
                            <p className="text-blue-600 font-medium">{experience.companyName}</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(experience.startDate).getFullYear()} - {
                            experience.isCurrent ? 'Present' : new Date(experience.endDate).getFullYear()
                          }
                        </div>
                      </div>
                      {experience.description && (
                        <p className="text-gray-700 mb-2 whitespace-pre-wrap">{experience.description}</p>
                      )}
                      {experience.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {experience.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links Section */}
            {profileData.links.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Link className="w-6 h-6 text-blue-600" />
                  Professional Links
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
                        <Link className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{link.type}</p>
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
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProfileCompleteness()}%` }}
                  ></div>
                </div>
                <p className="text-center font-semibold text-gray-900">
                  {getProfileCompleteness()}% Complete
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {profileData.user.fullName ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
                    <span className={profileData.user.fullName ? 'text-gray-900' : 'text-gray-500'}>Basic Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profileData.skills.length > 0 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
                    <span className={profileData.skills.length > 0 ? 'text-gray-900' : 'text-gray-500'}>Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profileData.experiences.length > 0 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
                    <span className={profileData.experiences.length > 0 ? 'text-gray-900' : 'text-gray-500'}>Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {profileData.student.about ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}
                    <span className={profileData.student.about ? 'text-gray-900' : 'text-gray-500'}>About Section</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Applications</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{profileData.skills.length}</p>
                    <p className="text-sm text-gray-600">Skills</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{profileData.experiences.length}</p>
                    <p className="text-sm text-gray-600">Experiences</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Link className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{profileData.links.length}</p>
                    <p className="text-sm text-gray-600">Links</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CV Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                CV/Resume
              </h3>
              {profileData.student.cvLink ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Current CV</p>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download CV
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No CV uploaded</p>
                  <RouterLink
                    to="/student/profile/edit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Upload CV
                  </RouterLink>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <RouterLink
                  to="/student/profile/edit"
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors flex items-center gap-3"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </RouterLink>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors flex items-center gap-3">
                  <Eye className="w-4 h-4" />
                  Preview Public Profile
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export default ProfilePage;