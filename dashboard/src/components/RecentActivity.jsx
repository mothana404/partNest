// components/dashboard/RecentActivity.jsx
import { useState } from "react";
import { 
  Clock, 
  Briefcase, 
  BookmarkIcon, 
  Calendar, 
  ArrowRight, 
  Building2, 
  MapPin,
  Eye,
  ExternalLink
} from "lucide-react";

const RecentActivity = ({ recentApplications, recentSavedJobs, upcomingInterviews }) => {
  const [activeTab, setActiveTab] = useState("applications");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'REVIEWED': return 'text-blue-600 bg-blue-100';
      case 'INTERVIEW_SCHEDULED': return 'text-purple-600 bg-purple-100';
      case 'ACCEPTED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: "applications", label: "Recent Applications", count: recentApplications.length },
    { id: "saved", label: "Recently Saved", count: recentSavedJobs.length },
    { id: "interviews", label: "Upcoming Interviews", count: upcomingInterviews.length }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === "applications" && (
          <div className="space-y-4">
            {recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent applications</p>
                <p className="text-sm text-gray-400">Start applying to jobs to see activity here</p>
              </div>
            ) : (
              recentApplications.map((application) => (
                <div key={application.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{application.job?.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {application.job?.company?.companyName}
                        </p>
                        {application.job?.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {application.job.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(application.createdAt || application.appliedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="space-y-4">
            {recentSavedJobs.length === 0 ? (
              <div className="text-center py-8">
                <BookmarkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recently saved jobs</p>
                <p className="text-sm text-gray-400">Save interesting jobs to keep track of them</p>
              </div>
            ) : (
              recentSavedJobs.map((savedJob) => (
                <div key={savedJob.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookmarkIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{savedJob.job?.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {savedJob.job?.company?.companyName}
                        </p>
                        {savedJob.job?.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {savedJob.job.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(savedJob.savedAt || savedJob.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="space-y-4">
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming interviews</p>
                <p className="text-sm text-gray-400">Interview invitations will appear here</p>
              </div>
            ) : (
              upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-start gap-4 p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{interview.jobTitle}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {interview.company}
                        </p>
                        <p className="text-sm text-purple-700 mt-1">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {new Date(interview.date).toLocaleDateString()} at {interview.time}
                        </p>
                        {interview.type && (
                          <p className="text-xs text-gray-600 mt-1">
                            Type: {interview.type}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;