// ContactUs.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FaPhone, 
  FaEnvelope, 
  FaCheckCircle, 
  FaPaperPlane,
  FaClock,
  FaExclamationCircle, 
  FaUser
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

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    try {
      const response = await axios.post('/api/contact', formData);
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: response.data.message },
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error.response.data.message },
      });
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you have a question about our platform, features, or anything else, 
              our team is ready to answer all your questions.
            </p>
          </motion.div>

          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <QuickContactCard
              icon={<FaClock />}
              title="Working Hours"
              content={["Monday - Friday: 9AM - 5PM", "Weekend: 10AM - 3PM"]}
              highlight="Available 24/7 Online"
            />
            <QuickContactCard
              icon={<FaPhone />}
              title="Call Us"
              content={["0717896541", "0717896541"]}
              highlight="Quick Response Time"
            />
            <QuickContactCard
              icon={<FaEnvelope />}
              title="Email Us"
              content={["support@partnest.com", "info@partnest.com"]}
              highlight="Reply within 24 hours"
            />
          </div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
              <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
              <p className="text-blue-100 text-sm">
                Fill out the form below and we'll get back to you shortly
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-10"
                      placeholder="sara omar"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-10"
                      placeholder="sara@example.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Input */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message Input */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us what you need help with..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.submitting}
                className={`
                  w-full py-3 px-6 rounded-lg text-white font-medium
                  flex items-center justify-center space-x-2
                  transform hover:-translate-y-0.5 transition-all duration-200
                  ${status.submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }
                `}
              >
                <FaPaperPlane className={`w-4 h-4 ${status.submitting ? 'animate-pulse' : ''}`} />
                <span>{status.submitting ? 'Sending...' : 'Send Message'}</span>
              </button>

              {/* Status Messages */}
              {status.info.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center"
                >
                  <FaExclamationCircle className="w-5 h-5 mr-3" />
                  <span>{status.info.msg}</span>
                </motion.div>
              )}
              {status.submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center"
                >
                  <FaCheckCircle className="w-5 h-5 mr-3" />
                  <span>Your message has been sent successfully!</span>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

// Helper Component
const QuickContactCard = ({ icon, title, content, highlight }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
  >
    <div className="text-blue-600 mb-4">
      {React.cloneElement(icon, { className: "w-8 h-8" })}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    {content.map((item, index) => (
      <p key={index} className="text-gray-600 text-sm">{item}</p>
    ))}
    <p className="text-blue-600 text-sm font-medium mt-2">{highlight}</p>
  </motion.div>
);

export default ContactUs;