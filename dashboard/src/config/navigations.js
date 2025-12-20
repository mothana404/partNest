import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TagIcon,
  ChartBarIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon } from "lucide-react";

export const navigationConfig = {
  STUDENT: [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: HomeIcon,
      description: "Overview of your activity",
    },
    {
      name: "Browse Jobs",
      path: "/student/dashboard/jobs",
      icon: BriefcaseIcon,
      description: "Find part-time opportunities",
    },
    {
      name: "My Applications",
      path: "/student/dashboard/applications",
      icon: DocumentTextIcon,
      description: "Track your applications",
    },
    {
      name: "Saved Jobs",
      path: "/student/dashboard/saved",
      icon: BookmarkIcon,
      description: "Your bookmarked jobs",
    },
    {
      name: "Profile",
      path: "/student/dashboard/profile",
      icon: UserIcon,
      description: "Manage your profile",
    },
  ],

  COMPANY: [
  {
    name: "Dashboard",
    path: "/company/dashboard",
    icon: HomeIcon,
    description: "Company overview",
  },
  {
    name: "Jobs",
    path: "/company/dashboard/jobs",
    icon: BriefcaseIcon,
    description: "Manage your job postings",
  },
  {
    name: "Candidates",
    path: "/company/dashboard/candidates",
    icon: UsersIcon,
    description: "Browse student profiles",
  },
  {
    name: "Interviews",
    path: "/company/dashboard/interviews",
    icon: CalendarIcon,
    description: "Schedule and manage interviews",
  },
  {
    name: "Company Profile",
    path: "/company/dashboard/profile",
    icon: BuildingOfficeIcon,
    description: "Edit company information & settings",
  },
],

  ADMIN: [
    // {
    //   name: "Dashboard",
    //   path: "/admin/dashboard",
    //   icon: HomeIcon,
    //   description: "System overview",
    // },
    {
      name: "Users",
      path: "/admin/dashboard/users",
      icon: UsersIcon,
      description: "Manage all users",
    },
    {
      name: "Companies",
      path: "/admin/dashboard/companies",
      icon: BuildingOfficeIcon,
      description: "Manage companies",
    },
    {
      name: "Jobs",
      path: "/admin/dashboard/jobs",
      icon: BriefcaseIcon,
      description: "Manage all jobs",
    },
    {
      name: "Categories",
      path: "/admin/dashboard/categories",
      icon: TagIcon,
      description: "Manage job categories",
    },
    {
      name: "Applications",
      path: "/admin/dashboard/applications",
      icon: DocumentTextIcon,
      description: "View all applications",
    },
  ],
};

// Helper function to get navigation by role
export const getNavigationByRole = (role) => {
  return navigationConfig[role] || [];
};

// Helper function to check if a path is active
export const isPathActive = (currentPath, navPath) => {
  return currentPath === navPath || currentPath.startsWith(navPath + "/");
};
