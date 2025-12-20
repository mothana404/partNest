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
  FaMoneyBillWave
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';

const JobDetails = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  return (
    <>
    <Navbar/>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-48">
        <div className="max-w-7xl mx-auto px-4 h-full relative">
          <div className="absolute -bottom-16 left-4 right-4 bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Company Logo */}
              <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100">
                <FaLaptopCode className="w-10 h-10 text-blue-500" />
              </div>

              {/* Job Title and Company Info */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    Part Time
                  </span>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                    Karak, Jordan
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Senior Frontend Developer
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="font-medium">TechCorp Solutions</span>
                  <div className="flex items-center">
                    <FaStar className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>4.8</span>
                    <span className="text-gray-400 ml-1">(128 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-lg border ${
                    isBookmarked 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                  } transition-all duration-200`}
                >
                  <FaBookmark className="w-5 h-5" />
                </button>
                {/* <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
                  <span>Apply Now</span>
                  <span className="text-sm">→</span>
                </button> */}
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
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickInfoCard
                icon={<FaMoneyBillWave className="w-6 h-6 text-green-500" />}
                label="Salary Range"
                value="$30-40/hr"
              />
              <QuickInfoCard
                icon={<FaRegClock className="w-6 h-6 text-blue-500" />}
                label="Working Hours"
                value="15-20 hrs/week"
              />
              <QuickInfoCard
                icon={<FaCalendarAlt className="w-6 h-6 text-purple-500" />}
                label="Start Date"
                value="Immediate"
              />
              <QuickInfoCard
                icon={<FaUserGraduate className="w-6 h-6 text-indigo-500" />}
                label="Experience"
                value="2+ years"
              />
            </div>

            {/* Job Description */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">
                We are looking for a talented Senior Frontend Developer to join our dynamic team
                on a part-time basis. This role offers the perfect opportunity to balance work
                with other commitments while contributing to meaningful projects.
              </p>
              
              {/* Key Responsibilities */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-3">
                  {[
                    "Lead frontend development for key projects",
                    "Mentor junior developers and review code",
                    "Implement responsive and accessible designs",
                    "Optimize application performance",
                    "Collaborate with UX/UI designers"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Requirements */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <RequirementCard
                  icon={<FaCode className="w-6 h-6 text-blue-500" />}
                  title="Technical Skills"
                  items={[
                    "React.js expertise",
                    "TypeScript proficiency",
                    "CSS/SASS mastery",
                    "REST APIs knowledge"
                  ]}
                />
                <RequirementCard
                  icon={<FaCertificate className="w-6 h-6 text-purple-500" />}
                  title="Qualifications"
                  items={[
                    "Bachelor's in CS or related",
                    "2+ years React experience",
                    "Portfolio of projects",
                    "English proficiency"
                  ]}
                />
              </div>
            </section>

            {/* Continue with Benefits and Company Culture sections... */}
          </div>

          {/* Right Column - Application Details and Company Info */}
          <div className="space-y-6">
            {/* Application Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
              <div className="space-y-4">
                <DetailItem
                  icon={<FaCalendarAlt className="w-5 h-5 text-gray-400" />}
                  label="Posted On"
                  value="June 15, 2024"
                />
                <DetailItem
                  icon={<FaUsers className="w-5 h-5 text-gray-400" />}
                  label="Applicants"
                  value="45 applied"
                />
                <DetailItem
                  icon={<FaClock className="w-5 h-5 text-gray-400" />}
                  label="Deadline"
                  value="July 15, 2024"
                />
              </div>
              <Link to={'/signin'} >
                  <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
                Apply Now
              </button>
              </Link>
            </div>

            {/* Continue with Company Info Card... */}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
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
    <p className="text-gray-900 font-semibold">{value}</p>
  </div>
);

const RequirementCard = ({ icon, title, items }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default JobDetails;