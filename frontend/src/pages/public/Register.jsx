// src/pages/public/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "student",
    university: "",
    graduationYear: "",
    acceptTerms: false,
  });

  // UI States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationStates, setValidationStates] = useState({
    password: {
      hasLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });

  // Password Strength Checker
  useEffect(() => {
    const { password } = formData;
    const checks = {
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setValidationStates({ ...validationStates, password: checks });

    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength((strength / 5) * 100);
  }, [formData.password]);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  // Validation Functions
  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phoneNumber.match(/^07[7-9]\d{7}$/)) {
      setError(
        "Please enter a valid Jordanian phone number (e.g., 0791234567)"
      );
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (passwordStrength < 60) {
      setError("Please create a stronger password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.university.trim()) {
      setError("Please enter your university");
      return false;
    }
    if (!formData.graduationYear) {
      setError("Please enter your graduation year");
      return false;
    }
    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const validateAllSteps = () => {
    if (!validateStep1()) {
      setStep(1);
      return false;
    }
    if (!validateStep2()) {
      setStep(2);
      return false;
    }
    if (!validateStep3()) {
      setStep(3);
      return false;
    }
    return true;
  };

  // Navigation Handlers
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  // API Helpers
  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return data.message || "Invalid data provided";
        case 401:
          return "Unauthorized access";
        case 409:
          return "Email already exists";
        case 422:
          return "Validation failed";
        case 500:
          return "Server error. Please try again later";
        default:
          return "An error occurred. Please try again";
      }
    }
    return "Network error. Please check your connection";
  };

  const prepareFormData = () => {
    return {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phoneNumber: formData.phoneNumber.replace(/\s+/g, ""),
      role: "student",
      university: formData.university.trim(),
      graduationYear: parseInt(formData.graduationYear),
      registrationDate: new Date().toISOString(),
    };
  };
  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step !== 3) return;
    if (!validateAllSteps()) return;

    setLoading(true);
    setError("");

    try {
      // Check if email already exists
      const checkEmail = await axios.get(
        `http://localhost:3001/users?email=${formData.email}`
      );

      if (checkEmail.data.length > 0) {
        setError("Email already exists");
        setLoading(false);
        return;
      }

      const userData = {
        ...prepareFormData(),
        id: Date.now(),
        role: formData.userType,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:3001/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const token = btoa(response.data.email + ":" + Date.now());

        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

        const userToStore = {
          id: response.data.id,
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          role: "student",
        };

        localStorage.setItem("user", JSON.stringify(userToStore));
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px] animate-pulse"
          style={{ animation: "float 20s infinite" }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse"
          style={{ animation: "float 15s infinite" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse"
          style={{ animation: "float 18s infinite" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Welcome to <span className="text-blue-600">PartNest</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your gateway to IT opportunities
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-xs font-semibold text-blue-600">
                Step {step} of 3
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-blue-600">
                  {Math.round((step / 3) * 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${(step / 3) * 100}%` }}
                className="transition-all duration-500 ease-in-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              />
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ali"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Yousef"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email123@example.com"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="07********"
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: "student" }))
                        }
                        className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                          formData.role === "student"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: "employer" }))
                        }
                        className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                          formData.role === "employer"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        Employer
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2: Security */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {passwordVisible ? "Hide" : "Show"}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          Password Strength
                        </span>
                        <span className="text-xs text-gray-600">
                          {passwordStrength}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength < 40
                              ? "bg-red-500"
                              : passwordStrength < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Object.entries(validationStates.password).map(
                        ([key, valid]) => (
                          <div
                            key={key}
                            className={`text-xs flex items-center ${
                              valid ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            <svg
                              className={`h-4 w-4 mr-1 ${
                                valid ? "text-green-500" : "text-gray-400"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Additional Information */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* University Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      University
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your university"
                    />
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Graduation Year
                    </label>
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Year</option>
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() + i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">
                        I accept the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                      <p className="text-gray-500">
                        By creating an account, you agree to our privacy policy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg animate-shake">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between space-x-4 pt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium text-white ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/SignIn"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
