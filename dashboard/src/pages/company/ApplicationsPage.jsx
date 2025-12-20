// import { useState, useEffect } from "react";
// import { Search, Filter, Eye, Calendar, MessageSquare, Clock, CheckCircle, XCircle, User, Briefcase } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "../../hooks/useAuth";
// import ApplicationDetailsView from "../../components/company/ApplicationDetailsView";
// import Pagination from "../../components/company/jobs/Pagination";

// const ApplicationsPage = () => {
//   const { getToken } = useAuth();
//   const [activeTab, setActiveTab] = useState("list"); // 'list', 'view'
//   const [applications, setApplications] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [jobFilter, setJobFilter] = useState("ALL");
//   const [dateFilter, setDateFilter] = useState("ALL");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchApplications();
//     fetchCompanyJobs();
//   }, [currentPage, searchTerm, statusFilter, jobFilter, dateFilter]);

//   const fetchCompanyJobs = async () => {
//     try {
//       const token = getToken();
//       const response = await axios.get(
//         `http://localhost:8080/api/company/job?limit=1000`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setJobs(response.data.data.jobs);
//       }
//     } catch (error) {
//       console.error("Error fetching company jobs:", error);
//     }
//   };

//   const fetchApplications = async () => {
//     setLoading(true);
//     try {
//       const token = getToken();

//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//       });

//       if (searchTerm.trim()) {
//         params.append("search", searchTerm.trim());
//       }

//       if (statusFilter && statusFilter !== "ALL") {
//         params.append("status", statusFilter);
//       }

//       if (jobFilter && jobFilter !== "ALL") {
//         params.append("jobId", jobFilter);
//       }

//       if (dateFilter && dateFilter !== "ALL") {
//         params.append("dateRange", dateFilter);
//       }

//       const response = await axios.get(
//         `http://localhost:8080/api/company/applications?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const { applications, pagination } = response.data.data;
//         setApplications(applications);
//         setTotalPages(pagination.totalPages);
//       } else {
//         console.error("API returned error:", response.data.message);
//         setApplications([]);
//         setTotalPages(0);
//       }
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//       setApplications([]);
//       setTotalPages(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateApplicationStatus = async (applicationId, newStatus, additionalData = {}) => {
//     try {
//       const token = getToken();

//       const response = await axios.put(
//         `http://localhost:8080/api/company/applications/${applicationId}`,
//         { status: newStatus, ...additionalData },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         await fetchApplications(); // Refresh the list
//       } else {
//         console.error("Failed to update application:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error updating application:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "REVIEWED":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "INTERVIEW_SCHEDULED":
//         return "bg-purple-100 text-purple-800 border-purple-200";
//       case "ACCEPTED":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "REJECTED":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "WITHDRAWN":
//         return "bg-gray-100 text-gray-800 border-gray-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "ACCEPTED":
//         return <CheckCircle className="w-4 h-4" />;
//       case "REJECTED":
//         return <XCircle className="w-4 h-4" />;
//       case "INTERVIEW_SCHEDULED":
//         return <Calendar className="w-4 h-4" />;
//       case "REVIEWED":
//         return <Eye className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getApplicationStats = () => {
//     const stats = applications.reduce((acc, app) => {
//       acc[app.status] = (acc[app.status] || 0) + 1;
//       return acc;
//     }, {});

//     return {
//       total: applications.length,
//       pending: stats.PENDING || 0,
//       reviewed: stats.REVIEWED || 0,
//       interviews: stats.INTERVIEW_SCHEDULED || 0,
//       accepted: stats.ACCEPTED || 0,
//       rejected: stats.REJECTED || 0,
//     };
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "view":
//         return (
//           <ApplicationDetailsView
//             application={selectedApplication}
//             onUpdateStatus={handleUpdateApplicationStatus}
//             onClose={() => setActiveTab("list")}
//           />
//         );
//       default:
//         return renderApplicationsList();
//     }
//   };

//   const renderApplicationsList = () => {
//     const stats = getApplicationStats();

//     return (
//       <div className="space-y-6">
//         {/* Header with Stats */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
//             <p className="text-gray-600 mt-1">Manage candidate applications</p>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
//             <div className="text-sm text-gray-600">Total</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
//             <div className="text-sm text-gray-600">Pending</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
//             <div className="text-sm text-gray-600">Reviewed</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <div className="text-2xl font-bold text-purple-600">{stats.interviews}</div>
//             <div className="text-sm text-gray-600">Interviews</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
//             <div className="text-sm text-gray-600">Accepted</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
//             <div className="text-sm text-gray-600">Rejected</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by student name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5 text-gray-400" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="ALL">All Status</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="REVIEWED">Reviewed</option>
//                 <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                 <option value="ACCEPTED">Accepted</option>
//                 <option value="REJECTED">Rejected</option>
//                 <option value="WITHDRAWN">Withdrawn</option>
//               </select>
//             </div>

//             <select
//               value={jobFilter}
//               onChange={(e) => setJobFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="ALL">All Jobs</option>
//               {jobs.map(job => (
//                 <option key={job.id} value={job.id}>{job.title}</option>
//               ))}
//             </select>

//             <select
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="ALL">All Time</option>
//               <option value="TODAY">Today</option>
//               <option value="WEEK">This Week</option>
//               <option value="MONTH">This Month</option>
//             </select>
//           </div>
//         </div>

//         {/* Applications Table */}
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           ) : applications.length === 0 ? (
//             <div className="text-center py-12">
//               <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//               <div className="text-gray-600 text-lg mb-2">No applications found</div>
//               <p className="text-gray-500">
//                 No applications match your current filters.
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Candidate
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Job Position
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Applied Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         University
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Experience
//                       </th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {applications.map((application) => (
//                       <tr
//                         key={application.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                               <User className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {application.student?.user?.fullName}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {application.student?.user?.email}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {application.job?.title}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {application.job?.jobType?.replace('_', ' ')}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(application.status)}`}>
//                             {getStatusIcon(application.status)}
//                             {application.status.replace('_', ' ')}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {new Date(application.appliedAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {application.student?.university || 'Not specified'}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {application.student?.experiences?.length || 0} experiences
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             <select
//                               value={application.status}
//                               onChange={(e) => handleUpdateApplicationStatus(application.id, e.target.value)}
//                               className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                               <option value="PENDING">Pending</option>
//                               <option value="REVIEWED">Reviewed</option>
//                               <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                               <option value="ACCEPTED">Accepted</option>
//                               <option value="REJECTED">Rejected</option>
//                             </select>
                            
//                             <button
//                               onClick={() => {
//                                 setSelectedApplication(application);
//                                 setActiveTab("view");
//                               }}
//                               className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
//                               title="View Details"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>

//                             {application.coverLetter && (
//                               <button
//                                 className="p-2 text-gray-400 hover:text-green-600 transition-colors"
//                                 title="Has Cover Letter"
//                               >
//                                 <MessageSquare className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="px-6 py-4 border-t border-gray-200">
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={setCurrentPage}
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
//     </div>
//   );
// };

// export default ApplicationsPage;