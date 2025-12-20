import { Briefcase, Send, Bookmark, Timer } from "lucide-react";

const QuickStats = ({ totalJobs, userApplications, savedJobs }) => {
  // Add safety checks
  const applications = Array.isArray(userApplications) ? userApplications : [];
  const saves = Array.isArray(savedJobs) ? savedJobs : [];
  
  const pendingApplications = applications.filter(app => app.status === 'PENDING').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Available Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{totalJobs || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">My Applications</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Saved Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{saves.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;