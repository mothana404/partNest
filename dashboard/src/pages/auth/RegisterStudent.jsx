import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  GraduationCap,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Award,
  Info,
  Users,
  Building2
} from 'lucide-react';

const RegisterStudent = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    university: '',
    major: '',
    year: new Date().getFullYear(),
    gpa: '',
    age: '',
    about: '',
    cvLink: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Universities list (you can expand this)
  const universities = [
    'Jordan University of Science and Technology',
    'University of Jordan',
    'Jordan University',
    'Hashemite University',
    'Yarmouk University',
    'Al-Balqa Applied University',
    'German Jordanian University',
    'Princess Sumaya University for Technology',
    'Other'
  ];

  // Common majors (you can expand this)
  const majors = [
    'Computer Science',
    'Software Engineering',
    'Computer Engineering',
    'Information Technology',
    'Data Science',
    'Cyber Security',
    'Artificial Intelligence',
    'Business Administration',
    'Engineering',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    // Phone validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    // University validation
    if (!formData.university) {
      newErrors.university = 'University is required';
    }

    // Major validation
    if (!formData.major) {
      newErrors.major = 'Major is required';
    }

    // Year validation
    const currentYear = new Date().getFullYear();
    if (!formData.year) {
      newErrors.year = 'Graduation year is required';
    } else if (formData.year < currentYear || formData.year > currentYear + 6) {
      newErrors.year = `Year must be between ${currentYear} and ${currentYear + 6}`;
    }

    // GPA validation
    if (!formData.gpa) {
      newErrors.gpa = 'GPA is required';
    } else if (formData.gpa < 0 || formData.gpa > 4) {
      newErrors.gpa = 'GPA must be between 0 and 4';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    // About validation
    if (!formData.about) {
      newErrors.about = 'Tell us about yourself';
    } else if (formData.about.length < 50) {
      newErrors.about = 'Please write at least 50 characters about yourself';
    }

    // CV Link validation (optional but if provided must be valid)
    if (formData.cvLink && !/^https?:\/\/.+/.test(formData.cvLink)) {
      newErrors.cvLink = 'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await axios.post(
        'http://localhost:8080/api/auth/studentSignUp',
        {
          ...dataToSend,
          year: parseInt(dataToSend.year),
          gpa: parseFloat(dataToSend.gpa),
          age: parseInt(dataToSend.age),
          role: 'STUDENT'
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { data } = response;

      if (data.success) {
        // Login user after successful registration
        login(data.data.user, data.data.accessToken);
        navigate('/student/dashboard');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response) {
        setErrors({ submit: err.response.data?.message || 'Registration failed' });
      } else if (err.request) {
        setErrors({ submit: 'No response from server. Please try again.' });
      } else {
        setErrors({ submit: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join as a Student</h1>
          <p className="text-gray-600">Create your account and start your career journey</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{errors.submit}</span>
                </div>
              )}

              {/* Account Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="student@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="+962770123456"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="18"
                        max="100"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.age ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="22"
                      />
                    </div>
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      University <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="university"
                                            value={formData.university}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.university ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select University</option>
                      {universities.map((uni) => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                    {errors.university && (
                      <p className="mt-1 text-sm text-red-600">{errors.university}</p>
                    )}
                  </div>

                  {/* Major */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Major <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.major ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Major</option>
                      {majors.map((major) => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                    {errors.major && (
                      <p className="mt-1 text-sm text-red-600">{errors.major}</p>
                    )}
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        min={new Date().getFullYear()}
                        max={new Date().getFullYear() + 6}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.year ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={new Date().getFullYear().toString()}
                      />
                    </div>
                    {errors.year && (
                      <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                    )}
                  </div>

                  {/* GPA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA (out of 4.0) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        min="0"
                        max="4"
                        step="0.01"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.gpa ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="3.70"
                      />
                    </div>
                    {errors.gpa && (
                      <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
                    )}
                  </div>
                </div>

                {/* About */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Yourself <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({formData.about.length}/500 characters)
                    </span>
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.about ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about yourself, your interests, career goals, and what you're passionate about..."
                  />
                  {errors.about && (
                    <p className="mt-1 text-sm text-red-600">{errors.about}</p>
                  )}
                </div>

                {/* CV Link */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CV/Resume Link 
                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="cvLink"
                      value={formData.cvLink}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.cvLink ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/your-cv.pdf"
                    />
                  </div>
                  {errors.cvLink && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvLink}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Upload your CV to Google Drive, Dropbox, or any cloud service and paste the public link here
                  </p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    By creating an account, I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Create Student Account
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Build Your Profile</h3>
            </div>
            <p className="text-sm text-gray-600">
              Create a comprehensive profile to showcase your academic achievements and skills
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Connect with Companies</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get discovered by top companies looking for talented students like you
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Join Events</h3>
            </div>
            <p className="text-sm text-gray-600">
              Participate in career events, workshops, and networking opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;