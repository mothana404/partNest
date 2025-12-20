// AboutUs.jsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaGraduationCap,
  FaClock,
  FaLaptopCode,
  FaChartLine,
  FaHandshake,
  FaCheckCircle,
  FaUniversity,
  FaUsers,
  FaLightbulb,
} from "react-icons/fa";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const AboutUs = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Section 1: Students & Universities */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,     // Animation duration
                delay: 0.5,        // Delay before animation starts
                ease: "easeOut"    // Animation easing
              }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-800 font-semibold">
                  For Students
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Balance Your Studies with Professional Growth
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover flexible part-time opportunities that complement your
                academic journey while gaining valuable industry experience.
              </p>
            </motion.div>

            {/* Student Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <StudentFeatureCard
                icon={<FaClock />}
                title="Flexible Hours"
                description="Work around your class schedule with adaptable working hours that prioritize your studies."
                features={[
                  "10-20 hours per week",
                  "Weekend options available",
                  "Exam period flexibility",
                ]}
              />
              <StudentFeatureCard
                icon={<FaLaptopCode />}
                title="Remote Opportunities"
                description="Access remote work opportunities that let you work from your campus or home."
                features={[
                  "Work from anywhere",
                  "Virtual collaboration",
                  "Real project experience",
                ]}
              />
              <StudentFeatureCard
                icon={<FaGraduationCap />}
                title="Academic Integration"
                description="Gain credits and practical experience that counts towards your degree."
                features={[
                  "Course credit eligible",
                  "Industry certifications",
                  "Portfolio building",
                ]}
              />
            </div>

            {/* University Partnerships */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Partner Universities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <UniversityCard name="University of Science and Technology" students="500+" programs="15+" />
                <UniversityCard
                  name="The Hashemite University"
                  students="450+"
                  programs="12+"
                />
                <UniversityCard name="Yarmouk University" students="400+" programs="10+" />
                <UniversityCard name="University of Jordan" students="350+" programs="8+" />
              </div>
            </div>

            {/* Student Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <MetricCard
                number="5,000+"
                label="University of Jordan"
                growth="+45% from last year"
              />
              <MetricCard
                number="92%"
                label="Success Rate"
                growth="Industry Leading"
              />
              <MetricCard
                number="$25/hr"
                label="Average Pay"
                growth="+20% from last year"
              />
              <MetricCard
                number="85%"
                label="Convert to Full-time"
                growth="After graduation"
              />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,     // Animation duration
                delay: 0.2,        // Delay before animation starts
                ease: "easeOut"    // Animation easing
              }}
              className="text-center mb-16"
            >
              <div className="inline-block px-6 py-3 bg-blue-100 rounded-full mb-6">
                <span className="text-blue-800 font-semibold text-lg">
                  Our Mission & Vision
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Empowering Students Through
                <span className="text-blue-600"> Meaningful Opportunities</span>
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                    duration: 0.8,     // Animation duration
                    delay: 0.2,        // Delay before animation starts
                    ease: "easeOut"    // Animation easing
                  }}
                className="bg-white p-8 rounded-2xl shadow-xl"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaLightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 ml-4">
                    Our Mission
                  </h4>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To bridge the gap between academic learning and professional
                  experience by connecting ambitious students with quality
                  part-time opportunities that enhance their educational journey
                  while providing valuable workplace skills.
                </p>
                <ul className="space-y-4">
                  {[
                    "Creating flexible work opportunities that prioritize education",
                    "Fostering partnerships between universities and industry leaders",
                    "Supporting student growth through practical experience",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                    duration: 0.8,     // Animation duration
                    delay: 0.2,        // Delay before animation starts
                    ease: "easeOut"    // Animation easing
                  }}
                className="bg-white p-8 rounded-2xl shadow-xl"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaChartLine className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 ml-4">
                    Our Vision
                  </h4>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To become the leading platform where education meets
                  opportunity, creating a future where every student can gain
                  valuable work experience without compromising their academic
                  success.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-bold text-gray-900 mb-2">2024 Goal</h5>
                    <p className="text-gray-600">
                      Enable 100,000 students to secure meaningful part-time
                      roles
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-bold text-gray-900 mb-2">
                      5-Year Vision
                    </h5>
                    <p className="text-gray-600">
                      Expand to 1000+ universities globally
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Core Values */}
            <div className="text-center mb-12">
              <h4 className="text-2xl font-bold text-gray-900 mb-8">
                Our Core Values
              </h4>
              <div className="grid md:grid-cols-4 gap-8">
                <CoreValueCard
                  icon={<FaGraduationCap />}
                  title="Education First"
                  description="We prioritize academic success while providing valuable work experience"
                  color="blue"
                />
                <CoreValueCard
                  icon={<FaHandshake />}
                  title="Quality Partnerships"
                  description="Building trusted relationships with top companies and universities"
                  color="green"
                />
                <CoreValueCard
                  icon={<FaUsers />}
                  title="Student Success"
                  description="Supporting students throughout their professional journey"
                  color="purple"
                />
                <CoreValueCard
                  icon={<FaLaptopCode />}
                  title="Innovation"
                  description="Continuously improving our platform to better serve students"
                  color="red"
                />
              </div>
            </div>

            {/* Impact Numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,     // Animation duration
                delay: 0.2,        // Delay before animation starts
                ease: "easeOut"    // Animation easing
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold mb-2">Our Impact</h4>
                <p className="text-lg opacity-90">
                  Making a difference in students' lives
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ImpactCard number="50,000+" label="Students Placed" />
                <ImpactCard number="1,000+" label="Partner Companies" />
                <ImpactCard number="200+" label="Universities" />
                <ImpactCard number="95%" label="Student Satisfaction" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Continue with remaining sections in Part 2... */}
      </div>
      <Footer />
    </>
  );
};

