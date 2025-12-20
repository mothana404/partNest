import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Build your professional profile highlighting your skills, experiences, and career interests",
      icon: "👤",
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      delay: 0.2,
    },
    {
      id: 2,
      title: "Explore Opportunities",
      description: "Browse through curated internships and job opportunities matching your profile",
      icon: "🔍",
      color: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      delay: 0.4,
    },
    {
      id: 3,
      title: "Apply & Interview",
      description: "Submit applications and prepare for interviews with our comprehensive resources",
      icon: "📝",
      color: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      delay: 0.6,
    },
    {
      id: 4,
      title: "Start Your Journey",
      description: "Begin your internship and launch your career in tech with ongoing support",
      icon: "🚀",
      color: "bg-orange-50",
      borderColor: "border-orange-200",
      iconBg: "bg-orange-100",
      delay: 0.8,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to a successful tech career starts here. Follow these simple steps to land your dream internship.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={item}
              className="relative"
            >
              {/* Connecting Lines */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-200">
                  <div className="absolute top-1/2 right-0 w-3 h-3 rounded-full bg-gray-200 -mt-1.5" />
                </div>
              )}

              {/* Step Card */}
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`relative ${step.color} rounded-xl p-6 border ${step.borderColor} shadow-sm`}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">
                    {step.id}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 ${step.iconBg} rounded-full flex items-center justify-center mb-6 mx-auto text-3xl`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>

                {/* Learn More Link */}
                <div className="mt-6 text-center">
                  <motion.a
                    whileHover={{ x: 5 }}
                    href={`#learn-more-${step.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Learn More
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-600">
              Need help? Check out our{" "}
              <a href="#resources" className="text-blue-600 hover:text-blue-700 font-medium">
                Resource Center
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;