import React, { useState } from 'react';
import { Save, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Mantra } from '../types';

interface MantraEditorProps {
  mantra: Mantra;
  onClose: () => void;
}

export function MantraEditor({ mantra, onClose }: MantraEditorProps) {
  const [editedMantra, setEditedMantra] = useState(mantra);
  const [selectedLanguage, setSelectedLanguage] = useState(Object.keys(mantra.translations)[0] || 'sanskrit');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'mantras', mantra.id), {
        ...editedMantra,
        updatedAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error updating mantra:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this mantra?')) {
      try {
        await deleteDoc(doc(db, 'mantras', mantra.id));
        onClose();
      } catch (error) {
        console.error('Error deleting mantra:', error);
      }
    }
  };

  const generateTranslation = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/translate-mantra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editedMantra.originalText,
          targetLanguage: selectedLanguage
        })
      });
      
      const translation = await response.json();
      
      setEditedMantra({
        ...editedMantra,
        translations: {
          ...editedMantra.translations,
          [selectedLanguage]: {
            text: translation.text,
            isAIGenerated: true,
            lastUpdated: new Date().toISOString(),
            updatedBy: 'AI'
          }
        }
      });
    } catch (error) {
      console.error('Error generating translation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Original Text
        </label>
        <textarea
          value={editedMantra.originalText}
          onChange={(e) => setEditedMantra({ ...editedMantra, originalText: e.target.value })}
          className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Translations
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="sanskrit">Sanskrit</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
            <option value="kannada">Kannada</option>
            <option value="malayalam">Malayalam</option>
            <option value="bengali">Bengali</option>
            <option value="gujarati">Gujarati</option>
            <option value="marathi">Marathi</option>
          </select>
        </div>

        <div className="space-y-4">
          {Object.entries(editedMantra.translations).map(([language, translation]) => (
            <div key={language} className="relative">
              <textarea
                value={translation.text}
                onChange={(e) => setEditedMantra({
                  ...editedMantra,
                  translations: {
                    ...editedMantra.translations,
                    [language]: {
                      ...translation,
                      text: e.target.value,
                      lastUpdated: new Date().toISOString(),
                      updatedBy: 'Admin'
                    }
                  }
                })}
                className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {translation.isAIGenerated && (
                <span className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                  AI Generated
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={generateTranslation}
          disabled={isGenerating}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          Generate Translation
        </button>
      </div>

      {editedMantra.reports.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            Reported Issues
          </h4>
          <div className="space-y-2">
            {editedMantra.reports.map((report) => (
              <div
                key={report.id}
                className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded"
              >
                <p className="font-medium">{report.language} - {report.reason}</p>
                <p>{report.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}