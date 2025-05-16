import React from 'react';
import { Users, Clock, Globe, BarChart2 } from 'lucide-react';
import type { AnalyticsData } from '../types';

interface AnalyticsOverviewProps {
  data: AnalyticsData | null;
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  if (!data) return null;

  const topCountries = Object.entries(data.countryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {data.totalUsers.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {data.activeUsers} active now
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Session Time</h3>
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.floor(data.averageSessionDuration / 60)}m {data.averageSessionDuration % 60}s
          </p>
          <p className="text-sm text-gray-500">
            Per user session
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User Retention</h3>
            <BarChart2 className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {data.userRetention}%
          </p>
          <p className="text-sm text-gray-500">
            30-day retention rate
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Country</h3>
            <Globe className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {topCountries[0]?.[0] || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            {topCountries[0]?.[1].toLocaleString()} users
          </p>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Geographic Distribution
        </h3>
        <div className="space-y-4">
          {topCountries.map(([country, users]) => (
            <div key={country} className="flex items-center">
              <div className="w-32 text-sm text-gray-600 dark:text-gray-400">{country}</div>
              <div className="flex-1">
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500"
                    style={{
                      width: `${(users / data.totalUsers) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="w-24 text-right text-sm text-gray-600 dark:text-gray-400">
                {users.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Views */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Most Viewed Pages
        </h3>
        <div className="space-y-4">
          {Object.entries(data.pageViews)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([page, views]) => (
              <div key={page} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{page}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {views.toLocaleString()} views
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}