import React, { useState } from 'react';
import { Users, Star, DollarSign } from 'lucide-react';
import type { ConsultancyService, Consultant } from '../types';

interface ConsultancyManagerProps {
  consultancies: ConsultancyService[];
}

export function ConsultancyManager({ consultancies }: ConsultancyManagerProps) {
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);

  const totalRevenue = consultancies
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.amount, 0);

  const averageRating = consultancies
    .filter(c => c.rating !== undefined)
    .reduce((sum, c) => sum + (c.rating || 0), 0) / consultancies.length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {averageRating.toFixed(1)} ⭐
              </p>
            </div>
            <Star className="h-8 w-8 text-amber-500 dark:text-amber-400" />
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Total Sessions</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {consultancies.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Recent Consultations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Consultations</h3>
        <div className="space-y-4">
          {consultancies.slice(0, 5).map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {consultation.serviceType}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Consultant: {consultation.consultantId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${consultation.amount}
                  </p>
                  {consultation.rating && (
                    <p className="text-xs text-amber-500">
                      {'★'.repeat(consultation.rating)}
                      {'☆'.repeat(5 - consultation.rating)}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    consultation.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : consultation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}