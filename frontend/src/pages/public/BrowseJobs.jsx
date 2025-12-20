// BrowseJobs.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign,
  FaSearch,
  FaBookmark,
  FaStar,
  FaBuilding,
  FaRegClock
} from 'react-icons/fa';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';

const BrowseJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    location: 'all',
  });

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      logo: "/company-logos/tech-solutions.png",
      location: "Amman, Jordan",
      type: "Part-time",
      salary: "$25-30/hr",
      hours: "15-20 hrs/week",
      posted: "2 days ago",
      description: "We are seeking a talented Frontend Developer to join our team on a part-time basis. The ideal candidate will have strong React.js experience and be available to work flexible hours.",
      requirements: [
        "2+ years of React.js experience",
        "Proficiency in HTML, CSS, and JavaScript",
        "Experience with responsive design",
        "Knowledge of modern frontend tools"
      ],
      benefits: [
        "Flexible schedule",
        "Remote work options",
        "Professional development",
        "Performance bonuses"
      ],
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Analytics Pro",
      logo: "/company-logos/analytics-pro.png",
      location: "Remote",
      type: "Part-time",
      salary: "$22-28/hr",
      hours: "12-18 hrs/week",
      posted: "1 day ago",
      description: "Join our data science team and work on real-world projects while pursuing your studies. This position offers flexible hours and valuable industry experience.",
      requirements: [
        "Currently pursuing BS/MS in Data Science or related field",
        "Knowledge of Python and SQL",
        "Statistical analysis skills",
        "Machine learning basics"
      ],
      benefits: [
        "Mentorship program",
        "Flexible schedule",
        "Learning allowance",
        "Project portfolio building"
      ],
      rating: 4.6,
      reviews: 18
    },
    {
      id: 3,
      title: "UI/UX Design Assistant",
      company: "Creative Hub",
      logo: "/company-logos/creative-hub.png",
      location: "Zarqa, Jordan",
      type: "Part-time",
      salary: "$20-25/hr",
      hours: "15-25 hrs/week",
      posted: "3 days ago",
      description: "Looking for a creative UI/UX Design Assistant to help with ongoing projects. Perfect opportunity for design students looking to gain practical experience.",
      requirements: [
        "Strong design portfolio",
        "Proficiency in Figma",
        "Understanding of UI/UX principles",
        "Good communication skills"
      ],
      benefits: [
        "Portfolio development",
        "Creative environment",
        "Flexible hours",
        "Training provided"
      ],
      rating: 4.9,
      reviews: 32
    },
    {
      id: 4,
      title: "Marketing Associate",
      company: "Digital Boost",
      logo: "/company-logos/digital-boost.png",
      location: "Karak, Jordan",
      type: "Part-time",
      salary: "$18-22/hr",
      hours: "10-20 hrs/week",
      posted: "5 days ago",
      description: "Join our marketing team and help with social media management, content creation, and digital marketing campaigns. Ideal for marketing students.",
      requirements: [
        "Marketing or related field student",
        "Social media expertise",
        "Content creation skills",
        "Basic analytics understanding"
      ],
      benefits: [
        "Real campaign experience",
        "Flexible schedule",
        "Performance bonuses",
        "Networking opportunities"
      ],
      rating: 4.7,
      reviews: 15
    }
  ];

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
          <div className="grid md:grid-cols-3 gap-4">
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
              onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Job Types</option>
              <option value="part-time">Part-Time Only</option>
              <option value="internship">Internships</option>
            </select>

            {/* Location Filter */}
            <select
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">On-site Only</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6 mb-12">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

const JobCard = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaBuilding className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{job.company}</span>
                <span>•</span>
                <div className="flex items-center">
                  <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{job.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">({job.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700">
            <FaBookmark className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <DetailItem icon={FaMapMarkerAlt} text={job.location} />
          <DetailItem icon={FaClock} text={job.type} />
          <DetailItem icon={FaDollarSign} text={job.salary} />
          <DetailItem icon={FaRegClock} text={job.hours} />
        </div>

        <p className="text-gray-600 mt-4">{job.description}</p>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
          <ul className="grid grid-cols-2 gap-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Benefits:</h3>
          <ul className="grid grid-cols-2 gap-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">Posted {job.posted}</span>
          <Link to={'/JobDetails'}>
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
    <Icon className="w-4 h-4" />
    <span className="text-sm">{text}</span>
  </div>
);

export default BrowseJobs;