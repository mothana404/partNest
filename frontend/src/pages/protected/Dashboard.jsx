import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Briefcase, 
  BookmarkCheck, 
  Users, 
  Calendar, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Bell,
  FileText,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/SignIn');
        return;
      }
      setUser(userData);
      setIsLoading(false);
      
      // Mock notifications
      setNotifications([
        { id: 1, text: 'New job matching your profile', time: '10 minutes ago', isNew: true },
        { id: 2, text: 'Your application status has been updated', time: '2 hours ago', isNew: true },
        { id: 3, text: 'Complete your profile to get more visibility', time: '1 day ago', isNew: false },
      ]);
    }, 800);
  }, [navigate]);

  // Mock recent activity data
  const recentActivity = [
    { id: 1, action: 'Applied to', company: 'Tech Solutions Inc', role: 'Senior Developer', time: '2 days ago' },
    { id: 2, action: 'Profile viewed by', company: 'Innovate Labs', role: 'HR Manager', time: '3 days ago' },
    { id: 3, action: 'Interview scheduled with', company: 'Digital Futures', role: 'UX Designer', time: '1 week ago' },
  ];

  // Mock recommended jobs for job seekers
  const recommendedJobs = [
    { id: 1, title: 'Frontend Developer', company: 'Web Experts', location: 'Remote', salary: '$80k-$110k', match: '95%' },
    { id: 2, title: 'UX/UI Designer', company: 'Creative Studio', location: 'Amman, Jordan', salary: '$75k-$95k', match: '87%' },
    { id: 3, title: 'Product Manager', company: 'Tech Innovators', location: 'Amman, Jordan', salary: '$100k-$130k', match: '82%' },
  ];

  // Mock top candidates for employers
  const topCandidates = [
    { id: 1, name: 'Alex Johnson', role: 'Senior Developer', experience: '7 years', match: '93%' },
    { id: 2, name: 'Samantha Lee', role: 'UX Designer', experience: '5 years', match: '89%' },
    { id: 3, name: 'Michael Chen', role: 'Product Manager', experience: '6 years', match: '85%' },
  ];

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isEmployer = user?.role === 'employee';

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.name || 'User'}</h2>
            <p className="text-blue-100">
              {isEmployer 
                ? 'Track your job postings and find the best candidates' 
                : 'Your job search dashboard is ready for exploration'}
            </p>
          </div>
          <div className="hidden md:block bg-white/20 p-4 rounded-lg backdrop-blur-sm">
            <p className="font-semibold">Profile completion</p>
            <div className="w-64 h-3 bg-white/30 rounded-full mt-2">
              <div className="h-3 bg-white rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-sm mt-1">65% - Complete your profile to improve visibility</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isEmployer ? (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">This Month</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Posted Jobs</h3>
              <div className="flex items-end mt-2">
                <p className="text-3xl font-bold">12</p>
                <span className="text-green-500 ml-2 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +3
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">3 active job postings</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="text-green-600" size={24} />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">This Month</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Applications</h3>
              <div className="flex items-end mt-2">
                <p className="text-3xl font-bold">48</p>
                <span className="text-green-500 ml-2 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +12
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">15 new this week</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">This Week</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Interviews</h3>
              <div className="flex items-end mt-2">
                <p className="text-3xl font-bold">8</p>
                <span className="text-green-500 ml-2 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +2
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">2 scheduled for today</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">This Month</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Applied Jobs</h3>
              <div className="flex items-end mt-2">
                <p className="text-3xl font-bold">9</p>
                <span className="text-green-500 ml-2 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +3
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">2 applications in review</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <BookmarkCheck className="text-green-600" size={24} />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">All Time</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Saved Jobs</h3>
              <div className="flex items-end mt-2">
                <p className="text-3xl font-bold">15</p>
                <span className="text-green-500 ml-2 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +5
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">5 jobs about to expire</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">This Month</span>
              </div>
              <h3 className="text-gray-700 font-semibold">Interviews</h3>
              <div className="flex items-end mt-2">
                <p className="text-3xl font-bold">3</p>
                <span className="text-green-500 ml-2 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +1
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">1 scheduled for tomorrow</p>
            </div>
          </>
        )}
      </div>

      {/* Two Column Layout for Rest of Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 Width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Content Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {isEmployer ? 'Top Matching Candidates' : 'Recommended Jobs'}
              </h3>
              <button className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                View all <ChevronRight size={16} />
              </button>
            </div>

            {isEmployer ? (
              <div className="space-y-4">
                {topCandidates.map(candidate => (
                  <div key={candidate.id} className="border rounded-lg p-4 hover:bg-blue-50 transition-colors flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl">
                        {candidate.name.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.role} • {candidate.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-800 font-medium text-sm px-3 py-1 rounded-full">
                        {candidate.match} match
                      </div>
                      <button className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map(job => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-800 font-medium text-sm px-3 py-1 rounded-full">
                          {job.match} match
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-sm text-gray-700">{job.salary}</p>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-yellow-500">
                          <Star size={18} />
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start pb-4 border-b last:border-0">
                  <div className="bg-gray-100 p-2 rounded-full mr-4">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      <span className="font-medium">{activity.action}</span> {' '}
                      <span className="font-semibold">{activity.company}</span> {' '}
                      for {activity.role}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 text-sm font-medium flex items-center justify-center hover:underline">
              View All Activity <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column - 1/3 Width */}
        <div className="space-y-6">
          {/* Notifications Widget */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                {notifications.filter(n => n.isNew).length} new
              </span>
            </div>
            
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg flex items-start ${notification.isNew ? 'bg-blue-50' : 'bg-gray-50'}`}
                  >
                    <Bell size={18} className={notification.isNew ? 'text-blue-500' : 'text-gray-500'} />
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No notifications</p>
              )}
            </div>
            
            <button className="w-full mt-4 text-blue-600 text-sm font-medium flex items-center justify-center hover:underline">
              View All <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-50 hover:bg-blue-100 p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                <Briefcase className="text-blue-600 mb-2" size={20} />
                <span className="text-xs font-medium text-gray-700">
                  {isEmployer ? 'Post a Job' : 'Find Jobs'}
                </span>
              </button>
              <button className="bg-green-50 hover:bg-green-100 p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                <FileText className="text-green-600 mb-2" size={20} />
                <span className="text-xs font-medium text-gray-700">
                  {isEmployer ? 'View Applicants' : 'Update Resume'}
                </span>
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                <Award className="text-purple-600 mb-2" size={20} />
                <span className="text-xs font-medium text-gray-700">
                  {isEmployer ? 'Premium Features' : 'Skills Assessment'}
                </span>
              </button>
              <button className="bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                <Users className="text-yellow-600 mb-2" size={20} />
                <span className="text-xs font-medium text-gray-700">
                  {isEmployer ? 'Team Access' : 'Networking'}
                </span>
              </button>
            </div>
          </div>

          {/* Upcoming Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming {isEmployer ? 'Interviews' : 'Events'}</h3>
            
            {isEmployer ? (
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3 py-2">
                  <p className="font-medium">Interview with Jordan Lee</p>
                  <p className="text-sm text-gray-600">Tomorrow, 10:00 AM • Frontend Developer</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-2">
                  <p className="font-medium">Technical Assessment</p>
                  <p className="text-sm text-gray-600">May 21, 2:00 PM • 3 Candidates</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3 py-2">
                  <p className="font-medium">Interview with Tech Innovators</p>
                  <p className="text-sm text-gray-600">Tomorrow, 2:00 PM • Virtual</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-2">
                  <p className="font-medium">Tech Career Fair</p>
                  <p className="text-sm text-gray-600">May 23, 10:00 AM • Amman, 12St</p>
                </div>
              </div>
            )}
            
            <button className="w-full mt-4 text-blue-600 text-sm font-medium flex items-center justify-center hover:underline">
              View Calendar <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;