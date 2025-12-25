// BrowseJobs.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign,
  FaSearch,
  FaBookmark,
  FaBuilding,
  FaRegClock,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    location: 'all',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: 10
  });

  useEffect(() => {
    fetchJobs();
  }, [selectedFilters, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm,
        type: selectedFilters.type,
        location: selectedFilters.location,
        page: pagination.currentPage,
        limit: pagination.jobsPerPage
      };

      const response = await axios.get('http://localhost:8080/api/home/browse', { params });

      if (response.data.success) {
        setJobs(response.data.data.jobs);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchJobs();
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Find Your Perfect Part-Time Role</h1>
              <p className="text-xl text-blue-100">
                Discover opportunities that fit your schedule and career goals
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Job Type Filter */}
              <select
                value={selectedFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Job Types</option>
                <option value="part_time">Part-Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="remote">Remote</option>
              </select>

              {/* Location Filter */}
              <select
                value={selectedFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site Only</option>
              </select>
            </form>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 text-gray-600">
              Showing {jobs.length} of {pagination.totalJobs} jobs
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-blue-600 text-4xl" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <FaSearch className="text-6xl mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Jobs List */}
          {!loading && !error && jobs.length > 0 && (
            <>
              <div className="space-y-6 mb-12">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mb-12">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <FaChevronLeft />
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        return page === 1 || 
                               page === pagination.totalPages || 
                               Math.abs(page - pagination.currentPage) <= 1;
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg ${
                              pagination.currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

const JobCard = ({ job }) => {
  const formatJobType = (type) => {
    return type.replace('_', '-').toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryCurrency} ${job.salaryMin}-${job.salaryMax}`;
    } else if (job.salaryMin) {
      return `${job.salaryCurrency} ${job.salaryMin}+`;
    }
    return 'Negotiable';
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

  const requirements = job.requirements ? job.requirements.split('\n').filter(r => r.trim()) : [];
  const benefits = job.benefits ? job.benefits.split('\n').filter(b => b.trim()) : [];
  const responsibilities = job.responsibilities ? job.responsibilities.split('\n').filter(r => r.trim()) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {job.company?.user?.image ? (
                <img 
                  src={job.company.user.image} 
                  alt={job.company.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaBuilding className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{job.company?.companyName}</span>
                {job.company?.industry && (
                  <>
                    <span>•</span>
                    <span className="text-sm">{job.company.industry}</span>
                  </>
                )}
              </div>
              {job.category && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {job.category.name}
                </span>
              )}
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700">
            <FaBookmark className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <DetailItem icon={FaMapMarkerAlt} text={job.location || 'Not specified'} />
          <DetailItem icon={FaClock} text={formatJobType(job.jobType)} />
          <DetailItem icon={FaDollarSign} text={formatSalary()} />
          <DetailItem icon={FaRegClock} text={job.experienceRequired || 'Any level'} />
        </div>

        <p className="text-gray-600 mt-4 line-clamp-3">{job.description}</p>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {job.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {requirements.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {requirements.slice(0, 4).map((req, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 mt-1.5"></span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {benefits.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Benefits:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {benefits.slice(0, 4).map((benefit, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-1.5"></span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Posted {getTimeSincePosted(job.createdAt)}</span>
            {job.applicationCount > 0 && (
              <>
                <span>•</span>
                <span>{job.applicationCount} applicants</span>
              </>
            )}
          </div>
          <Link to={`/JobDetails/${job.id}`}>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Apply Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 text-gray-600">
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="text-sm truncate">{text}</span>
  </div>
);

export default BrowseJobs;