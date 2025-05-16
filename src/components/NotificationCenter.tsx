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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bell className="h-6 w-6 mr-2 text-blue-500" />
          Notification Center
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4 mr-2" />
          New Notification
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="all">All Notifications</option>
          <option value="scheduled">Scheduled</option>
          <option value="sent">Sent</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {notification.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  notification.status === 'scheduled'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : notification.status === 'sent'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {notification.status.toUpperCase()}
                </span>
              </div>
              <div className="flex space-x-2">
                {notification.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancel(notification.id)}
                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {notification.message}
            </p>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(notification.scheduled_for).toLocaleString()}
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {notification.type}
              </span>
              {notification.sent_at && (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Sent: {new Date(notification.sent_at).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

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