// SavedJobs.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaTrash,
  FaRegClock,
  FaExternalLinkAlt,
  FaSearch
} from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';

const SavedJobs = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  const savedJobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Solutions Inc.",
      location: "Karak, Jordan",
      type: "Part-time",
      salary: "$25-30/hr",
      savedDate: "2025-05-15",
      deadline: "2025-06-28",
      status: "active",
      description: "Looking for a passionate frontend developer intern to join our team...",
      requirements: ["React", "JavaScript", "HTML/CSS"],
      workingHours: "15-20 hrs/week",
      applicants: 45
    },
    {
      id: 2,
      title: "Data Science Student Assistant",
      company: "DataTech Labs",
      location: "Remote",
      type: "Part-time",
      salary: "$22-28/hr",
      savedDate: "2025-05-10",
      deadline: "2025-06-25",
      status: "active",
      description: "Join our data science team as a student assistant...",
      requirements: ["Python", "SQL", "Statistics"],
      workingHours: "12-18 hrs/week",
      applicants: 32
    },
    {
      id: 3,
      title: "UI/UX Design Intern",
      company: "Creative Hub",
      location: "Amman, Jordan",
      type: "Part-time",
      salary: "$20-25/hr",
      savedDate: "2025-01-05",
      deadline: "2025-01-30",
      status: "expired",
      description: "Seeking creative UI/UX design intern for exciting projects...",
      requirements: ["Figma", "Adobe XD", "UI Design"],
      workingHours: "15-25 hrs/week",
      applicants: 58
    },
    {
      id: 4,
      title: "Software Engineering Intern",
      company: "Innovation Labs",
      location: "Zarqa, Jordan",
      type: "Part-time",
      salary: "$28-35/hr",
      savedDate: "2025-05-18",
      deadline: "2025-06-15",
      status: "active",
      description: "Join our engineering team as a software development intern...",
      requirements: ["Java", "Spring Boot", "MySQL"],
      workingHours: "20 hrs/week",
      applicants: 67
    }
  ];

  return (
    <>
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">
            Track and manage your saved job opportunities
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Saved Jobs</option>
              <option value="active">Active Jobs</option>
              <option value="expired">Expired Jobs</option>
            </select>

            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date Saved</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="salary">Sort by Salary</option>
            </select>
          </div>
        </div>

        {/* Saved Jobs List */}
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <SavedJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
    </DashboardLayout>
    </>
  );
};

const SavedJobCard = ({ job }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaBuilding className="w-6 h-6 text-blue-500" />
            </div>

            {/* Job Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {job.title}
              </h2>
              <p className="text-gray-600 mb-2">{job.company}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {job.type}
                </span>
                {job.status === 'expired' && (
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                    Expired
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200">
              <FaTrash className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <FaExternalLinkAlt className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <DetailItem
            icon={FaMapMarkerAlt}
            label="Location"
            value={job.location}
          />
          <DetailItem
            icon={FaDollarSign}
            label="Salary"
            value={job.salary}
          />
          <DetailItem
            icon={FaRegClock}
            label="Hours"
            value={job.workingHours}
          />
          <DetailItem
            icon={FaClock}
            label="Deadline"
            value={new Date(job.deadline).toLocaleDateString()}
          />
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.requirements.map((req, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              {req}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Saved on {new Date(job.savedDate).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">
            {job.applicants} applicants
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-gray-400" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default SavedJobs;