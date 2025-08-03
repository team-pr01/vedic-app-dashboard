import React from "react";
// import { RecentActivity } from '../../components/RecentActivity';
import { DonationStats } from "../../components/DonationStats";
import UserTable from "../../components/UsersPage/UserTable/UserTable";
import {
  AlertTriangle,
  Users,
  BookOpen,
  Building,
  Book,
  Film,
  Heart,
  Compass,
  Home,
  Briefcase,
  ChefHat,
  Key,
  // Activity,
} from "lucide-react";
import { useGetAdminStatsQuery } from "../../redux/Features/Yoga/yogaApi";

const donations = [
  { id: 1, donor: "Alice", amount: 100, date: "2024-05-01" },
  { id: 2, donor: "Bob", amount: 250, date: "2024-05-02" },
  { id: 3, donor: "Charlie", amount: 75, date: "2024-05-03" },
];

const renderOverviewCard = (
  title: string,
  count: number,
  icon: React.ReactNode
) => (
  <div className={`bg-gray-200/80 p-6 rounded-lg shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </p>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {count}
        </p>
      </div>
      <div className="p-3 bg-white dark:bg-gray-700 rounded-full">{icon}</div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data } = useGetAdminStatsQuery({});

  return (
    <>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {renderOverviewCard(
          "Active Emergency Alerts",
          data?.data?.pendingEmergencies || 0,
          <AlertTriangle className="h-6 w-6 text-red-500" />
        )}
        {renderOverviewCard(
          "Total Users",
          data?.data?.totalUsers || 0,
          <Users className="h-6 w-6 text-blue-500" />
        )}
        {renderOverviewCard(
          "Religious Texts",
          data?.data?.totalBooks || 0,
          <BookOpen className="h-6 w-6 text-purple-500" />
        )}
        {renderOverviewCard(
          "Total Organizations",
          data?.data?.totalOrganizations || 0,
          <Building className="h-6 w-6 text-green-500" />
        )}
        {renderOverviewCard(
          "Total Courses",
          data?.data?.totalCourses || 0,
          <Book className="h-6 w-6 text-yellow-500" />
        )}
        {renderOverviewCard(
          "Total Reels",
          data?.data?.totalReels || 0,
          <Film className="h-6 w-6 text-pink-500" />
        )}
        {renderOverviewCard(
          "Total Yogas",
          data?.data?.totalYogas || 0,
          <Heart className="h-6 w-6 text-red-400" />
        )}
        {renderOverviewCard(
          "Total Vastus",
          data?.data?.totalVastus || 0,
          <Compass className="h-6 w-6 text-cyan-500" />
        )}
        {renderOverviewCard(
          "Total Temples",
          data?.data?.totalTemples || 0,
          <Home className="h-6 w-6 text-orange-500" />
        )}
        {renderOverviewCard(
          "Total Consultancies",
          data?.data?.totalConsultancies || 0,
          <Briefcase className="h-6 w-6 text-lime-500" />
        )}
        {renderOverviewCard(
          "Total Recipes",
          data?.data?.totalRecipes || 0,
          <ChefHat className="h-6 w-6 text-amber-500" />
        )}
        {renderOverviewCard(
          "Total API Keys",
          data?.data?.totalApiKeys || 0,
          <Key className="h-6 w-6 text-gray-500" />
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Users
          </h3>
          <UserTable />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Donation Overview
          </h3>
          <DonationStats donations={donations} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
