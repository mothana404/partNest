import { useState, useEffect } from "react";
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Send,
  CheckCircle,
  Award,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

const JobDetailsModal = ({
  job,
  isSaved,
  application,
  applications,
  onClose,
  onSave,
  onApply,
}) => {
  const hasApplied = !!application;
  const [studentApplication, setStudentApplication] = useState(null);
  const { getToken } = useAuth();
  const token = getToken();

  useEffect(() => {  
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/job/getJob/${job.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        // Handle the response data as needed
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobDetails();
    if (application) {
      setStudentApplication(application);
    } else if (applications && applications.length > 0) {
      // If applications array is provided, find the one for this job
      const app = applications.find((app) => app.jobId === job.id);
      if (app) {
        setStudentApplication(app);
      }
    }
  }, [application, applications, job.id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const interviewInfo = studentApplication?.interviewDate
    ? formatDateTime(studentApplication.interviewDate)
    : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                {job.company?.user?.image ? (
                  <img
                    src={job.company.user.image}
                    alt={job.company?.companyName || "Company"}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
                <p className="text-blue-100 text-lg mb-3">
                  {job.company?.companyName || "Company"}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                  <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    {job.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-lg">
                    <Briefcase className="w-4 h-4" />
                    {(job.jobType || job.type || "").replace(/_/g, " ")}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    Posted{" "}
                    {new Date(
                      job.createdAt || job.postedAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Interview Date Banner - Show if student has interview scheduled */}
        {interviewInfo &&
          studentApplication?.status === "INTERVIEW_SCHEDULED" && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Interview Scheduled!</p>
                  <p className="text-purple-100 text-sm">
                    Your interview is on{" "}
                    <span className="font-bold">{interviewInfo.date}</span> at{" "}
                    <span className="font-bold">{interviewInfo.time}</span>
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(job.salaryMin || job.salaryRange?.min) && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-green-700 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Salary Range</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {job.salaryCurrency || "JOD"}{" "}
                    {(job.salaryRange?.min || job.salaryMin)?.toLocaleString()}{" "}
                    - {job.salaryRange?.max || job.salaryMax || "Open"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per month</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-blue-700 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Applicants</span>
                </div>
                <p className="text-gray-900 font-bold text-lg">
                  {job.applicationCount || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">candidates applied</p>
              </div>

              {job.applicationDeadline && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-amber-700 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Deadline</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(job.applicationDeadline) > new Date()
                      ? "Still accepting"
                      : "Closed"}
                  </p>
                </div>
              )}

              {(job.experienceRequired || job.educationRequired) && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-purple-700 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Requirements</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {job.experienceRequired || "Not specified"}
                  </p>
                  {job.educationRequired && (
                    <p className="text-xs text-gray-600 mt-1">
                      {job.educationRequired}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Job Description
                </h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Requirements
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Responsibilities
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Benefits</h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-wrap">{job.benefits}</p>
                </div>
              </div>
            )}

            {/* Company Information */}
            {job.company && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    About the Company
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  {job.company.industry && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Industry
                      </span>
                      <p className="text-gray-900 font-semibold mt-1">
                        {job.company.industry}
                      </p>
                    </div>
                  )}
                  {job.company.size && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Company Size
                      </span>
                      <p className="text-gray-900 font-semibold mt-1">
                        {job.company.size}
                      </p>
                    </div>
                  )}
                  {job.company.foundedYear && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Founded
                      </span>
                      <p className="text-gray-900 font-semibold mt-1">
                        {job.company.foundedYear}
                      </p>
                    </div>
                  )}
                  {job.company.website && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Website
                      </span>
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mt-1 group"
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  )}
                  {job.company.contactEmail && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Contact Email
                      </span>
                      <a
                        href={`mailto:${job.company.contactEmail}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mt-1"
                      >
                        <Mail className="w-4 h-4" />
                        {job.company.contactEmail}
                      </a>
                    </div>
                  )}
                  {job.company.contactPhone && (
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Contact Phone
                      </span>
                      <a
                        href={`tel:${job.company.contactPhone}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mt-1"
                      >
                        <Phone className="w-4 h-4" />
                        {job.company.contactPhone}
                      </a>
                    </div>
                  )}
                </div>

                {job.company.description && (
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {job.company.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={onSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-2 rounded-xl transition-all ${
                isSaved
                  ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
              {isSaved ? "Saved" : "Save Job"}
            </button>

            {!hasApplied ? (
              <button
                onClick={onApply}
                className="inline-flex items-center gap-2 px-8 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5" />
                Apply for this Job
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Application Submitted
                    </p>
                    <p className="text-xs text-green-600">
                      Applied on{" "}
                      {new Date(
                        (application || studentApplication)?.appliedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {studentApplication?.status && (
                  <div
                    className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm ${
                      studentApplication.status === "INTERVIEW_SCHEDULED"
                        ? "bg-purple-50 border-purple-300 text-purple-700"
                        : studentApplication.status === "ACCEPTED"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : studentApplication.status === "REJECTED"
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "bg-yellow-50 border-yellow-300 text-yellow-700"
                    }`}
                  >
                    {studentApplication.status.replace(/_/g, " ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