// Helper Components
const StudentFeatureCard = ({ icon, title, description, features }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
        duration: 0.8,     // Animation duration
        delay: 0.2,        // Delay before animation starts
        ease: "easeOut"    // Animation easing
      }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
  >
    <div className="text-blue-600 mb-4">
      {React.cloneElement(icon, { className: "w-8 h-8" })}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-gray-600">
          <FaCheckCircle className="text-green-500 mr-2 w-4 h-4" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);

const UniversityCard = ({ name, students, programs }) => (
  <div className="text-center">
    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
      <FaUniversity className="w-8 h-8 text-blue-600" />
    </div>
    <h4 className="font-bold text-gray-900">{name}</h4>
    <p className="text-sm text-gray-600">{students} students</p>
    <p className="text-sm text-gray-600">{programs} programs</p>
  </div>
);

const MetricCard = ({ number, label, growth }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
        duration: 0.8,     // Animation duration
        delay: 0.2,        // Delay before animation starts
        ease: "easeOut"    // Animation easing
      }}
    className="bg-white rounded-xl shadow-lg p-6 text-center"
  >
    <h3 className="text-3xl font-bold text-gray-900 mb-2">{number}</h3>
    <p className="text-gray-600 mb-2">{label}</p>
    <p className="text-sm text-green-600">{growth}</p>
  </motion.div>
);

const CoreValueCard = ({ icon, title, description, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
        duration: 0.8,     // Animation duration
        delay: 0.2,        // Delay before animation starts
        ease: "easeOut"    // Animation easing
      }}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
  >
    <div className={`text-${color}-600 mb-4`}>
      {React.cloneElement(icon, { className: "w-8 h-8" })}
    </div>
    <h5 className="text-lg font-bold text-gray-900 mb-2">{title}</h5>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

const ImpactCard = ({ number, label }) => (
  <div className="text-center">
    <h5 className="text-3xl font-bold mb-2">{number}</h5>
    <p className="text-sm opacity-90">{label}</p>
  </div>
);

export default AboutUs;
