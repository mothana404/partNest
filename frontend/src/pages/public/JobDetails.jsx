// JobDetails.jsx
import React, { useEffect, useState } from 'react';
import {
  FaClock,
  FaStar,
  FaCheckCircle,
  FaUsers,
  FaBookmark,
  FaCalendarAlt,
  FaUserGraduate,
  FaRegClock,
  FaCode,
  FaCertificate,
  FaLaptopCode,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBuilding,
  FaGlobe,
  FaSpinner,
  FaExclamationCircle,
  FaBriefcase,
  FaGraduationCap,
  FaCheck
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`http://localhost:8080/api/home/${id}`);

      if (response.data.success) {
        setJob(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const formatJobType = (type) => {
    return type.replace('_', '-').toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSalary = () => {
    if (!job) return 'Negotiable';
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryCurrency} ${job.salaryMin}-${job.salaryMax}`;
    } else if (job.salaryMin) {
      return `${job.salaryCurrency} ${job.salaryMin}+`;
    }
    return 'Negotiable';
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeSincePosted = (createdAt) => {
    const now = new Date();
    const posted = new Date(createdAt);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FaExclamationCircle className="text-red-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link 
              to="/jobs" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return null;
  }

  const requirements = job.requirements ? job.requirements.split('\n').filter(r => r.trim()) : [];
  const responsibilities = job.responsibilities ? job.responsibilities.split('\n').filter(r => r.trim()) : [];
  const benefits = job.benefits ? job.benefits.split('\n').filter(b => b.trim()) : [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-48">
          <div className="max-w-7xl mx-auto px-4 h-full relative">
            <div className="absolute -bottom-16 left-4 right-4 bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Company Logo */}
                <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100 overflow-hidden">
                  {job.company?.user?.image ? (
                    <img 
                      src={job.company.user.image} 
                      alt={job.company.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaLaptopCode className="w-10 h-10 text-blue-500" />
                  )}
                </div>

                {/* Job Title and Company Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {formatJobType(job.jobType)}
                    </span>
                    {job.location && (
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                        {job.location}
                      </span>
                    )}
                    {job.status !== 'ACTIVE' && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                        {job.status}
                      </span>
                    )}
                    {job.company?.isVerified && (
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium flex items-center gap-1">
                        <FaCheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600 flex-wrap">
                    <span className="font-medium">{job.company?.companyName}</span>
                    {job.company?.industry && (
                      <>
                        <span>•</span>
                        <span className="text-sm">{job.company.industry}</span>
                      </>
                    )}
                  </div>
                  {job.category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                      {job.category.name}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-lg border ${
                      isBookmarked 
                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                    } transition-all duration-200`}
                  >
                    <FaBookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Job Details */}
            <div className="md:col-span-2 space-y-8">
              {/* Application Status Alert */}
              {(!job.canApply || job.hasDeadlinePassed || job.hasReachedMaxApplications) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaExclamationCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900">Application Unavailable</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {job.hasDeadlinePassed && 'The application deadline has passed.'}
                        {job.hasReachedMaxApplications && 'This position has reached the maximum number of applications.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickInfoCard
                  icon={<FaMoneyBillWave className="w-6 h-6 text-green-500" />}
                  label="Salary Range"
                  value={formatSalary()}
                />
                <QuickInfoCard
                  icon={<FaBriefcase className="w-6 h-6 text-blue-500" />}
                  label="Experience"
                  value={job.experienceRequired || 'Any level'}
                />
                <QuickInfoCard
                  icon={<FaGraduationCap className="w-6 h-6 text-purple-500" />}
                  label="Education"
                  value={job.educationRequired || 'Not specified'}
                />
                <QuickInfoCard
                  icon={<FaUsers className="w-6 h-6 text-indigo-500" />}
                  label="Applicants"
                  value={`${job.applicationCount} applied`}
                />
              </div>

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Skills & Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Description */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 break-all">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 break-all">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                  <ul className="space-y-3">
                    {responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 break-all">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <div className="space-y-3">
                    {requirements.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaCheck className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 break-words break-all">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {benefits.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <FaCheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* About Company */}
              {job.company?.description && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 break-all">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company.companyName}</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {job.company.description}
                  </p>
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <FaGlobe className="w-4 h-4" />
                      <span>Visit Company Website</span>
                    </a>
                  )}
                </section>
              )}
            </div>

            {/* Right Column - Application Details */}
            <div className="space-y-6">
              {/* Application Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
                <div className="space-y-4">
                  <DetailItem
                    icon={<FaCalendarAlt className="w-5 h-5 text-gray-400" />}
                    label="Posted On"
                    value={getTimeSincePosted(job.createdAt)}
                  />
                  <DetailItem
                    icon={<FaUsers className="w-5 h-5 text-gray-400" />}
                    label="Total Applicants"
                    value={`${job.applicationCount} applied`}
                  />
                  {job.applicationDeadline && (
                    <DetailItem
                      icon={<FaClock className="w-5 h-5 text-gray-400" />}
                      label="Deadline"
                      value={formatDate(job.applicationDeadline)}
                    />
                  )}
                  {job.maxApplications && (
                    <DetailItem
                      icon={<FaUsers className="w-5 h-5 text-gray-400" />}
                      label="Max Applications"
                      value={`${job.maxApplications} positions`}
                    />
                  )}
                </div>

                {/* Application Stats */}
                {job.applicationStats && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Application Status</h3>
                    <div className="space-y-2">
                      <StatBar 
                        label="Pending" 
                        count={job.applicationStats.pending}
                        total={job.applicationStats.total}
                        color="yellow"
                      />
                      <StatBar 
                        label="Interviewed" 
                        count={job.applicationStats.interviewed}
                        total={job.applicationStats.total}
                        color="blue"
                      />
                      <StatBar 
                        label="Accepted" 
                        count={job.applicationStats.accepted}
                        total={job.applicationStats.total}
                        color="green"
                      />
                    </div>
                  </div>
                )}

                {job.canApply ? (
                  <Link to={'http://localhost:3000/login'}>
                    <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold">
                      Apply Now
                    </button>
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="w-full mt-6 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
                  >
                    Applications Closed
                  </button>
                )}
              </div>

              {/* Company Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Company Information</h2>
                <div className="space-y-4">
                  <DetailItem
                    icon={<FaBuilding className="w-5 h-5 text-gray-400" />}
                    label="Company Size"
                    value={job.company?.size || 'Not specified'}
                  />
                  {job.company?.foundedYear && (
                    <DetailItem
                      icon={<FaCalendarAlt className="w-5 h-5 text-gray-400" />}
                      label="Founded"
                      value={job.company.foundedYear}
                    />
                  )}
                  {job.company?.address && (
                    <DetailItem
                      icon={<FaMapMarkerAlt className="w-5 h-5 text-gray-400" />}
                      label="Location"
                      value={job.company.address}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Helper Components
const QuickInfoCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
    <p className="text-gray-900 font-semibold text-sm">{value}</p>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start justify-between gap-2">
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium text-gray-900 text-sm text-right">{value}</span>
  </div>
);

const StatBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const colorClasses = {
    yellow: 'bg-yellow-200',
    blue: 'bg-blue-200',
    green: 'bg-green-200'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default JobDetails;