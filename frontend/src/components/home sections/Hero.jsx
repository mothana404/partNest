import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatureDisplay from "../common/FeatureDisplay";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const companyLogos = [
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      jobCount: "150+",
      rating: "4.8",
      industry: "Technology",
    },
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      jobCount: "200+",
      rating: "4.9",
      industry: "Technology",
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      jobCount: "300+",
      rating: "4.6",
      industry: "E-commerce",
    },
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      jobCount: "180+",
      rating: "4.7",
      industry: "Technology",
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      jobCount: "120+",
      rating: "4.5",
      industry: "Social Media",
    },
  ];
  
  const companyDetails = [
    {
      label: "Active Jobs",
      value: "500+",
      description: "Open positions worldwide",
      color: "blue",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      label: "Companies",
      value: "2.5k+",
      description: "Hiring partners",
      color: "purple",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "Developers",
      value: "1M+",
      description: "Active job seekers",
      color: "green",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: "Success Rate",
      value: "92%",
      description: "Placement ratio",
      color: "orange",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-[90vh] overflow-x-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute right-0 w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-pink-300/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center overflow-visible">
          {/* Left Column */}
          <div
            className={`space-y-8 max-w-xl transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Find Your Dream
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block mt-2">
                IT Career
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Connect with top tech companies and start your journey towards a
              successful career. Thousands of opportunities await for talented
              professionals.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search for jobs, companies, or keywords..."
                className="w-full px-8 py-5 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 pr-40 text-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg">
                Search
              </button>
            </div>

            {/* Stats */}
            <div className="flex space-x-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  10k+
                </div>
                <div className="text-gray-600 font-medium mt-1">
                  Active Jobs
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                  5k+
                </div>
                <div className="text-gray-600 font-medium mt-1">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-800">
                  20k+
                </div>
                <div className="text-gray-600 font-medium mt-1">Developers</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className={`relative right-12 bottom-16 transition-all duration-1000 w-full h-[600px] flex justify-center items-center ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="w-full h-full flex items-center justify-center overflow-visible">
              <FeatureDisplay />
            </div>
          </div>
        </div>{" "}
        <div
          className={`mt-16 pb-6 transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="relative">
              <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
                Trusted by Leading Companies
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                Join thousands of successful companies that trust PartNest for
                their IT recruitment needs
              </p>

              {/* Company Logos Grid */}
              <div className="grid grid-cols-5 gap-8 items-center justify-items-center mb-12">
                {companyLogos.map((company) => (
                  <div
                    key={company.name}
                    className="group relative flex flex-col items-center justify-center w-full h-32 p-4"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-12 w-auto grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                    />
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 w-full z-10">
                      <div className="bg-white rounded-xl shadow-lg p-3 text-center mx-4">
                        <p className="font-semibold text-gray-900">
                          {company.name}
                        </p>
                        <div className="flex justify-center items-center space-x-4 mt-2 text-sm">
                          <span className="text-blue-600">
                            {company.jobCount} jobs
                          </span>
                          <span className="flex items-center text-yellow-500">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {company.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {companyDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className={`bg-${detail.color}-50 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className={`text-${detail.color}-600 mb-4`}>
                      {detail.icon}
                    </div>
                    <div
                      className={`text-3xl font-bold text-${detail.color}-600 mb-1`}
                    >
                      {detail.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {detail.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {detail.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-600 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Verified by PartNest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
