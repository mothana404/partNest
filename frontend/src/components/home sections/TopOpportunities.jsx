import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const topJobs = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    location: "Redmond, WA",
    salary: "$6000/month",
    duration: "3 months",
    skills: ["React", "Node.js", "AWS", "TypeScript"],
    applicants: 150,
    deadline: "2024-03-30",
  },
  {
    id: 2,
    title: "ML Research Intern",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    location: "Mountain View, CA",
    salary: "$7500/month",
    duration: "6 months",
    skills: ["Python", "PyTorch", "TensorFlow", "ML"],
    applicants: 200,
    deadline: "2024-04-15",
  },
  {
    id: 3,
    title: "Product Design Intern",
    company: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    location: "Cupertino, CA",
    salary: "$6500/month",
    duration: "4 months",
    skills: ["Figma", "UI/UX", "Prototyping", "Design"],
    applicants: 180,
    deadline: "2024-04-01",
  },
];

const TopOpportunities = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Top Opportunities for You
          </h2>
          <p className="text-xl text-gray-600">
            Exclusive internship positions at leading tech companies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Card Content */}
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="h-8 w-auto"
                      />
                      <span className="text-sm font-medium text-gray-500">
                        {job.company}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                      <svg 
                        className="w-4 h-4 text-blue-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Title and Location */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {job.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                    </svg>
                    {job.location}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-sm font-medium 
                          bg-gray-100 text-gray-600 group-hover:bg-blue-50 
                          group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                    <div>
                      <p className="text-gray-500 text-sm">Salary</p>
                      <p className="font-semibold text-gray-900">{job.salary}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Duration</p>
                      <p className="font-semibold text-gray-900">{job.duration}</p>
                    </div>
                  </div>

                  {/* Application Info */}
                  <div className="flex items-center justify-between mb-6 text-sm">
                    <div className="flex items-center text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      {job.applicants} applicants
                    </div>
                    <div className="text-gray-500">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Link to={'/JobDetails'}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 rounded-lg bg-gray-900 text-white 
                      font-medium hover:bg-blue-600 transition-colors duration-300"
                  >
                    Apply Now
                  </motion.button>
                  </Link>
                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopOpportunities;