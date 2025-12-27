import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  User,
  Save,
  X,
  Upload,
  Camera,
  Briefcase,
  GraduationCap,
  Star,
  Plus,
  Trash2,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Target,
  Sparkles,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProfileEditPage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Loading and UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form data states
  const [formData, setFormData] = useState({
    // User fields
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    background: "",
    // Student fields
    university: "",
    major: "",
    year: null,
    gpa: null,
    age: null,
    about: "",
    cvLink: "",
    availability: true,
    expectedSalaryMin: null,
    expectedSalaryMax: null,
  });

  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Constants
  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "skills", label: "Skills", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "links", label: "Links", icon: LinkIcon },
  ];

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const linkTypes = [
    "Website",
    "LinkedIn",
    "GitHub",
    "Portfolio",
    "Twitter",
    "Instagram",
    "Behance",
    "Dribbble",
    "Other",
  ];
  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

  // Effects
  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // API Functions
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        "http://localhost:8080/api/Profiles/studentProfile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;

        // Set form data
        setFormData({
          // User fields
          fullName: data.user?.fullName || "",
          email: data.user?.email || "",
          phoneNumber: data.user?.phoneNumber || "",
          location: data.user?.location || "",
          background: data.user?.background || "",
          // Student fields
          university: data.student?.university || "",
          major: data.student?.major || "",
          year: data.student?.year || null,
          gpa: data.student?.gpa || null,
          age: data.student?.age || null,
          about: data.student?.about || "",
          cvLink: data.student?.cvLink || "",
          availability: data.student?.availability !== false,
          preferredLocations: Array.isArray(data.student?.preferredLocations)
            ? data.student.preferredLocations
            : [],
          expectedSalaryMin: data.student?.expectedSalaryMin || null,
          expectedSalaryMax: data.student?.expectedSalaryMax || null,
        });

        // Set other data
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        // Normalize experience dates to 'yyyy-MM-dd' for HTML date inputs and use null for no endDate
        setExperiences(
          Array.isArray(data.experiences)
            ? data.experiences.map((exp) => ({
                ...exp,
                startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
                endDate: exp.endDate ? exp.endDate.split("T")[0] : null,
              }))
            : []
        );
        setLinks(Array.isArray(data.links) ? data.links : []);
        setImagePreview(data.user?.image || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getToken();
      let response;

      // Prepare the data to send
      const dataToSend = {
        // User fields
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        background: formData.background,
        // Student fields
        university: formData.university,
        major: formData.major,
        year: formData.year,
        gpa: formData.gpa,
        age: formData.age,
        about: formData.about,
        cvLink: formData.cvLink,
        availability: formData.availability,
        preferredLocations: Array.isArray(formData.preferredLocations)
          ? formData.preferredLocations
          : [],
        expectedSalaryMin: formData.expectedSalaryMin,
        expectedSalaryMax: formData.expectedSalaryMax,
        // Related data
        skills: skills.filter((skill) => skill.name && skill.name.trim()),
        experiences: experiences.filter((exp) => exp.title && exp.title.trim()),
        links: links.filter((link) => link.url && link.url.trim()),
      };

      if (selectedImage) {
        const formDataToSend = new FormData();
        formDataToSend.append("image", selectedImage);

        // Add each field individually
        formDataToSend.append("fullName", dataToSend.fullName || "");
        formDataToSend.append("phoneNumber", dataToSend.phoneNumber || "");
        formDataToSend.append("location", dataToSend.location || "");
        formDataToSend.append("background", dataToSend.background || "");
        formDataToSend.append("university", dataToSend.university || "");
        formDataToSend.append("major", dataToSend.major || "");
        formDataToSend.append("about", dataToSend.about || "");
        formDataToSend.append("cvLink", dataToSend.cvLink || "");
        formDataToSend.append("availability", dataToSend.availability);

        // Add numeric values only if they exist
        if (dataToSend.year !== null)
          formDataToSend.append("year", dataToSend.year);
        if (dataToSend.gpa !== null)
          formDataToSend.append("gpa", dataToSend.gpa);
        if (dataToSend.age !== null)
          formDataToSend.append("age", dataToSend.age);
        if (dataToSend.expectedSalaryMin !== null)
          formDataToSend.append(
            "expectedSalaryMin",
            dataToSend.expectedSalaryMin
          );
        if (dataToSend.expectedSalaryMax !== null)
          formDataToSend.append(
            "expectedSalaryMax",
            dataToSend.expectedSalaryMax
          );

        formDataToSend.append(
          "preferredLocations",
          JSON.stringify(dataToSend.preferredLocations)
        );
        formDataToSend.append("skills", JSON.stringify(dataToSend.skills));
        formDataToSend.append(
          "experiences",
          JSON.stringify(dataToSend.experiences)
        );
        formDataToSend.append("links", JSON.stringify(dataToSend.links));

        response = await axios.post(
          "http://localhost:8080/api/Profiles/studentProfile/edit",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Use JSON when no image
        response = await axios.post(
          "http://localhost:8080/api/Profiles/studentProfile/edit",
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => {
          navigate("/student/dashboard/profile");
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

//   const handleJobTypeChange = (jobType) => {
//     setFormData((prev) => {
//       const currentTypes = Array.isArray(prev.preferredJobTypes)
//         ? prev.preferredJobTypes
//         : [];
      
//       if (currentTypes.includes(jobType)) {
//         return {
//           ...prev,
//           preferredJobTypes: currentTypes.filter((type) => type !== jobType)
//         };
//       } else {
//         return {
//           ...prev,
//           preferredJobTypes: [...currentTypes, jobType]
//         };
//       }
//     });
//   };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }

      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Skills Management
  const addSkill = () => {
    setSkills([...skills, { name: "", level: "", yearsOfExp: null }]);
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = skills.map((skill, i) =>
      i === index ? { ...skill, [field]: value } : skill
    );
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Experience Management
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        companyName: "",
        description: "",
        location: "",
        employmentType: "",
        startDate: "",
        endDate: null,
        isCurrent: false,
      },
    ]);
  };

  const updateExperience = (index, field, value) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Links Management
  const addLink = () => {
    setLinks([...links, { type: "Website", url: "", label: "" }]);
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Utility functions
  const getCompletionPercentage = () => {
    const requiredFields = [
      formData.fullName,
      formData.phoneNumber,
      formData.location,
      formData.university,
      formData.major,
      formData.about,
      skills.length > 0,
      experiences.length > 0,
    ];

    const filledFields = requiredFields.filter((field) => field).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Profile Picture
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-200">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  >
                    <Upload className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="100"
                    value={formData.age || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "age",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      handleInputChange(
                        "availability",
                        e.target.value === "true"
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value={true}>Available for work</option>
                    <option value={false}>Not available</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About Me
                </label>
                <textarea
                  rows={5}
                  value={formData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  placeholder="Tell employers about yourself, your interests, and career goals..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) =>
                      handleInputChange("university", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your university"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Major <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your major"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year of Study
                  </label>
                  <select
                    value={formData.year || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "year",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="6">Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "gpa",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your GPA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CV/Resume Link
                  </label>
                  <input
                    type="url"
                    value={formData.cvLink}
                    onChange={(e) =>
                      handleInputChange("cvLink", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Star className="w-6 h-6 text-blue-600" />
                Skills & Expertise
              </h3>
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {skills.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  No skills added yet
                </h4>
                <p className="text-gray-500 mb-6">
                  Add your technical and soft skills to showcase your expertise
                </p>
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Add Your First Skill
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">
                        Skill #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Skill Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(index, "name", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g. JavaScript, React"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Proficiency Level
                        </label>
                        <select
                          value={skill.level}
                          onChange={(e) =>
                            updateSkill(index, "level", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select level</option>
                          {skillLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={skill.yearsOfExp || ""}
                          onChange={(e) =>
                            updateSkill(
                              index,
                              "yearsOfExp",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Years"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "experience":
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  No work experience added yet
                </h4>
                <p className="text-gray-500 mb-6">
                  Add your internships, part-time jobs, and volunteer work
                </p>
                <button
                  type="button"
                  onClick={addExperience}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Add Your First Experience
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {experiences.map((experience, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">
                        Experience #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={experience.title}
                            onChange={(e) =>
                              updateExperience(index, "title", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g. Frontend Developer"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={experience.companyName}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "companyName",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g. Google"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={experience.location}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "location",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g. New York, NY"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Employment Type
                          </label>
                          <select
                            value={experience.employmentType}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "employmentType",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select type</option>
                            {employmentTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={experience.startDate || ""}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={experience.endDate || ""}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "endDate",
                                e.target.value ? e.target.value : null
                              )
                            }
                            disabled={experience.isCurrent}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={experience.endDate === null}
                            onChange={(e) => {
                              updateExperience(
                                index,
                                "isCurrent",
                                e.target.checked
                              );
                              if (e.target.checked) {
                                updateExperience(index, "endDate", null);
                              }
                            }}
                            className="form-checkbox accent-blue-600 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            I currently work here
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          value={experience.description}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "links":
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <LinkIcon className="w-6 h-6 text-blue-600" />
                Professional Links
              </h3>
              <button
                type="button"
                onClick={addLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            {links.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <LinkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  No professional links added yet
                </h4>
                <p className="text-gray-500 mb-6">
                  Add your portfolio, LinkedIn, GitHub, and other professional
                  profiles
                </p>
                <button
                  type="button"
                  onClick={addLink}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Add Your First Link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">
                        Link #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Platform
                        </label>
                        <select
                          value={link.type}
                          onChange={(e) =>
                            updateLink(index, "type", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          {linkTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) =>
                            updateLink(index, "url", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Display Label
                        </label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            updateLink(index, "label", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Optional custom label"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              <div className="text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Edit Profile
                </h1>
                <p className="text-blue-100 mb-3">
                  Update your information to attract better opportunities
                </p>

                <div className="bg-white/20 rounded-full h-3 w-64 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-100">
                  Profile {getCompletionPercentage()}% complete
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <RouterLink
                to="/student/dashboard/profile"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Profile
              </RouterLink>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-lg animate-fade-in ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <tab.icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <form onSubmit={handleSubmit}>{renderTabContent()}</form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Completion Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-center font-semibold text-gray-900">
                  {getCompletionPercentage()}% Complete
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {formData.fullName &&
                    formData.university &&
                    formData.major ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span
                      className={
                        formData.fullName &&
                        formData.university &&
                        formData.major
                          ? "text-gray-900"
                          : "text-gray-500"
                      }
                    >
                      Basic Information
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {skills.length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span
                      className={
                        skills.length > 0 ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      Skills ({skills.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {experiences.length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span
                      className={
                        experiences.length > 0
                          ? "text-gray-900"
                          : "text-gray-500"
                      }
                    >
                      Experience ({experiences.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.about ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span
                      className={
                        formData.about ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      About Section
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Profile Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Complete all sections for maximum visibility</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Add a professional profile photo</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include relevant skills with proficiency levels</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Add work experience with detailed descriptions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your availability status updated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileEditPage;
