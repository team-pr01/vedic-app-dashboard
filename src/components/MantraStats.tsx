import React from 'react';
import { BarChart2, AlertTriangle, Eye, Languages } from 'lucide-react';
import type { MantraStats } from '../types';

interface MantraStatsProps {
  stats: MantraStats;
}

export function MantraStats({ stats }: MantraStatsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mantras</h3>
            <BarChart2 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.totalMantras.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {stats.totalTranslations} translations
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported Mantras</h3>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.reportedMantras}
          </p>
          <p className="text-sm text-gray-500">
            Require attention
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Generated</h3>
            <Languages className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.aiGeneratedCount}
          </p>
          <p className="text-sm text-gray-500">
            Translations
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Viewed</h3>
            <Eye className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.mostViewedMantras[0]?.views.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500">
            Views on top mantra
          </p>
        </div>
      </div>

      {/* Language Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Language Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(stats.languageDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([language, count]) => (
              <div key={language} className="flex items-center">
                <div className="w-32 text-sm text-gray-600 dark:text-gray-400">{language}</div>
                <div className="flex-1">
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-blue-500"
                      style={{
                        width: `${(count / stats.totalTranslations) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-24 text-right text-sm text-gray-600 dark:text-gray-400">
                  {count.toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Most Viewed Mantras */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Most Viewed Mantras
        </h3>
        <div className="space-y-4">
          {stats.mostViewedMantras.map((mantra) => (
            <div key={mantra.id} className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-lg">
                {mantra.text}
              </p>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {mantra.views.toLocaleString()} views
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}