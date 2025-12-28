// ContactUs.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaPhone, 
  FaEnvelope, 
  FaCheckCircle, 
  FaPaperPlane,
  FaClock,
  FaExclamationCircle, 
  FaUser,
  FaMapMarkerAlt,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (value.trim().length > 100) {
          return 'Name cannot exceed 100 characters';
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          return 'Name can only contain letters and spaces';
        }
        return '';

      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'subject':
        if (!value.trim()) {
          return 'Subject is required';
        }
        if (value.trim().length < 5) {
          return 'Subject must be at least 5 characters';
        }
        if (value.trim().length > 200) {
          return 'Subject cannot exceed 200 characters';
        }
        return '';

      case 'message':
        if (!value.trim()) {
          return 'Message is required';
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters';
        }
        if (value.trim().length > 2000) {
          return 'Message cannot exceed 2000 characters';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus((prevStatus) => ({ 
      ...prevStatus, 
      submitting: true,
      info: { error: false, msg: null }
    }));

    try {
      const response = await axios.post('http://localhost:8080/api/home/contact', formData);
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: response.data.message },
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTouched({});

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { 
          error: true, 
          msg: error.response?.data?.message || 'Failed to send message. Please try again.' 
        },
      });

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, info: { error: false, msg: null } }));
      }, 5000);
    }
  };

  const getCharacterCount = (field) => {
    const maxLengths = {
      name: 100,
      subject: 200,
      message: 2000
    };
    return `${formData[field].length}/${maxLengths[field]}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
              >
                ✨ Get in Touch
              </motion.span>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
                We'd Love to Hear From You
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Whether you have a question about our platform, features, or anything else, 
                our team is ready to answer all your questions.
              </p>
            </motion.div>

            {/* Quick Contact Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <QuickContactCard
                icon={<FaClock />}
                title="Working Hours"
                content={["sunday - thursday: 9AM - 5PM", "Weekend: 9AM - 4PM"]}
                highlight="Available 24/7 Online"
                color="blue"
                delay={0.1}
              />
              <QuickContactCard
                icon={<FaPhone />}
                title="Call Us"
                content={["0717896541", "0717896541"]}
                highlight="Quick Response Time"
                color="green"
                delay={0.2}
              />
              <QuickContactCard
                icon={<FaEnvelope />}
                title="Email Us"
                content={["support@partnest.com", "info@partnest.com"]}
                highlight="Reply within 24 hours"
                color="purple"
                delay={0.3}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute left-0 bottom-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <FaPaperPlane className="w-12 h-12 mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
                    <p className="text-blue-100">
                      Fill out the form below and we'll get back to you as soon as possible
                    </p>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name Input */}
                      <FormField
                        label="Your Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name}
                        touched={touched.name}
                        icon={<FaUser />}
                        placeholder="John Doe"
                        characterCount={getCharacterCount('name')}
                      />

                      {/* Email Input */}
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        icon={<FaEnvelope />}
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Subject Input */}
                    <FormField
                      label="Subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.subject}
                      touched={touched.subject}
                      icon={<FaPaperPlane />}
                      placeholder="What's this about?"
                      characterCount={getCharacterCount('subject')}
                    />

                    {/* Message Input */}
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows="6"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 resize-none ${
                          errors.message && touched.message
                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
                        }`}
                        placeholder="Tell us what you need help with..."
                      />
                      <div className="flex justify-between items-center mt-2">
                        <AnimatePresence>
                          {errors.message && touched.message && (
                            <motion.span
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-sm flex items-center"
                            >
                              <FaExclamationCircle className="w-4 h-4 mr-1" />
                              {errors.message}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="text-gray-400 text-sm ml-auto">
                          {getCharacterCount('message')}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={status.submitting || Object.keys(validateForm()).length > 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full py-4 px-6 rounded-xl text-white font-semibold text-lg
                        flex items-center justify-center space-x-3
                        transition-all duration-300 shadow-lg
                        ${status.submitting || Object.keys(validateForm()).length > 0
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                        }
                      `}
                    >
                      {status.submitting ? (
                        <>
                          <FaSpinner className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>

                    {/* Status Messages */}
                    <AnimatePresence>
                      {status.info.error && status.info.msg && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start justify-between"
                        >
                          <div className="flex items-center">
                            <FaExclamationCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                            <span>{status.info.msg}</span>
                          </div>
                          <button
                            onClick={() => setStatus(prev => ({ ...prev, info: { error: false, msg: null } }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </motion.div>
                      )}
                      {status.submitted && status.info.msg && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start justify-between"
                        >
                          <div className="flex items-center">
                            <FaCheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold">Success!</p>
                              <p className="text-sm">{status.info.msg}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setStatus(prev => ({ ...prev, submitted: false }))}
                            className="text-green-500 hover:text-green-700"
                          >
                            <FaTimes />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </motion.div>

              {/* Info Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
              >
                {/* Office Location Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Our Office</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    123 Business Street<br />
                    Amman, Jordan 11183
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    Get Directions
                    <span className="ml-2">→</span>
                  </a>
                </div>

                {/* Response Time Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <FaClock className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Response Time</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Email</span>
                      <span className="text-gray-900 font-semibold text-sm">Within 24h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Phone</span>
                      <span className="text-gray-900 font-semibold text-sm">Immediate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Live Chat</span>
                      <span className="text-gray-900 font-semibold text-sm">Real-time</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

// Form Field Component
const FormField = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  icon, 
  placeholder,
  characterCount 
}) => (
  <div className="form-group">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 pl-11 ${
          error && touched
            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
            : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
        }`}
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, { 
          className: `h-5 w-5 ${error && touched ? 'text-red-400' : 'text-gray-400'}` 
        })}
      </div>
    </div>
    <div className="flex justify-between items-center mt-2">
      <AnimatePresence>
        {error && touched && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm flex items-center"
          >
            <FaExclamationCircle className="w-4 h-4 mr-1" />
            {error}
          </motion.span>
        )}
      </AnimatePresence>
      {characterCount && (
        <span className="text-gray-400 text-sm ml-auto">
          {characterCount}
        </span>
      )}
    </div>
  </div>
);

// Quick Contact Card Component
const QuickContactCard = ({ icon, title, content, highlight, color, delay }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const bgClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50'
  };

  const textClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
      
      <div className="relative z-10">
        <div className={`w-14 h-14 ${bgClasses[color]} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {React.cloneElement(icon, { className: `w-7 h-7 ${textClasses[color]}` })}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <div className="space-y-1 mb-3">
          {content.map((item, index) => (
            <p key={index} className="text-gray-600 text-sm leading-relaxed">{item}</p>
          ))}
        </div>
        <div className={`inline-flex items-center px-3 py-1 ${bgClasses[color]} ${textClasses[color]} rounded-full text-xs font-semibold`}>
          <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
          {highlight}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;