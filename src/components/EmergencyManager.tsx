import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Bell, Users, Search, Trash2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useGetAllEmergenciesQuery } from '../redux/Features/Emergencies/emergencyApi';

interface EmergencyMessage {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  target_groups: string[];
  status: 'active' | 'resolved' | 'archived';
  sent_at: string;
  resolved_at?: string;
  sent_by: string;
  acknowledgments: string[];
}

export function EmergencyManager() {
  const {data} = useGetAllEmergenciesQuery({});
  console.log(data);
  const [messages, setMessages] = useState<EmergencyMessage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState({
    title: '',
    message: '',
    severity: 'high' as const,
    target_groups: ['all'],
    status: 'active' as const
  });

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_messages')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load emergency messages');
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('emergency_messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'emergency_messages' 
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('emergency_messages')
        .insert({
          ...newMessage,
          sent_by: userData.user.id,
          sent_at: new Date().toISOString(),
          acknowledgments: []
        });

      if (error) throw error;

      toast.success('Emergency message sent successfully');
      setShowForm(false);
      setNewMessage({
        title: '',
        message: '',
        severity: 'high',
        target_groups: ['all'],
        status: 'active'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send emergency message');
    }
  };

  const handleResolve = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('emergency_messages')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;
      toast.success('Message marked as resolved');
    } catch (error) {
      console.error('Error resolving message:', error);
      toast.error('Failed to resolve message');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('emergency_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter;
    const matchesSearch = message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
          Emergency Messages
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Send className="h-4 w-4 mr-2" />
          New Emergency Message
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {message.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(message.severity)}`}>
                    {message.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {message.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {message.message}
                </p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Bell className="h-4 w-4 mr-1" />
                    {new Date(message.sent_at).toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {message.target_groups.join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {message.status === 'active' && (
                  <button
                    onClick={() => handleResolve(message.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(message.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Message Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  New Emergency Message
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
                    value={newMessage.title}
                    onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Severity
                  </label>
                  <select
                    value={newMessage.severity}
                    onChange={(e) => setNewMessage({
                      ...newMessage,
                      severity: e.target.value as EmergencyMessage['severity']
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Groups
                  </label>
                  <select
                    multiple
                    value={newMessage.target_groups}
                    onChange={(e) => setNewMessage({
                      ...newMessage,
                      target_groups: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="all">All Users</option>
                    <option value="staff">Staff</option>
                    <option value="volunteers">Volunteers</option>
                    <option value="members">Members</option>
                    <option value="visitors">Visitors</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple groups</p>
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
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Send Emergency Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}