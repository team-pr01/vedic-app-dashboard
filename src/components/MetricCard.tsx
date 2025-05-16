import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const isPositive = metric.trend === 'up';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.name}</h3>
        {isPositive ? (
          <ArrowUpRight className="w-5 h-5 text-green-500" />
        ) : (
          <ArrowDownRight className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {typeof metric.value === 'number' && metric.name.toLowerCase().includes('rate')
            ? `${metric.value}%`
            : metric.value.toLocaleString()}
        </p>
        <span
          className={`ml-2 text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}{metric.change}%
        </span>
      </div>
    </div>
  );
}