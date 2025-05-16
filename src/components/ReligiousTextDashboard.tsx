import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MantraStats } from './MantraStats';
import { MantraEditor } from './MantraEditor';
import { ReligiousTextManager } from './ReligiousTextManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Mantra, MantraStats as MantraStatsType } from '../types';

export function ReligiousTextDashboard() {
  const [stats, setStats] = useState<MantraStatsType>({
    totalMantras: 0,
    totalTranslations: 0,
    languageDistribution: {},
    reportedMantras: 0,
    aiGeneratedCount: 0,
    mostViewedMantras: []
  });
  const [reportedMantras, setReportedMantras] = useState<Mantra[]>([]);
  const [selectedMantra, setSelectedMantra] = useState<Mantra | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Listen for mantras with reports
    const reportedMantrasQuery = query(
      collection(db, 'mantras'),
      where('reports', '!=', [])
    );

    const unsubscribeReported = onSnapshot(reportedMantrasQuery, (snapshot) => {
      const mantras = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Mantra[];
      setReportedMantras(mantras);
    });

    // Listen for all mantras to calculate stats
    const unsubscribeAll = onSnapshot(collection(db, 'mantras'), (snapshot) => {
      const mantras = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Mantra[];

      const languageDistribution: { [key: string]: number } = {};
      let totalTranslations = 0;
      let aiGeneratedCount = 0;

      mantras.forEach(mantra => {
        Object.entries(mantra.translations).forEach(([language, translation]) => {
          languageDistribution[language] = (languageDistribution[language] || 0) + 1;
          totalTranslations++;
          if (translation.isAIGenerated) {
            aiGeneratedCount++;
          }
        });
      });

      setStats({
        totalMantras: mantras.length,
        totalTranslations,
        languageDistribution,
        reportedMantras: reportedMantras.length,
        aiGeneratedCount,
        mostViewedMantras: mantras
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
          .map(m => ({
            id: m.id,
            text: m.originalText,
            views: m.views
          }))
      });
    });

    return () => {
      unsubscribeReported();
      unsubscribeAll();
    };
  }, [reportedMantras.length]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Religious Texts Management
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="manage">Manage Texts</TabsTrigger>
              <TabsTrigger value="reported">Reported Mantras</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <MantraStats stats={stats} />
            </TabsContent>

            <TabsContent value="manage">
              <ReligiousTextManager />
            </TabsContent>

            <TabsContent value="reported">
              {selectedMantra ? (
                <MantraEditor
                  mantra={selectedMantra}
                  onClose={() => setSelectedMantra(null)}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Reported Mantras
                  </h3>
                  {reportedMantras.map((mantra) => (
                    <div
                      key={mantra.id}
                      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setSelectedMantra(mantra)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {mantra.originalText.substring(0, 100)}...
                          </p>
                          <p className="text-sm text-gray-500">
                            {mantra.reports.length} reports • Last updated: {new Date(mantra.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {Object.keys(mantra.translations).length} translations
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {mantra.reports.map((report) => (
                          <span
                            key={report.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          >
                            {report.language}: {report.reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}