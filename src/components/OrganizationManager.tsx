import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Phone, Globe, Mail, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Organization {
  id: string;
  name: string;
  type: 'gurukul' | 'vedic_institution' | 'ashram';
  description: string;
  established_year: number;
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  head_teacher: string;
  student_capacity: number;
  courses_offered: string[];
  facilities: string[];
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const defaultOrganization: Partial<Organization> = {
  name: '',
  type: 'gurukul',
  description: '',
  established_year: new Date().getFullYear(),
  contact: {
    email: '',
    phone: '',
    website: ''
  },
  address: {
    street: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  },
  head_teacher: '',
  student_capacity: 0,
  courses_offered: [],
  facilities: [],
  is_active: true
};

export function OrganizationManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<Partial<Organization>>(defaultOrganization);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'gurukul' | 'vedic_institution' | 'ashram'>('all');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to load organizations');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentOrg.id) {
        const { error } = await supabase
          .from('organizations')
          .update({
            ...currentOrg,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentOrg.id);

        if (error) throw error;
        toast.success('Organization updated successfully');
      } else {
        const { error } = await supabase
          .from('organizations')
          .insert({
            ...currentOrg,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success('Organization added successfully');
      }

      setShowForm(false);
      setCurrentOrg(defaultOrganization);
      setIsEditing(false);
      fetchOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      toast.error('Failed to save organization');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        const { error } = await supabase
          .from('organizations')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Organization deleted successfully');
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast.error('Failed to delete organization');
      }
    }
  };

  const handleEdit = (org: Organization) => {
    setCurrentOrg(org);
    setIsEditing(true);
    setShowForm(true);
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || org.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Organizations
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setCurrentOrg(defaultOrganization);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Types</option>
          <option value="gurukul">Gurukul</option>
          <option value="vedic_institution">Vedic Institution</option>
          <option value="ashram">Ashram</option>
        </select>
      </div>

      {/* Organization List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <div
            key={org.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {org.image_url && (
              <img
                src={org.image_url}
                alt={org.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {org.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                    {org.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(org)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {org.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {org.address.city}, {org.address.country}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {org.contact.phone}
                </div>
                {org.contact.website && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    <a
                      href={org.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Courses Offered:
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {org.courses_offered.map((course, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {course}
                    </span>
                  ))}
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
                  {isEditing ? 'Edit Organization' : 'Add New Organization'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={currentOrg.name}
                    onChange={(e) => setCurrentOrg({ ...currentOrg, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <select
                    value={currentOrg.type}
                    onChange={(e) => setCurrentOrg({ ...currentOrg, type: e.target.value as Organization['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="gurukul">Gurukul</option>
                    <option value="vedic_institution">Vedic Institution</option>
                    <option value="ashram">Ashram</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={currentOrg.description}
                    onChange={(e) => setCurrentOrg({ ...currentOrg, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Head Teacher
                  </label>
                  <input
                    type="text"
                    value={currentOrg.head_teacher}
                    onChange={(e) => setCurrentOrg({ ...currentOrg, head_teacher: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    value={currentOrg.student_capacity}
                    onChange={(e) => setCurrentOrg({ ...currentOrg, student_capacity: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Courses Offered (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={currentOrg.courses_offered?.join(', ')}
                    onChange={(e) => setCurrentOrg({
                      ...currentOrg,
                      courses_offered: e.target.value.split(',').map(s => s.trim())
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Vedic Mathematics, Sanskrit, Yoga..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="email"
                        value={currentOrg.contact?.email}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          contact: { ...currentOrg.contact, email: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={currentOrg.contact?.phone}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          contact: { ...currentOrg.contact, phone: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Phone"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={currentOrg.contact?.website}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          contact: { ...currentOrg.contact, website: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Website"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={currentOrg.address?.street}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          address: { ...currentOrg.address, street: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Street Address"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={currentOrg.address?.city}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          address: { ...currentOrg.address, city: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={currentOrg.address?.state}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          address: { ...currentOrg.address, state: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={currentOrg.address?.postal_code}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          address: { ...currentOrg.address, postal_code: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Postal Code"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={currentOrg.address?.country}
                        onChange={(e) => setCurrentOrg({
                          ...currentOrg,
                          address: { ...currentOrg.address, country: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
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