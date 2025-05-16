import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Play, Pause, Clock, X } from 'lucide-react';

interface YogaAsana {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  imageUrl: string;
  videoUrl: string;
  contraindications: string[];
  category: string[];
}

const sampleAsanas: YogaAsana[] = [
  {
    id: '1',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    description: 'A standing pose that forms the foundation for all standing poses.',
    benefits: ['Improves posture', 'Strengthens thighs, knees, and ankles', 'Firms abdomen and buttocks'],
    difficulty: 'beginner',
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80',
    videoUrl: 'https://player.vimeo.com/video/252333618',
    category: ['standing', 'foundation'],
    contraindications: ['High blood pressure', 'Headache']
  },
  {
    id: '2',
    name: 'Tree Pose',
    sanskritName: 'Vrksasana',
    description: 'A standing balance pose that improves focus and concentration.',
    benefits: ['Improves balance', 'Strengthens legs and core', 'Increases focus'],
    difficulty: 'intermediate',
    duration: 120,
    imageUrl: 'https://images.unsplash.com/photo-1552286450-4a669f880062?auto=format&fit=crop&w=1000&q=80',
    videoUrl: 'https://player.vimeo.com/video/252333987',
    category: ['standing', 'balance'],
    contraindications: ['Knee injuries', 'Ankle problems']
  }
];

export function YogaManager() {
  const [asanas, setAsanas] = useState<YogaAsana[]>(sampleAsanas);
  const [showForm, setShowForm] = useState(false);
  const [selectedAsana, setSelectedAsana] = useState<YogaAsana | null>(null);
  const [newAsana, setNewAsana] = useState<Partial<YogaAsana>>({
    difficulty: 'beginner',
    benefits: [],
    contraindications: [],
    category: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsana) {
      // Edit existing asana
      setAsanas(asanas.map(asana => 
        asana.id === selectedAsana.id 
          ? { ...selectedAsana, ...newAsana } as YogaAsana
          : asana
      ));
    } else {
      // Add new asana
      const asana: YogaAsana = {
        id: Math.random().toString(36).substr(2, 9),
        name: newAsana.name || '',
        sanskritName: newAsana.sanskritName || '',
        description: newAsana.description || '',
        benefits: newAsana.benefits || [],
        difficulty: newAsana.difficulty || 'beginner',
        duration: newAsana.duration || 60,
        imageUrl: newAsana.imageUrl || '',
        videoUrl: newAsana.videoUrl || '',
        contraindications: newAsana.contraindications || [],
        category: newAsana.category || []
      };
      setAsanas([...asanas, asana]);
    }
    setShowForm(false);
    setSelectedAsana(null);
    setNewAsana({
      difficulty: 'beginner',
      benefits: [],
      contraindications: [],
      category: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yoga Asanas Management
        </h2>
        <button
          onClick={() => {
            setSelectedAsana(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Asana
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asanas.map((asana) => (
          <div
            key={asana.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            {asana.videoUrl ? (
              <div className="relative w-full h-48">
                <iframe
                  src={asana.videoUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={asana.imageUrl}
                alt={asana.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {asana.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {asana.sanskritName}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  asana.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : asana.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {asana.difficulty}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {asana.description}
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Benefits:</h4>
                <ul className="mt-2 space-y-1">
                  {asana.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor(asana.duration / 60)}m {asana.duration % 60}s
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {asana.category.map((cat, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedAsana(asana);
                    setNewAsana(asana);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setAsanas(asanas.filter(a => a.id !== asana.id));
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedAsana ? 'Edit Asana' : 'Add New Asana'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newAsana.name || ''}
                    onChange={(e) => setNewAsana({ ...newAsana, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sanskrit Name
                  </label>
                  <input
                    type="text"
                    value={newAsana.sanskritName || ''}
                    onChange={(e) => setNewAsana({ ...newAsana, sanskritName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={newAsana.description || ''}
                    onChange={(e) => setNewAsana({ ...newAsana, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newAsana.imageUrl || ''}
                    onChange={(e) => setNewAsana({ ...newAsana, imageUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Video URL (Vimeo/YouTube)
                  </label>
                  <input
                    type="url"
                    value={newAsana.videoUrl || ''}
                    onChange={(e) => setNewAsana({ ...newAsana, videoUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Difficulty
                  </label>
                  <select
                    value={newAsana.difficulty || 'beginner'}
                    onChange={(e) => setNewAsana({ 
                      ...newAsana, 
                      difficulty: e.target.value as YogaAsana['difficulty']
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={newAsana.duration || ''}
                    onChange={(e) => setNewAsana({ 
                      ...newAsana, 
                      duration: parseInt(e.target.value) 
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Benefits (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newAsana.benefits?.join(', ') || ''}
                    onChange={(e) => setNewAsana({
                      ...newAsana,
                      benefits: e.target.value.split(',').map(b => b.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraindications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newAsana.contraindications?.join(', ') || ''}
                    onChange={(e) => setNewAsana({
                      ...newAsana,
                      contraindications: e.target.value.split(',').map(c => c.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newAsana.category?.join(', ') || ''}
                    onChange={(e) => setNewAsana({
                      ...newAsana,
                      category: e.target.value.split(',').map(c => c.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
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
                  {selectedAsana ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}