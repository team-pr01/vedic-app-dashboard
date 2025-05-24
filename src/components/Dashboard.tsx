import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MetricCard } from './MetricCard';
import { RecentActivity } from './RecentActivity';
import { UserTable } from './UserTable';
import { DonationStats } from './DonationStats';
import { ConsultancyManager } from './ConsultancyManager';
import { ContentManager } from './ContentManager';
import { NotificationCenter } from './NotificationCenter';
import { AnalyticsOverview } from './AnalyticsOverview';
import { ReligiousTextManager } from './ReligiousTextManager';
import { OrganizationManager } from './OrganizationManager';
import { NewsManager } from './NewsManager';
import { PopupManager } from './PopupManager';
import { TempleManager } from './TempleManager';
import { YogaManager } from './YogaManager';
import { VastuManager } from './VastuManager';
import { APIKeyManager } from './APIKeyManager';
import { ReelsManager } from './ReelsManager';
import { AlertTriangle, Users, BookOpen, Building, Newspaper, MessageSquare, Headphones, FileText, Activity } from 'lucide-react';
import type { 
  Metric, 
  ActivityLog, 
  User, 
  Donation, 
  ConsultancyService,
  AnalyticsData 
} from '../types';

interface DashboardProps {
  activeSection: string;
}

export function Dashboard({ activeSection }: DashboardProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [consultancies, setConsultancies] = useState<ConsultancyService[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Fetch metrics from Firestore
    const fetchMetrics = async () => {
      const metricsRef = collection(db, 'metrics');
      const metricsSnap = await getDocs(metricsRef);
      const metricsData = metricsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Metric[];
      setMetrics(metricsData);
    };

    // Real-time listeners
    const unsubscribers = [
      // Users listener
      onSnapshot(collection(db, 'users'), (snapshot) => {
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(userData);
      }),

      // Activity listener
      onSnapshot(collection(db, 'activity'), (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ActivityLog[];
        setRecentActivity(activities);
      }),

      // Donations listener
      onSnapshot(collection(db, 'donations'), (snapshot) => {
        const donationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Donation[];
        setDonations(donationData);
      }),

      // Consultancies listener
      onSnapshot(collection(db, 'consultancies'), (snapshot) => {
        const consultancyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ConsultancyService[];
        setConsultancies(consultancyData);
      })
    ];

    fetchMetrics();

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

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
          <UserTable users={users.slice(0, 5)} />
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
      case 'yoga':
        return <YogaManager />;
      case 'vastu':
        return <VastuManager />;
      case 'temple':
        return <TempleManager />;
      case 'religious-texts':
        return <ReligiousTextManager />;
      case 'reels':
        return <ReelsManager />;
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
    <div className="flex-1 overflow-auto p-6">
      {renderContent()}
    </div>
  );
}