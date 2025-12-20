import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const PlatformBenefits = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 1,
      icon: "🎯",
      title: "Smart Job Matching",
      description: "Our AI-powered system matches you with the perfect opportunities based on your skills, interests, and career goals.",
      stats: "93% match accuracy",
      benefits: [
        "Personalized job recommendations",
        "Skill-based matching",
        "Industry-specific suggestions",
        "Location preferences considered"
      ]
    },
    {
      id: 2,
      icon: "⚡",
      title: "Quick Application",
      description: "Apply to multiple positions with your smart profile. No need to repeat information across applications.",
      stats: "5 minute average application time",
      benefits: [
        "One-click applications",
        "Smart profile auto-fill",
      ]
    },
    {
      id: 3,
      icon: "🎓",
      title: "Student-Focused Platform",
      description: "Specially designed for students and recent graduates, with features that highlight your potential rather than just experience.",
      stats: "85% success rate",
      benefits: [
        "Academic project showcase",
        "Interview preparation",
        "Career guidance"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Career Journey Made Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've revolutionized the job search process for students. Find and land your dream internship or entry-level position faster and easier than ever.
          </p>
        </motion.div>

        {/* Main Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Interactive Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
              <div className="relative">
                {/* Platform Screenshot or Illustration */}
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-white p-4 rounded-t-lg border-b border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="bg-gray-900 p-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: item * 0.1 }}
                          className="h-16 bg-gray-800 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 bg-white rounded-full p-4 shadow-lg"
                >
                  <span className="text-2xl">🚀</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Features List */}
          <div className="space-y-6">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer"
                onClick={() => setActiveFeature(feature.id === activeFeature ? null : feature.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>

                {/* Expandable Content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeFeature === feature.id ? "auto" : 0,
                    opacity: activeFeature === feature.id ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {feature.stats}
                    </div>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">2x</div>
            <div className="text-gray-600">Faster Job Search</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
            <div className="text-gray-600">Application Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
            <div className="text-gray-600">Students Placed</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <Link to = "/SignUp">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Create Your Profile Now
          </button>
          <p className="mt-4 text-gray-600">
            Join thousands of students who've found their dream careers through our platform
          </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformBenefits;