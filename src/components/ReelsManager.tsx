import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Video, Youtube, Link as LinkIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface Reel {
  id: string;
  title: string;
  description: string;
  url: string;
  source: 'youtube' | 'vimeo' | 'other';
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const SAMPLE_REELS: Reel[] = [
  {
    id: '1',
    title: 'Introduction to Vedic Meditation',
    description: 'Learn the basics of Vedic meditation techniques and their benefits.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    source: 'youtube',
    category: 'meditation',
    tags: ['meditation', 'beginners', 'vedic'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Understanding Vedic Rituals',
    description: 'A comprehensive guide to common Vedic rituals and their significance.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    source: 'youtube',
    category: 'rituals',
    tags: ['rituals', 'traditions', 'vedic'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function ReelsManager() {
  const [reels, setReels] = useState<Reel[]>(SAMPLE_REELS);
  const [showForm, setShowForm] = useState(false);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [newReel, setNewReel] = useState<Partial<Reel>>({
    source: 'youtube',
    tags: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedReel) {
      // Update existing reel
      setReels(reels.map(reel => 
        reel.id === selectedReel.id 
          ? { ...selectedReel, ...newReel, updated_at: new Date().toISOString() } as Reel
          : reel
      ));
      toast.success('Reel updated successfully');
    } else {
      // Add new reel
      const reel: Reel = {
        id: Math.random().toString(36).substr(2, 9),
        title: newReel.title || '',
        description: newReel.description || '',
        url: newReel.url || '',
        source: newReel.source || 'youtube',
        category: newReel.category || '',
        tags: newReel.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setReels([...reels, reel]);
      toast.success('Reel added successfully');
    }

    setShowForm(false);
    setSelectedReel(null);
    setNewReel({ source: 'youtube', tags: [] });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reel?')) {
      setReels(reels.filter(reel => reel.id !== id));
      toast.success('Reel deleted successfully');
    }
  };

  const getEmbedUrl = (url: string, source: string) => {
    if (source === 'youtube') {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Video className="h-6 w-6 mr-2 text-blue-500" />
          Video Reels
        </h2>
        <button
          onClick={() => {
            setSelectedReel(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Reel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(reel.url, reel.source)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {reel.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                    {reel.source}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReel(reel);
                      setNewReel(reel);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {reel.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {reel.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Added {new Date(reel.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedReel ? 'Edit Reel' : 'Add New Reel'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newReel.title || ''}
                    onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={newReel.description || ''}
                    onChange={(e) => setNewReel({ ...newReel, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Video Source
                  </label>
                  <select
                    value={newReel.source || 'youtube'}
                    onChange={(e) => setNewReel({
                      ...newReel,
                      source: e.target.value as 'youtube' | 'vimeo' | 'other'
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Video URL
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                      <LinkIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="url"
                      value={newReel.url || ''}
                      onChange={(e) => setNewReel({ ...newReel, url: e.target.value })}
                      className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newReel.category || ''}
                    onChange={(e) => setNewReel({ ...newReel, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newReel.tags?.join(', ') || ''}
                    onChange={(e) => setNewReel({
                      ...newReel,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="meditation, vedic, tutorial"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedReel ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}