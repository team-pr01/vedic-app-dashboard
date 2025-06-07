import React from 'react';
// import { RecentActivity } from '../../components/RecentActivity';
import { DonationStats } from '../../components/DonationStats';
import UserTable from '../../components/UsersPage/UserTable/UserTable';
import {
  AlertTriangle,
  Users,
  BookOpen,
  Building,
  Newspaper,
  Headphones,
  // Activity,
} from 'lucide-react';
import { useGetAllEmergenciesQuery } from '../../redux/Features/Emergencies/emergencyApi';
import { useGetAllUsersQuery } from '../../redux/Features/Auth/authApi';
import { useGetAllOrganizationQuery } from '../../redux/Features/Organization/organizationApi';

// Sample data
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'RbSsM@example.com',
    role: 'Admin',
    status: 'active',
    joined: '2023-10-01T12:00:00Z',
  },
];

const recentActivity = [
  { id: 1, message: 'User John joined.', timestamp: '1 hour ago' },
  { id: 2, message: 'New organization added.', timestamp: '3 hours ago' },
  { id: 3, message: 'Donation received.', timestamp: '5 hours ago' },
];

const donations = [
  { id: 1, donor: 'Alice', amount: 100, date: '2024-05-01' },
  { id: 2, donor: 'Bob', amount: 250, date: '2024-05-02' },
  { id: 3, donor: 'Charlie', amount: 75, date: '2024-05-03' },
];

const renderOverviewCard = (
  title: string,
  count: number,
  icon: React.ReactNode,
  bgColor: string
) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
      </div>
      <div className="p-3 bg-white dark:bg-gray-700 rounded-full">{icon}</div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {

   const { data: emergencies } = useGetAllEmergenciesQuery({});
   const { data: users } = useGetAllUsersQuery({});
   const activeEmergency = emergencies?.data?.filter((emergency:any) => emergency.status === 'pending');
   const { data: organizations } = useGetAllOrganizationQuery({});


  return (
    <>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {renderOverviewCard(
          'Active Emergency Alerts',
          activeEmergency?.length || 0,
          <AlertTriangle className="h-6 w-6 text-red-500" />,
          'bg-red-50 dark:bg-red-900/20'
        )}
        {renderOverviewCard(
          'Total Users',
        users?.data?.length || 0,
          <Users className="h-6 w-6 text-blue-500" />,
          'bg-blue-50 dark:bg-blue-900/20'
        )}
        {renderOverviewCard(
          'Religious Texts',
          156,
          <BookOpen className="h-6 w-6 text-purple-500" />,
          'bg-purple-50 dark:bg-purple-900/20'
        )}
        {renderOverviewCard(
          'Total Organizations',
          organizations?.data?.length || 0,
          <Building className="h-6 w-6 text-green-500" />,
          'bg-green-50 dark:bg-green-900/20'
        )}
      </div>

      {/* Feature Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* News */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Newspaper className="h-5 w-5 mr-2 text-blue-500" />
            Latest News
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">New Temple Opening</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Upcoming Festival</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>

        {/* Consultancy */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Headphones className="h-5 w-5 mr-2 text-green-500" />
            Consultancy Services
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Active Sessions</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Available Consultants</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Pending Requests</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
            </div>
          </div>
        </div>

        {/* Activity */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <RecentActivity activities={recentActivity.slice(0, 3)} />
          </div>
        </div> */}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Users
          </h3>
          <UserTable/>
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
