import React from 'react';
import { LayoutDashboard, Users, BarChart2, Settings, Activity, HelpCircle, Bell, Sun, Moon, BookOpen, Headphones, FileText, Building, LandPlot, Newspaper, MessageSquarePlus, AlertTriangle, BellRing, Bot as Lotus, Home, Key, Film } from 'lucide-react';

interface SidebarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ isDarkMode, toggleDarkMode, activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: AlertTriangle, label: 'Emergency', id: 'emergency' },
    { icon: Users, label: 'Users', id: 'users' },
    { icon: BookOpen, label: 'Religious Texts', id: 'religious-texts' },
    { icon: Film, label: 'Reels', id: 'reels' },
    { icon: Lotus, label: 'Yoga', id: 'yoga' },
    { icon: Home, label: 'Vastu', id: 'vastu' },
    { icon: LandPlot, label: 'Temple Management', id: 'temple' },
    { icon: Building, label: 'Organization', id: 'organization' },
    { icon: Newspaper, label: 'News', id: 'news' },
    { icon: BellRing, label: 'Notifications', id: 'notifications' },
    { icon: MessageSquarePlus, label: 'Popups', id: 'popups' },
    { icon: Headphones, label: 'Consultancy Service', id: 'consultancy' },
    { icon: FileText, label: 'Content Management', id: 'content' },
    { icon: Key, label: 'API Keys', id: 'api-keys' },
    { icon: BarChart2, label: 'Analytics', id: 'analytics' },
    { icon: Activity, label: 'Activity', id: 'activity' },
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: HelpCircle, label: 'Help', id: 'help' },
  ];

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <button 
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
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