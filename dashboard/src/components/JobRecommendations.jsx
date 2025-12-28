// components/dashboard/JobRecommendations.jsx
import { useState } from "react";
import { 
  Briefcase, 
  ArrowRight, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Zap,
  TrendingUp
} from "lucide-react";

const JobRecommendations = ({ recommendations, studentPreferences }) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (jobId) => {
    setImageErrors(prev => ({ ...prev, [jobId]: true }));
  };

  const formatSalary = (min, max, currency = "USD") => {
    if (!min && !max) return "Salary not specified";
    if (!max) return `From $${min?.toLocaleString()}`;
    if (!min) return `Up to $${max?.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'PART_TIME': 'bg-blue-100 text-blue-800',
      'CONTRACT': 'bg-purple-100 text-purple-800', 
      'INTERNSHIP': 'bg-green-100 text-green-800',
      'FREELANCE': 'bg-yellow-100 text-yellow-800',
      'REMOTE': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getMatchScore = (job) => {
    let score = 0;
    const maxScore = 100;
    const jobType = job.type || job.jobType;
    const salaryMin = job.salaryRange?.min || job.salaryMin;

    // Job type match (30 points)
    if (studentPreferences?.preferredJobTypes?.includes(jobType)) {
      score += 30;
    }

    // Location match (25 points)
    if (studentPreferences?.preferredLocations?.some(loc => 
      job.location?.toLowerCase().includes(loc.toLowerCase()) || 
      loc.toLowerCase() === 'remote'
    )) {
      score += 25;
    }

    // Salary match (20 points)
    if (salaryMin && studentPreferences?.expectedSalaryMin) {
      if (salaryMin >= studentPreferences.expectedSalaryMin * 0.8) {
        score += 20;
      } else if (salaryMin >= studentPreferences.expectedSalaryMin * 0.6) {
        score += 10;
      }
    }

    // Random factors for demonstration (25 points)
    score += Math.floor(Math.random() * 25);

    return Math.min(score, maxScore);
  };

  const getMatchLevel = (score) => {
    if (score >= 80) return { label: "Excellent Match", color: "text-green-600", icon: "🎯" };
    if (score >= 60) return { label: "Good Match", color: "text-blue-600", icon: "✨" };
    if (score >= 40) return { label: "Fair Match", color: "text-yellow-600", icon: "⭐" };
    return { label: "Potential Match", color: "text-gray-600", icon: "💡" };
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Job Recommendations
        </h3>
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No recommendations yet</p>
          <p className="text-sm text-gray-400">
            Complete your profile to get personalized job recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Recommended for You
        </h3>
      </div>

      <div className="space-y-4">
        {recommendations.slice(0, 3).map((job) => {
          const matchScore = getMatchScore(job);
          const matchLevel = getMatchLevel(matchScore);
          const company = job.company || {};

          return (
            <div 
              key={job.id} 
              className="border border-gray-200 rounded-lg p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Company Logo */}
                  <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
                    {(company.logo || company.logoUrl) && !imageErrors[job.id] ? (
                      <img
                        src={company.logo || company.logoUrl}
                        alt={company.name || company.companyName || 'Company'}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(job.id)}
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-1">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-600">{company.name || company.companyName}</p>
                    
                    {/* Match Score */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${matchLevel.color}`}>
                        {matchLevel.icon} {matchLevel.label}
                      </span>
                      <span className="text-xs text-gray-500">({matchScore}% match)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-2">
                {/* Location & Job Type */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {(job.type || job.jobType) && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type || job.jobType)}`}>
                      {(job.type || job.jobType || '').replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {/* Salary */}
                {((job.salaryRange?.min || job.salaryMin) || (job.salaryRange?.max || job.salaryMax)) && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatSalary(
                      job.salaryRange?.min || job.salaryMin, 
                      job.salaryRange?.max || job.salaryMax, 
                      job.salaryCurrency
                    )}</span>
                  </div>
                )}

                {/* Posted Time */}
                {(job.postedAt || job.createdAt) && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Posted {formatTimeAgo(job.postedAt || job.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Why Recommended */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Why recommended: </span>
                  {(() => {
                    const reasons = [];
                    const jobType = job.type || job.jobType;
                    const salaryMin = job.salaryRange?.min || job.salaryMin;
                    
                    if (studentPreferences?.preferredJobTypes?.includes(jobType)) {
                      reasons.push("matches your job type preference");
                    }
                    if (studentPreferences?.preferredLocations?.some(loc => 
                      job.location?.toLowerCase().includes(loc.toLowerCase())
                    )) {
                      reasons.push("in your preferred location");
                    }
                    if (salaryMin && studentPreferences?.expectedSalaryMin && 
                        salaryMin >= studentPreferences.expectedSalaryMin * 0.8) {
                      reasons.push("meets salary expectations");
                    }
                    if (reasons.length === 0) {
                      reasons.push("matches your profile");
                    }
                    return reasons.slice(0, 2).join(", ");
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 inline mr-1" />
          {recommendations.length} jobs match your preferences
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;