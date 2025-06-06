import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Calendar, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'all' | 'subscribers' | 'specific';
  target_users: string[];
  scheduled_for: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  sent_at: string | null;
  created_by: string;
  created_at: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'all' as const,
    scheduled_for: new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16) // 5 minutes from now
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notifications')
        .insert({
          ...newNotification,
          created_by: userData.user.id,
          status: 'scheduled'
        });

      if (error) throw error;

      toast.success('Notification scheduled successfully');
      setShowForm(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'all',
        scheduled_for: new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast.error('Failed to schedule notification');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('Notification cancelled');
      fetchNotifications();
    } catch (error) {
      console.error('Error cancelling notification:', error);
      toast.error('Failed to cancel notification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="space-y-6">

      {/* New Notification Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  New Notification
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
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Audience
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({
                      ...newNotification,
                      type: e.target.value as Notification['type']
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="all">All Users</option>
                    <option value="subscribers">Subscribers Only</option>
                    <option value="specific">Specific Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Schedule For
                  </label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduled_for}
                    onChange={(e) => setNewNotification({
                      ...newNotification,
                      scheduled_for: e.target.value
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Schedule Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}