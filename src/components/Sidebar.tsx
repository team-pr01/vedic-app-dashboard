import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  Activity,
  HelpCircle,
  Bell,
  Sun,
  Moon,
  BookOpen,
  Headphones,
  FileText,
  Building,
  LandPlot,
  Newspaper,
  MessageSquarePlus,
  AlertTriangle,
  BellRing,
  Bot as Lotus,
  Home,
  Key,
  Film,
  FolderDot,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useCurrentUser } from "../redux/Features/Auth/authSlice";

interface SidebarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Sidebar({ isDarkMode, toggleDarkMode }: SidebarProps) {
  const location = useLocation();
  const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: AlertTriangle, label: "Emergency", path: "/dashboard/emergency" },
    { icon: Users, label: "Users", path: "/dashboard/users" },
    {
      icon: BookOpen,
      label: "Books",
      path: "/dashboard/religious-texts",
    },
   
    // {
    //   icon: BookOpen,
    //   label: "Religious Texts",
    //   path: "/dashboard/religious-texts",
    // },
     {
      icon: BookOpen,
      label: "Course",
      path: "/dashboard/course",
    },
    { icon: Film, label: "Reels", path: "/dashboard/reels" },
    { icon: Lotus, label: "Yoga", path: "/dashboard/yoga" },
    { icon: Home, label: "Vastu", path: "/dashboard/vastu" },
    {
      icon: LandPlot,
      label: "Temple Management",
      path: "/dashboard/temple-management",
    },
    { icon: Building, label: "Organization", path: "/dashboard/organizations" },
    { icon: Newspaper, label: "News", path: "/dashboard/news" },
    {
      icon: BellRing,
      label: "Notifications",
      path: "/dashboard/notifications",
    },
    { icon: MessageSquarePlus, label: "Popups", path: "/dashboard/popups" },
    { icon: FileText, label: "Content Management", path: "/dashboard/content" },
    {
      icon: Headphones,
      label: "Consultancy Service",
      path: "/dashboard/consultancy-service",
    },
    {
      icon: FolderDot,
      label: "Recipe",
      path: "/dashboard/recipe",
    },
    { icon: Key, label: "API Keys", path: "/dashboard/api-keys" },
    { icon: BarChart2, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Activity, label: "Activity", path: "/dashboard/activity" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    { icon: HelpCircle, label: "Help", path: "/dashboard/help" },
  ];

  const user = useSelector(useCurrentUser) as any;

  return (
    <div className="h-screen w-[270px] sticky top-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="px-4 py-[23px] border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
          {user?.role} Dashboard
        </h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="space-y-2">
          {sidebarLinks.map(
            (item) =>
              user!.assignedPages?.includes(item.path) && (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.path === location.pathname
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
