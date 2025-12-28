import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Star,
  Briefcase,
  Link as LinkIcon,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  MessageSquare,
  ExternalLink,
  User,
  Building,
  DollarSign,
  FileText,
  Send,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const CandidateDetailsView = ({ candidate, onUpdateStatus, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState(
    candidate?.status || "PENDING"
  );
  const { getToken } = useAuth();
  const [notes, setNotes] = useState(candidate?.feedback || "");
  const [interviewDate, setInterviewDate] = useState(
    candidate?.interviewDate
      ? new Date(candidate.interviewDate).toISOString().slice(0, 16)
      : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  const handleStatusUpdate = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });
    try {
      const updateData = {
        status: selectedStatus,
        feedback: notes,
      };

      if (selectedStatus === "INTERVIEW_SCHEDULED") {
        if (!interviewDate) {
          setSaveMessage({
            type: "error",
            text: "Please select an interview date and time",
          });
          setIsSaving(false);
          return;
        }
        updateData.interviewDate = new Date(interviewDate).toISOString();
      }

      await onUpdateStatus(candidate.id, updateData);
      setSaveMessage({
        type: "success",
        text: "Status and notes updated successfully!",
      });
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to update. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const markAsViewed = async () => {
      if (!candidate?.id) return;

      const token = getToken();

      if (!token) {
        console.log("No authentication token found. Please log in again.");
        return;
      }

      try {
        await axios.put(
          `http://localhost:8080/api/candidate/applications/${candidate.id}/view`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Application marked as viewed");
      } catch (error) {
        console.error("Error marking application as viewed:", error);
      }
    };

    markAsViewed();
  }, [candidate?.id, getToken]);

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: Clock,
        label: "Pending Review",
      },
      INTERVIEW_SCHEDULED: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
        icon: Calendar,
        label: "Interview Scheduled",
      },
      ACCEPTED: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
        label: "Accepted",
      },
      REJECTED: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: AlertCircle,
        label: "Rejected",
      },
      WITHDRAWN: {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: AlertCircle,
        label: "Withdrawn",
      },
    };
    return (
      configs[status] || {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        icon: Clock,
        label: status,
      }
    );
  };

  if (!candidate) return null;

  const { student, job } = candidate;
  const statusConfig = getStatusConfig(candidate.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Toast Notification */}
      {saveMessage.text && (
        <div
          className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out ${
            saveMessage.text
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border backdrop-blur-sm ${
              saveMessage.type === "success"
                ? "bg-emerald-50/90 text-emerald-800 border-emerald-200"
                : "bg-rose-50/90 text-rose-800 border-rose-200"
            }`}
          >
            {saveMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500" />
            )}
            <span className="font-medium">{saveMessage.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <button
              onClick={onClose}
              className="mt-1 p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-x-0.5 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                      {student?.user?.fullName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {student?.user?.fullName}
                      </h1>
                      <p className="text-slate-500 flex items-center gap-2 mt-0.5">
                        <Briefcase className="w-4 h-4" />
                        Application for{" "}
                        <span className="font-medium text-slate-700">
                          {job?.title}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Contact Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {student?.user?.email}
                      </p>
                    </div>
                  </div>

                  {student?.user?.phoneNumber && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {student.user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {student?.user?.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {student?.age && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Age
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {student.age} years old
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  Education
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-900">
                      {student?.university}
                    </h4>
                    <p className="text-slate-600 mt-0.5">{student?.major}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {student?.year && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          Year {student.year}
                        </span>
                      )}
                      {student?.gpa && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          GPA: {student.gpa}/4.0
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {student?.about && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-500" />
                    About
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed">
                    {student.about}
                  </p>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {student?.user?.skills && student.user.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Skills
                    <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {student.user.skills.length}
                    </span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {student.user.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {skill.name}
                          </p>
                          {skill.level && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {skill.level}
                            </p>
                          )}
                        </div>
                        {skill.yearsOfExp && (
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                            {skill.yearsOfExp}y exp
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {student?.user?.experiences &&
              student.user.experiences.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-500" />
                      Experience
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                        {student.user.experiences.length}
                      </span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {student.user.experiences.map((exp, index) => (
                        <div
                          key={index}
                          className="relative pl-8 pb-6 last:pb-0 border-l-2 border-slate-200 last:border-transparent"
                        >
                          <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-white border-2 border-emerald-500" />
                          <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all duration-200">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {exp.title}
                                </h4>
                                {exp.companyName && (
                                  <p className="text-slate-600 flex items-center gap-1.5 mt-1">
                                    <Building className="w-4 h-4" />
                                    {exp.companyName}
                                  </p>
                                )}
                              </div>
                              {exp.isCurrent && (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                                  Current
                                </span>
                              )}
                            </div>
                            {exp.location && (
                              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                                <MapPin className="w-3.5 h-3.5" />
                                {exp.location}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(exp.startDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" }
                                )}
                                {" — "}
                                {exp.isCurrent
                                  ? "Present"
                                  : exp.endDate
                                  ? new Date(exp.endDate).toLocaleDateString(
                                      "en-US",
                                      { month: "short", year: "numeric" }
                                    )
                                  : "Present"}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Links Section */}
            {student?.user?.links && student.user.links.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-blue-500" />
                    Links & Profiles
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {student.user.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                          <LinkIcon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {link.label || link.type}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {link.url}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Cover Letter Section */}
            {candidate.coverLetter && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-500" />
                    Cover Letter
                  </h3>
                </div>
                <div className="p-6">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {candidate.coverLetter}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Status */}
          <div className="space-y-6">
            {/* Status Update Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden top-6">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-slate-900">
                  Application Status
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-slate-700"
                    disabled={isSaving}
                  >
                    <option value="PENDING">⏳ Pending</option>
                    <option value="INTERVIEW_SCHEDULED">
                      📅 Interview Scheduled
                    </option>
                    <option value="ACCEPTED">✅ Accepted</option>
                    <option value="REJECTED">❌ Rejected</option>
                    <option value="WITHDRAWN">🚫 Withdrawn</option>
                  </select>
                </div>

                {selectedStatus === "INTERVIEW_SCHEDULED" && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Interview Date & Time{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="datetime-local"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={isSaving}
                        required
                      />
                    </div>
                  </div>
                )}

                {candidate.interviewDate && (
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-violet-600" />
                      <span className="font-semibold text-violet-900">
                        Scheduled Interview
                      </span>
                    </div>
                    <p className="text-sm text-violet-800 mt-1 font-medium">
                      {new Date(candidate.interviewDate).toLocaleString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleStatusUpdate}
                  disabled={isSaving}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Update Status
                    </>
                  )}
                </button>

                {/* Timeline */}
                <div className="pt-5 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Application Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">Applied</span>
                      <span className="text-sm font-medium text-slate-900">
                        {new Date(candidate.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {candidate.viewedAt && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-slate-600 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          Viewed
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(candidate.viewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {candidate.respondedAt && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <span className="text-sm text-slate-600 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Responded
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(candidate.respondedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {student?.cvLink && (
                  <a
                    href={student.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:border-slate-300 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </a>
                )}

                {candidate.customCvLink && (
                  <a
                    href={candidate.customCvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:border-slate-300 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Download className="w-4 h-4" />
                    Download Custom CV
                  </a>
                )}

                <a
                  href={`mailto:${student?.user?.email}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 font-medium rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>

                {student?.user?.phoneNumber && (
                  <a
                    href={`tel:${student.user.phoneNumber}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 font-medium rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Phone className="w-4 h-4" />
                    Call Candidate
                  </a>
                )}
              </div>
            </div> */}

            {/* Notes Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  Feedback & Notes
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add feedback or notes about this candidate..."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder:text-slate-400"
                  disabled={isSaving}
                />
                <p className="text-xs text-slate-500 text-center">
                  Notes are saved when you update the status
                </p>
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-slate-500" />
                  Job Details
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Position
                  </p>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {job?.title}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Type
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {job?.jobType?.replace("_", " ")}
                    </p>
                  </div>

                  {job?.location && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {job.location}
                      </p>
                    </div>
                  )}
                </div>

                {job?.salaryMin && job?.salaryMax && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Salary Range
                    </p>
                    <p className="text-base font-semibold text-emerald-700 mt-1">
                      {job.salaryCurrency || "$"}
                      {job.salaryMin.toLocaleString()} -{" "}
                      {job.salaryCurrency || "$"}
                      {job.salaryMax.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CandidateDetailsView;