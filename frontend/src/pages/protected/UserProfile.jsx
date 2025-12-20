// StudentProfile.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCode,
  FaEdit,
  FaDownload,
  FaMedal,
  FaLaptopCode,
  FaBriefcase,
} from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';

const StudentProfile = () => {
  
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);
  
    const studentData = {
    personal: {
      name: "Yousef Altarawneh",
      major: "CIS",
      year: "Junior Year",
      university: "Hashemite University",
      email: "sotwareemail123@stanford.edu",
      phone: "0761591596",
      location: "Zarqa, Jordan",
      about: "Passionate CS student with a focus on web development and AI. Currently seeking internship opportunities to apply and expand my technical skills in a real-world setting.",
      social: {
        linkedin: "linkedin.com/in/alexj",
        github: "github.com/alexj"
      }
    },
    education: {
      gpa: "3.8/4.0",
      expectedGraduation: "May 2025",
      relevantCourses: [
        "Data Structures & Algorithms",
        "Web Development",
        "Machine Learning",
        "Database Systems",
        "Software Engineering",
        "Computer Networks"
      ]
    },
    skills: {
      programming: [
        "Python",
        "JavaScript",
        "React.js",
        "HTML/CSS",
        "Java",
        "SQL"
      ],
      tools: [
        "Git",
        "VS Code",
        "Figma",
        "MongoDB",
        "Docker"
      ],
      soft: [
        "Team Collaboration",
        "Problem Solving",
        "Time Management",
        "Public Speaking",
        "Project Management"
      ]
    },
    projects: [
      {
        name: "Student Marketplace App",
        type: "Academic Project",
        duration: "Fall 2023",
        description: "A web platform for students to buy and sell textbooks and supplies",
        technologies: ["React", "Node.js", "MongoDB"],
        highlights: [
          "Implemented real-time chat feature",
          "Handled user authentication",
          "Built responsive UI"
        ]
      },
      {
        name: "AI Study Assistant",
        type: "Personal Project",
        duration: "Summer 2023",
        description: "AI-powered study assistant that helps create study schedules and quizzes",
        technologies: ["Python", "TensorFlow", "Flask"],
        highlights: [
          "Integrated OpenAI API",
          "Created custom scheduling algorithm",
          "Built REST API"
        ]
      }
    ],
    experience: [
      {
        role: "Web Development Teaching Assistant",
        organization: "Computer Science Department",
        duration: "Jan 2023 - Present",
        description: "Assist professor in teaching web development course to 100+ students",
        achievements: [
          "Created tutorial content",
          "Conducted code reviews",
          "Mentored 20+ students"
        ]
      },
      {
        role: "Tech Club Vice President",
        organization: "Stanford Tech Association",
        duration: "Sep 2022 - Present",
        description: "Lead technical workshops and organize hackathons",
        achievements: [
          "Organized 2 successful hackathons",
          "Grew club membership by 40%",
          "Led weekly coding workshops"
        ]
      }
    ],
    awards: [
      {
        name: "Dean's List",
        year: "2022-2023",
        issuer: "Stanford University"
      },
      {
        name: "Hackathon Winner",
        year: "2023",
        issuer: "Stanford Tech Week"
      }
    ]
  };

  return (
    <>
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-rose-500 h-40">
        <div className="max-w-6xl mx-auto px-2 relative h-full">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-24 left-4 right-4 bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow">
                <FaUser className="w-16 h-16 text-indigo-400" />
              </div>

              {/* Basic Info */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {studentData.personal.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <FaGraduationCap className="text-purple-500" />
                  <span className="text-gray-600">
                    {studentData.personal.major} • {studentData.personal.year}
                  </span>
                </div>
                <p className="text-gray-500 mb-4">{studentData.personal.university}</p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <ContactLink icon={FaEnvelope} text={studentData.personal.email} />
                  <ContactLink icon={FaPhone} text={studentData.personal.phone} />
                  <ContactLink icon={FaMapMarkerAlt} text={studentData.personal.location} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2">
                  <FaEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2">
                  <FaDownload className="w-4 h-4" />
                  <span>CV</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* About Me */}
            <InfoCard
              title="About Me"
              icon={FaUser}
              content={studentData.personal.about}
            />

            {/* Education */}
            <InfoCard
              title="Education"
              icon={FaGraduationCap}
              content={
                <div className="space-y-2">
                  <p className="font-medium">GPA: {studentData.education.gpa}</p>
                  <p>Expected Graduation: {studentData.education.expectedGraduation}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Relevant Coursework:</h4>
                    <div className="flex flex-wrap gap-2">
                      {studentData.education.relevantCourses.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />

            {/* Skills */}
            <InfoCard
              title="Technical Skills"
              icon={FaCode}
              content={
                <div className="space-y-4">
                  <SkillSection
                    title="Programming"
                    skills={studentData.skills.programming}
                  />
                  <SkillSection
                    title="Tools & Technologies"
                    skills={studentData.skills.tools}
                  />
                  <SkillSection
                    title="Soft Skills"
                    skills={studentData.skills.soft}
                  />
                </div>
              }
            />
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Projects */}
            <Section title="Projects" icon={FaLaptopCode}>
              {studentData.projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </Section>

            {/* Experience */}
            <Section title="Experience" icon={FaBriefcase}>
              {studentData.experience.map((exp, index) => (
                <ExperienceCard key={index} {...exp} />
              ))}
            </Section>

            {/* Awards */}
            <Section title="Awards & Achievements" icon={FaMedal}>
              <div className="grid md:grid-cols-2 gap-4">
                {studentData.awards.map((award, index) => (
                  <AwardCard key={index} {...award} />
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
    </>
  );
};

// Helper Components
const ContactLink = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
);

const InfoCard = ({ title, icon: Icon, content }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-indigo-500" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {typeof content === 'string' ? (
      <p className="text-gray-600">{content}</p>
    ) : (
      content
    )}
  </div>
);

const SkillSection = ({ title, skills }) => (
  <div>
    <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-2 mb-6">
      <Icon className="w-5 h-5 text-indigo-500" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const ProjectCard = ({ name, type, duration, description, technologies, highlights }) => (
  <div className="border-l-2 border-purple-500 pl-4 mb-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <span className="text-sm text-gray-500">{duration}</span>
    </div>
    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 rounded text-sm mb-2">
      {type}
    </span>
    <p className="text-gray-600 mb-3">{description}</p>
    <div className="flex flex-wrap gap-2 mb-3">
      {technologies.map((tech, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
        >
          {tech}
        </span>
      ))}
    </div>
    <ul className="space-y-1">
      {highlights.map((highlight, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5" />
          {highlight}
        </li>
      ))}
    </ul>
  </div>
);

const ExperienceCard = ({ role, organization, duration, description, achievements }) => (
  <div className="border-l-2 border-indigo-500 pl-4 mb-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-900">{role}</h3>
      <span className="text-sm text-gray-500">{duration}</span>
    </div>
    <p className="text-gray-600 font-medium mb-2">{organization}</p>
    <p className="text-gray-600 mb-3">{description}</p>
    <ul className="space-y-1">
      {achievements.map((achievement, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
          {achievement}
        </li>
      ))}
    </ul>
  </div>
);

const AwardCard = ({ name, year, issuer }) => (
  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <FaMedal className="w-5 h-5 text-yellow-500" />
      <h3 className="font-medium text-gray-900">{name}</h3>
    </div>
    <p className="text-sm text-gray-600">{issuer}</p>
    <p className="text-sm text-gray-500">{year}</p>
  </div>
);

export default StudentProfile;