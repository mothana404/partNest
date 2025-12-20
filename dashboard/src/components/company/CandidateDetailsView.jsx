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
  MessageCircle,
  Save,
  CheckCircle,
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
  const [saveMessage, setSaveMessage] = useState("");

  const handleStatusUpdate = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const updateData = {
        status: selectedStatus,
        feedback: notes,
      };

      if (selectedStatus === "INTERVIEW_SCHEDULED") {
        if (!interviewDate) {
          setSaveMessage("Please select an interview date and time");
          setIsSaving(false);
          return;
        }
        updateData.interviewDate = new Date(interviewDate).toISOString();
      }

      await onUpdateStatus(candidate.id, updateData);
      setSaveMessage("Status and notes updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to update. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotesUpdate = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      await onUpdateStatus(candidate.id, {
        status: candidate.status,
        feedback: notes,
      });
      setSaveMessage("Notes saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save notes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!candidate) return null;

  const { student, job } = candidate;

  return (
    <div className="space-y-6">
      {saveMessage && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-2 ${
            saveMessage.includes("success")
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {saveMessage.includes("success") && (
            <CheckCircle className="w-5 h-5" />
          )}
          {saveMessage}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {student?.user?.fullName}
          </h1>
          <p className="text-gray-600 mt-1">Application for: {job?.title}</p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg border ${getStatusColor(
            candidate.status
          )}`}
        >
          {candidate.status.replace("_", " ")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">
                    {student?.user?.email}
                  </p>
                </div>
              </div>

              {student?.user?.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">
                      {student.user.phoneNumber}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">
                    {student?.user?.location || "Not specified"}
                  </p>
                </div>
              </div>

              {student?.age && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Age</p>
                    <p className="text-sm text-gray-600">
                      {student.age} years old
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Education
            </h3>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">
                  {student?.university}
                </p>
                <p className="text-sm text-gray-600">{student?.major}</p>
                <div className="flex items-center gap-4 mt-2">
                  {student?.year && (
                    <span className="text-sm text-gray-500">
                      Year {student.year}
                    </span>
                  )}
                  {student?.gpa && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        GPA: {student.gpa}/4.0
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {student?.about && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">{student.about}</p>
            </div>
          )}

          {student?.user?.skills && student.user.skills.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.user.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      {skill.level && (
                        <p className="text-sm text-gray-500">{skill.level}</p>
                      )}
                    </div>
                    {skill.yearsOfExp && (
                      <span className="text-sm text-gray-600">
                        {skill.yearsOfExp} years
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {student?.user?.experiences &&
            student.user.experiences.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Experience
                </h3>
                <div className="space-y-4">
                  {student.user.experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {exp.title}
                        </h4>
                        {exp.companyName && (
                          <p className="text-sm text-gray-600">
                            {exp.companyName}
                          </p>
                        )}
                        {exp.location && (
                          <p className="text-sm text-gray-500">
                            {exp.location}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(exp.startDate).toLocaleDateString()} -
                            {exp.isCurrent
                              ? " Present"
                              : exp.endDate
                              ? ` ${new Date(
                                  exp.endDate
                                ).toLocaleDateString()}`
                              : " Present"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-700 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {student?.user?.links && student.user.links.length > 0 && (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Links
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {student.user.links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LinkIcon className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {link.label || link.type}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {link.url}
            </p>
          </div>
        </a>
      ))}
    </div>
  </div>
)}

          {candidate.coverLetter && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cover Letter
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {candidate.coverLetter}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Application Status
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="PENDING">Pending</option>
                  <option value="INTERVIEW_SCHEDULED">
                    Interview Scheduled
                  </option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              {selectedStatus === "INTERVIEW_SCHEDULED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date & Time *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSaving}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select date and time for the interview
                  </p>
                </div>
              )}

              {candidate.interviewDate && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">
                      Scheduled Interview:
                    </span>
                  </div>
                  <p className="text-sm text-purple-800 mt-1">
                    {new Date(candidate.interviewDate).toLocaleString()}
                  </p>
                </div>
              )}

              <button
                onClick={handleStatusUpdate}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Update Status & Notes"
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">
                Application Timeline
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied:</span>
                  <span className="text-gray-900">
                    {new Date(candidate.appliedAt).toLocaleDateString()}
                  </span>
                </div>
                {candidate.viewedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Viewed:</span>
                    <span className="text-gray-900">
                      {new Date(candidate.viewedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {candidate.respondedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responded:</span>
                    <span className="text-gray-900">
                      {new Date(candidate.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>

            <div className="space-y-3">
              {student?.cvLink && (
                <a
                  href={student.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Custom CV
                </a>
              )}

              <a
                href={`mailto:${student?.user?.email}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>

              {student?.user?.phoneNumber && (
                <a
                  href={`tel:${student.user.phoneNumber}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Feedback & Notes
            </h3>

            <div className="space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add feedback or notes about this candidate..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSaving}
              />

              <button
                onClick={handleNotesUpdate}
                disabled={isSaving || notes === candidate.feedback}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Notes Only
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Notes are saved to the feedback field and can be viewed later
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Position</p>
                <p className="text-sm text-gray-900">{job?.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="text-sm text-gray-900">
                  {job?.jobType?.replace("_", " ")}
                </p>
              </div>

              {job?.location && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-900">{job.location}</p>
                </div>
              )}

              {job?.salaryMin && job?.salaryMax && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Salary Range
                  </p>
                  <p className="text-sm text-gray-900">
                    {job.salaryCurrency || "$"}
                    {job.salaryMin} - {job.salaryCurrency || "$"}
                    {job.salaryMax}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsView;