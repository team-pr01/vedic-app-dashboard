import React, { useState } from 'react';
import { RecentActivity } from '../../components/RecentActivity';
// import { UserTable } from '../Users/Users';
import { DonationStats } from '../../components/DonationStats';
import { ConsultancyManager } from '../../components/ConsultancyManager';
import { ContentManager } from '../../components/ContentManager';
import { NotificationCenter } from '../../components/NotificationCenter';
import { AnalyticsOverview } from '../../components/AnalyticsOverview';
import { ReligiousTextManager } from '../../components/ReligiousTextManager';
import { OrganizationManager } from '../../components/OrganizationManager';
import { NewsManager } from '../../components/NewsManager';
import { PopupManager } from '../../components/PopupManager';
import { APIKeyManager } from '../../components/APIKeyManager';
import { AlertTriangle, Users, BookOpen, Building, Newspaper, Headphones, Activity } from 'lucide-react';
import type { 
  Metric, 
  ActivityLog, 
  User, 
  Donation, 
  ConsultancyService,
  AnalyticsData 
} from '../../types';
import UserTable from '../../components/UsersPage/UserTable/UserTable';


export function Dashboard({ activeSection }: any) {
   const users = [
    {
      id: "1",
      name: "John Doe",
      email: "RbSsM@example.com",
      role: "Admin",
      status: "active",
      joined: "2023-10-01T12:00:00Z",
    },
  ];
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [consultancies, setConsultancies] = useState<ConsultancyService[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  const renderOverviewCard = (title: string, count: number, icon: React.ReactNode, bgColor: string) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  const renderDashboardOverview = () => (
    <>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {renderOverviewCard(
          'Active Emergency Alerts',
          3,
          <AlertTriangle className="h-6 w-6 text-red-500" />,
          'bg-red-50 dark:bg-red-900/20'
        )}
        {renderOverviewCard(
          'Total Users',
          users.length,
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
          'Active Organizations',
          42,
          <Building className="h-6 w-6 text-green-500" />,
          'bg-green-50 dark:bg-green-900/20'
        )}
      </div>

      {/* Feature Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* News and Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Newspaper className="h-5 w-5 mr-2 text-blue-500" />
            Latest News
          </h3>
          <div className="space-y-4">
            {/* Sample news items */}
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

        {/* Consultancy Overview */}
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

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <RecentActivity activities={recentActivity.slice(0, 3)} />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Users
          </h3>
          <UserTable users={users} />
        </div>

        {/* Donation Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Donation Overview
          </h3>
          <DonationStats donations={donations} />
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'api-keys':
        return <APIKeyManager />;
      case 'religious-texts':
        return <ReligiousTextManager />;
      case 'users':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Management
              </h2>
              <UserTable users={users} />
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Center
              </h2>
              <NotificationCenter />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsOverview data={analyticsData} />;
      case 'activity':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <RecentActivity activities={recentActivity} />
            </div>
          </div>
        );
      case 'consultancy':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Consultancy Services
              </h2>
              <ConsultancyManager consultancies={consultancies} />
            </div>
          </div>
        );
      case 'content':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Management
              </h2>
              <ContentManager />
            </div>
          </div>
        );
      case 'organization':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Organization Management
              </h2>
              <OrganizationManager />
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                News Management
              </h2>
              <NewsManager />
            </div>
          </div>
        );
      case 'popups':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Popup Management
              </h2>
              <PopupManager />
            </div>
          </div>
        );
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {renderContent()}
    </div>
  );
}