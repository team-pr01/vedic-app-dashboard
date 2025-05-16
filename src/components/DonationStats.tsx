import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { Donation, DonationProject } from '../types';

interface DonationStatsProps {
  donations: Donation[];
}

export function DonationStats({ donations }: DonationStatsProps) {
  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DonationProject[];
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const filteredDonations = selectedProject === 'all'
    ? donations
    : donations.filter(d => d.projectId === selectedProject);

  const totalDonations = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = filteredDonations.filter(d => d.status === 'completed');
  const averageDonation = completedDonations.length > 0
    ? completedDonations.reduce((sum, d) => sum + d.amount, 0) / completedDonations.length
    : 0;

  const getProjectProgress = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { percentage: 0, received: 0, required: 0 };

    const received = donations
      .filter(d => d.projectId === projectId && d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);

    return {
      percentage: (received / project.requiredAmount) * 100,
      received,
      required: project.requiredAmount
    };
  };

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Project
        </label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Donations</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ${totalDonations.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Average Donation</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                ${averageDonation.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {projects.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Progress</h3>
        <div className="space-y-4">
          {projects.map((project) => {
            const progress = getProjectProgress(project.id);
            return (
              <div key={project.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(project.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${progress.received.toLocaleString()} / ${progress.required.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {progress.percentage.toFixed(1)}% Complete
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Donations</h3>
        <div className="space-y-2">
          {filteredDonations.slice(0, 5).map((donation) => (
            <div
              key={donation.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {donation.projectName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  User {donation.userId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${donation.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(donation.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}