import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import { Sparkles } from "lucide-react";

const RecommendedJobs = ({ userApplications, savedJobs, onSave, onApply, onViewDetails }) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    // API call to get recommended jobs based on user profile
    setLoading(true);
    try {
      // Implementation here
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatus = (jobId) => {
    return userApplications.find(app => app.jobId === jobId);
  };

  if (recommendedJobs.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendedJobs.slice(0, 3).map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={savedJobs.includes(job.id)}
            application={getApplicationStatus(job.id)}
            onSave={() => onSave(job.id)}
            onApply={() => onApply(job)}
            onViewDetails={() => onViewDetails(job)}
            isRecommended={true}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;