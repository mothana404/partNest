// components/dashboard/QuickActions.jsx
import { 
  Plus, 
  Search, 
  User, 
  FileText, 
  Briefcase, 
  BookmarkIcon,
  Star,
  ExternalLink
} from "lucide-react";

const QuickActions = ({ hasIncompleteProfile, hasPendingApplications, needsSkillUpdate }) => {
  const actions = [
    {
      id: "browse-jobs",
      title: "Browse Jobs",
      description: "Find your next opportunity",
      icon: Search,
      color: "bg-blue-500 hover:bg-blue-600",
      link: "/student/dashboard/jobs",
      priority: "high"
    },
    {
      id: "view-applications",
      title: "My Applications",
      description: `${hasPendingApplications ? 'Check pending applications' : 'Track your progress'}`,
      icon: FileText,
      color: "bg-green-500 hover:bg-green-600",
      link: "/student/dashboard/applications",
      priority: hasPendingApplications ? "high" : "medium",
      badge: hasPendingApplications ? "Updates" : null
    },
    {
      id: "saved-jobs",
      title: "Saved Jobs",
      description: "Review bookmarked positions",
      icon: BookmarkIcon,
      color: "bg-purple-500 hover:bg-purple-600",
      link: "/student/dashboard/saved-jobs",
      priority: "medium"
    },
    {
      id: "update-profile",
      title: "Update Profile",
      description: hasIncompleteProfile ? "Complete your profile" : "Keep profile fresh",
      icon: User,
      color: "bg-orange-500 hover:bg-orange-600",
      link: "/student/dashboard/profile",
      priority: hasIncompleteProfile ? "high" : "low",
      badge: hasIncompleteProfile ? "Incomplete" : null
    },
    {
      id: "add-skills",
      title: "Manage Skills",
      description: needsSkillUpdate ? "Add your skills" : "Update your expertise",
      icon: Star,
      color: "bg-yellow-500 hover:bg-yellow-600",
      link: "/student/dashboard/profile?tab=skills",
      priority: needsSkillUpdate ? "high" : "low",
      badge: needsSkillUpdate ? "Add Skills" : null
    },
    {
      id: "add-experience",
      title: "Add Experience",
      description: "Showcase your background",
      icon: Briefcase,
      color: "bg-indigo-500 hover:bg-indigo-600",
      link: "/student/dashboard/profile?tab=experience",
      priority: "medium"
    }
  ];

  // Sort actions by priority
  const sortedActions = actions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const handleActionClick = (link) => {
    window.location.href = link;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <Plus className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {sortedActions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.link)}
              className={`w-full p-4 ${action.color} text-white rounded-lg transition-all duration-200 group hover:shadow-md transform hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {action.badge && (
                    <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                      {action.badge}
                    </span>
                  )}
                  <ExternalLink className="w-4 h-4 opacity-75 group-hover:opacity-100" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-3">💡 Pro Tips</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Apply to 5-10 jobs per week for best results</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Keep your profile updated to attract more recruiters</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Save interesting jobs for later review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;