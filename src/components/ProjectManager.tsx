import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Globe, Lock, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  is_public: boolean;
  start_date: string;
  end_date: string | null;
  budget: number;
  team_members: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    status: 'active',
    is_public: false,
    start_date: new Date().toISOString().split('T')[0],
    budget: 0,
    team_members: [],
    tags: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentProject.id) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...currentProject,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentProject.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...currentProject,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success('Project created successfully');
      }

      setShowForm(false);
      setCurrentProject({
        title: '',
        description: '',
        status: 'active',
        is_public: false,
        start_date: new Date().toISOString().split('T')[0],
        budget: 0,
        team_members: [],
        tags: []
      });
      setIsEditing(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const togglePublicStatus = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          is_public: !project.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;
      toast.success(`Project is now ${!project.is_public ? 'public' : 'private'}`);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project visibility:', error);
      toast.error('Failed to update project visibility');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setCurrentProject({
              title: '',
              description: '',
              status: 'active',
              is_public: false,
              start_date: new Date().toISOString().split('T')[0],
              budget: 0,
              team_members: [],
              tags: []
            });
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => togglePublicStatus(project)}
                    className={`text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200`}
                    title={project.is_public ? 'Make Private' : 'Make Public'}
                  >
                    {project.is_public ? (
                      <Globe className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentProject(project);
                      setIsEditing(true);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Budget: ${project.budget.toLocaleString()}</span>
                  <span>{new Date(project.start_date).toLocaleDateString()}</span>
                </div>
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
                  {isEditing ? 'Edit Project' : 'New Project'}
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
                    value={currentProject.title}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={currentProject.status}
                      onChange={(e) => setCurrentProject({
                        ...currentProject,
                        status: e.target.value as Project['status']
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Budget
                    </label>
                    <input
                      type="number"
                      value={currentProject.budget}
                      onChange={(e) => setCurrentProject({
                        ...currentProject,
                        budget: parseFloat(e.target.value)
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={currentProject.start_date}
                      onChange={(e) => setCurrentProject({
                        ...currentProject,
                        start_date: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={currentProject.end_date || ''}
                      onChange={(e) => setCurrentProject({
                        ...currentProject,
                        end_date: e.target.value || null
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Members (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    value={currentProject.team_members?.join(', ')}
                    onChange={(e) => setCurrentProject({
                      ...currentProject,
                      team_members: e.target.value.split(',').map(email => email.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="john@example.com, jane@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={currentProject.tags?.join(', ')}
                    onChange={(e) => setCurrentProject({
                      ...currentProject,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="design, development, marketing"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={currentProject.is_public}
                    onChange={(e) => setCurrentProject({
                      ...currentProject,
                      is_public: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_public"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Make this project public
                  </label>
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
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}