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
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut"
              }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-800 font-semibold">
                  For University Students
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Earn While You Learn Across All Industries
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're interested in retail, hospitality, education, healthcare, or marketing, find flexible opportunities that fit your schedule and build real-world experience.
              </p>
            </motion.div>

            {/* Student Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <StudentFeatureCard
                icon={<FaClock />}
                title="Flexible Schedules"
                description="Work around your classes with part-time positions designed for busy students."
                features={[
                  "Weekend & evening shifts",
                  "Exam period accommodations",
                  "Choose your own hours",
                ]}
              />
              <StudentFeatureCard
                icon={<FaLaptopCode />}
                title="Diverse Industries"
                description="Explore opportunities in retail, food service, tutoring, healthcare support, and more."
                features={[
                  "Retail & customer service",
                  "Food & hospitality",
                  "Office administration",
                ]}
              />
              <StudentFeatureCard
                icon={<FaGraduationCap />}
                title="Build Your Resume"
                description="Gain valuable work experience that employers look for when you graduate."
                features={[
                  "Develop transferable skills",
                  "Professional references",
                  "Industry connections",
                ]}
              />
            </div>

            {/* University Partnerships */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Partner Universities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <UniversityCard name="University of Jordan" students="500+" programs="15+" />
                <UniversityCard
                  name="The Hashemite University"
                  students="450+"
                  programs="12+"
                />
                <UniversityCard name="Yarmouk University" students="400+" programs="10+" />
                <UniversityCard name="Jordan University of Science and Technology" students="350+" programs="8+" />
              </div>
            </div>

            {/* Student Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <MetricCard
                number="5,000+"
                label="Active Students"
                growth="+45% from last year"
              />
              <MetricCard
                number="85%"
                label="Job Placement Rate"
                growth="Industry Leading"
              />
              <MetricCard
                number="$15/hr"
                label="Average Hourly Rate"
                growth="Competitive wages"
              />
              <MetricCard
                number="78%"
                label="Skill Development"
                growth="Report improved skills"
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
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
              }}
              className="text-center mb-16"
            >
              <div className="inline-block px-6 py-3 bg-blue-100 rounded-full mb-6">
                <span className="text-blue-800 font-semibold text-lg">
                  Our Mission & Vision
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Connecting Students with
                <span className="text-blue-600"> Opportunities Everywhere</span>
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut"
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
                  To empower university students by connecting them with flexible, student-friendly jobs across all industries—from retail stores and restaurants to tutoring centers and healthcare facilities. We help students gain valuable work experience while supporting their academic goals.
                </p>
                <ul className="space-y-4">
                  {[
                    "Providing access to jobs in retail, hospitality, education, healthcare, and more",
                    "Partnering with employers who understand student schedules and priorities",
                    "Supporting students in building skills that last a lifetime",
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
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut"
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
                  To become the leading platform where every university student can find meaningful employment opportunities that complement their studies, regardless of their field of interest or career aspirations.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-bold text-gray-900 mb-2">2024 Goal</h5>
                    <p className="text-gray-600">
                      Connect 10,000 students with jobs across all industries
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h5 className="font-bold text-gray-900 mb-2">
                      5-Year Vision
                    </h5>
                    <p className="text-gray-600">
                      Partner with 100+ universities nationwide
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
                  title="Students First"
                  description="Your education is our priority. We ensure every job fits your academic schedule"
                  color="blue"
                />
                <CoreValueCard
                  icon={<FaHandshake />}
                  title="Industry Diversity"
                  description="Partnering with employers across retail, hospitality, education, healthcare, and beyond"
                  color="green"
                />
                <CoreValueCard
                  icon={<FaUsers />}
                  title="Fair Opportunities"
                  description="Equal access to quality jobs for all students, regardless of major or experience level"
                  color="purple"
                />
                <CoreValueCard
                  icon={<FaLaptopCode />}
                  title="Simple & Accessible"
                  description="Making job searching easy with our user-friendly platform designed for students"
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
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold mb-2">Our Impact</h4>
                <p className="text-lg opacity-90">
                  Making a real difference for students everywhere
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ImpactCard number="5,000+" label="Students Hired" />
                <ImpactCard number="500+" label="Partner Employers" />
                <ImpactCard number="50+" label="Universities" />
                <ImpactCard number="88%" label="Student Satisfaction" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Industries We Serve Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut"
              }}
              className="text-center mb-16"
            >
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-800 font-semibold">
                  All Industries Welcome
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Opportunities Across Every Sector
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                No matter what you're studying or what interests you, we have jobs that match your goals and schedule.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <IndustryCard
                emoji="🛒"
                title="Retail & Sales"
                description="Work in stores, boutiques, and shopping centers. Perfect for developing customer service and communication skills."
                examples={["Sales Associate", "Cashier", "Stock Clerk", "Visual Merchandiser"]}
              />
              <IndustryCard
                emoji="🍽️"
                title="Food & Hospitality"
                description="Join restaurants, cafes, and hotels. Great for students who enjoy fast-paced, social environments."
                examples={["Server", "Barista", "Host/Hostess", "Kitchen Assistant"]}
              />
              <IndustryCard
                emoji="📚"
                title="Education & Tutoring"
                description="Share your knowledge by tutoring younger students or assisting in educational centers."
                examples={["Private Tutor", "Teaching Assistant", "After-school Program Staff", "Language Instructor"]}
              />
              <IndustryCard
                emoji="🏥"
                title="Healthcare Support"
                description="Support healthcare facilities with administrative and patient care assistance roles."
                examples={["Medical Receptionist", "Care Assistant", "Pharmacy Technician", "Patient Coordinator"]}
              />
              <IndustryCard
                emoji="💼"
                title="Office & Administration"
                description="Build professional skills in business environments with flexible office-based positions."
                examples={["Administrative Assistant", "Data Entry Clerk", "Receptionist", "Office Coordinator"]}
              />
              <IndustryCard
                emoji="🎨"
                title="Creative & Marketing"
                description="Explore creative roles in marketing agencies, design studios, and media companies."
                examples={["Social Media Assistant", "Content Creator", "Graphic Design Intern", "Marketing Coordinator"]}
              />
            </div>
          </div>
        </section>
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
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
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
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
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
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
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

const IndustryCard = ({ emoji, title, description, examples }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
        duration: 0.6,
        delay: 0.1,
        ease: "easeOut"
      }}
    className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
  >
    <div className="text-5xl mb-4">{emoji}</div>
    <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700">Common Roles:</p>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, index) => (
          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {example}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default AboutUs;