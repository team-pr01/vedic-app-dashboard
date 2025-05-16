import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Compass, Home as HomeIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface VastuPrinciple {
  id: string;
  title: string;
  description: string;
  category: string;
  direction: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest' | 'center';
  recommendations: string[];
  imageUrl: string;
  importance: 'high' | 'medium' | 'low';
}

const samplePrinciples: VastuPrinciple[] = [
  {
    id: '1',
    title: 'Main Entrance',
    description: 'The main entrance is one of the most important elements in Vastu Shastra as it is the primary source of energy entering the house.',
    category: 'entrance',
    direction: 'north',
    recommendations: [
      'Should face North or East',
      'Avoid South-West entrance',
      'Keep entrance well-lit',
      'Ensure door opens clockwise'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555443805-658637491dd4?auto=format&fit=crop&w=1000&q=80',
    importance: 'high'
  },
  {
    id: '2',
    title: 'Kitchen Placement',
    description: 'The kitchen is associated with the fire element and its placement affects the health and prosperity of the household.',
    category: 'kitchen',
    direction: 'southeast',
    recommendations: [
      'Southeast corner is ideal',
      'Cooking facing East',
      'Avoid North-East location',
      'Keep water sources away'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80',
    importance: 'high'
  }
];

const DIRECTIONS = [
  'north',
  'south',
  'east',
  'west',
  'northeast',
  'northwest',
  'southeast',
  'southwest',
  'center'
] as const;

const CATEGORIES = [
  'entrance',
  'kitchen',
  'bedroom',
  'bathroom',
  'living room',
  'study room',
  'pooja room',
  'balcony',
  'garden'
] as const;

export function VastuManager() {
  const [principles, setPrinciples] = useState<VastuPrinciple[]>(samplePrinciples);
  const [showForm, setShowForm] = useState(false);
  const [selectedPrinciple, setSelectedPrinciple] = useState<VastuPrinciple | null>(null);
  const [newPrinciple, setNewPrinciple] = useState<Partial<VastuPrinciple>>({
    importance: 'medium',
    recommendations: [],
    direction: 'north'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPrinciple) {
      // Update existing principle
      setPrinciples(principles.map(principle => 
        principle.id === selectedPrinciple.id 
          ? { ...selectedPrinciple, ...newPrinciple } as VastuPrinciple
          : principle
      ));
      toast.success('Vastu principle updated successfully');
    } else {
      // Add new principle
      const principle: VastuPrinciple = {
        id: Math.random().toString(36).substr(2, 9),
        title: newPrinciple.title || '',
        description: newPrinciple.description || '',
        category: newPrinciple.category || '',
        direction: newPrinciple.direction || 'north',
        recommendations: newPrinciple.recommendations || [],
        imageUrl: newPrinciple.imageUrl || '',
        importance: newPrinciple.importance || 'medium'
      };
      setPrinciples([...principles, principle]);
      toast.success('New Vastu principle added successfully');
    }

    setShowForm(false);
    setSelectedPrinciple(null);
    setNewPrinciple({
      importance: 'medium',
      recommendations: [],
      direction: 'north'
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Vastu principle?')) {
      setPrinciples(principles.filter(p => p.id !== id));
      toast.success('Vastu principle deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vastu Shastra Principles
        </h2>
        <button
          onClick={() => {
            setSelectedPrinciple(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Principle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((principle) => (
          <div
            key={principle.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <img
              src={principle.imageUrl}
              alt={principle.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {principle.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Compass className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {principle.direction}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  principle.importance === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : principle.importance === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {principle.importance} priority
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {principle.description}
              </p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Recommendations:
                </h4>
                <ul className="mt-2 space-y-1">
                  {principle.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <HomeIcon className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {principle.category}
                </span>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedPrinciple(principle);
                    setNewPrinciple(principle);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(principle.id)}
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
                  {selectedPrinciple ? 'Edit Vastu Principle' : 'Add New Vastu Principle'}
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPrinciple.title || ''}
                    onChange={(e) => setNewPrinciple({ ...newPrinciple, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={newPrinciple.description || ''}
                    onChange={(e) => setNewPrinciple({ ...newPrinciple, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={newPrinciple.category || ''}
                    onChange={(e) => setNewPrinciple({ ...newPrinciple, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Direction
                  </label>
                  <select
                    value={newPrinciple.direction || 'north'}
                    onChange={(e) => setNewPrinciple({ 
                      ...newPrinciple, 
                      direction: e.target.value as VastuPrinciple['direction']
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    {DIRECTIONS.map((direction) => (
                      <option key={direction} value={direction}>
                        {direction.charAt(0).toUpperCase() + direction.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newPrinciple.imageUrl || ''}
                    onChange={(e) => setNewPrinciple({ ...newPrinciple, imageUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recommendations (one per line)
                  </label>
                  <textarea
                    value={newPrinciple.recommendations?.join('\n') || ''}
                    onChange={(e) => setNewPrinciple({
                      ...newPrinciple,
                      recommendations: e.target.value.split('\n').filter(r => r.trim())
                    })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter each recommendation on a new line"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Importance
                  </label>
                  <select
                    value={newPrinciple.importance || 'medium'}
                    onChange={(e) => setNewPrinciple({ 
                      ...newPrinciple, 
                      importance: e.target.value as VastuPrinciple['importance']
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
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
                  {selectedPrinciple ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}