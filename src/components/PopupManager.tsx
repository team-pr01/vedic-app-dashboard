import React, { useState, useEffect } from 'react';
import { Upload, Image, Calendar, Bell, Trash2, Eye, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PopupNotification {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  display_frequency: 'once' | 'every_visit' | 'daily' | 'weekly';
  target_audience: string[];
  created_at: string;
  updated_at: string;
}

const defaultPopup: Partial<PopupNotification> = {
  title: '',
  content: '',
  display_frequency: 'once',
  target_audience: ['all'],
  is_active: true,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
};

export function PopupManager() {
  const [popups, setPopups] = useState<PopupNotification[]>([]);
  const [currentPopup, setCurrentPopup] = useState<Partial<PopupNotification>>(defaultPopup);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const { data, error } = await supabase
        .from('popup_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPopups(data || []);
    } catch (error) {
      console.error('Error fetching popups:', error);
      toast.error('Failed to load popups');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentPopup.id) {
        const { error } = await supabase
          .from('popup_notifications')
          .update({
            ...currentPopup,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPopup.id);

        if (error) throw error;
        toast.success('Popup updated successfully');
      } else {
        const { error } = await supabase
          .from('popup_notifications')
          .insert(currentPopup);

        if (error) throw error;
        toast.success('Popup created successfully');
      }

      setShowForm(false);
      setCurrentPopup(defaultPopup);
      setIsEditing(false);
      fetchPopups();
    } catch (error) {
      console.error('Error saving popup:', error);
      toast.error('Failed to save popup');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this popup?')) {
      try {
        const { error } = await supabase
          .from('popup_notifications')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Popup deleted successfully');
        fetchPopups();
      } catch (error) {
        console.error('Error deleting popup:', error);
        toast.error('Failed to delete popup');
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `popups/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const PopupPreview = ({ popup }: { popup: Partial<PopupNotification> }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
        {popup.image_url && (
          <img
            src={popup.image_url}
            alt={popup.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {popup.title || 'Popup Title'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {popup.content || 'Popup content goes here'}
          </p>
          {popup.button_text && popup.button_link && (
            <a
              href={popup.button_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {popup.button_text}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Popup Notifications
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setCurrentPopup(defaultPopup);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Bell className="h-4 w-4 mr-2" />
          Add Popup
        </button>
      </div>

      {/* Popups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popups.map((popup) => (
          <div
            key={popup.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {popup.image_url && (
              <img
                src={popup.image_url}
                alt={popup.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {popup.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    popup.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {popup.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPopup(popup);
                      setPreviewMode(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPopup(popup);
                      setIsEditing(true);
                      setShowForm(true);
                    }}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(popup.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {popup.content}
              </p>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(popup.start_date).toLocaleDateString()} - {new Date(popup.end_date).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {popup.target_audience.map((audience, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {audience}
                  </span>
                ))}
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
                  {isEditing ? 'Edit Popup' : 'Add New Popup'}
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
                    value={currentPopup.title}
                    onChange={(e) => setCurrentPopup({ ...currentPopup, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content
                  </label>
                  <textarea
                    value={currentPopup.content}
                    onChange={(e) => setCurrentPopup({ ...currentPopup, content: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={currentPopup.image_url}
                      onChange={(e) => setCurrentPopup({ ...currentPopup, image_url: e.target.value })}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://example.com/image.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleImageUpload(e.target.files[0]);
                          if (url) {
                            setCurrentPopup({ ...currentPopup, image_url: url });
                          }
                        }
                      }}
                      className="hidden"
                      id="popup-image-upload"
                    />
                    <label
                      htmlFor="popup-image-upload"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <Image className="h-4 w-4" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={currentPopup.button_text}
                      onChange={(e) => setCurrentPopup({ ...currentPopup, button_text: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Learn More"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Button Link
                    </label>
                    <input
                      type="url"
                      value={currentPopup.button_link}
                      onChange={(e) => setCurrentPopup({ ...currentPopup, button_link: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={currentPopup.start_date?.slice(0, 16)}
                      onChange={(e) => setCurrentPopup({ ...currentPopup, start_date: new Date(e.target.value).toISOString() })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={currentPopup.end_date?.slice(0, 16)}
                      onChange={(e) => setCurrentPopup({ ...currentPopup, end_date: new Date(e.target.value).toISOString() })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Frequency
                  </label>
                  <select
                    value={currentPopup.display_frequency}
                    onChange={(e) => setCurrentPopup({
                      ...currentPopup,
                      display_frequency: e.target.value as PopupNotification['display_frequency']
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="once">Once</option>
                    <option value="every_visit">Every Visit</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Audience
                  </label>
                  <select
                    multiple
                    value={currentPopup.target_audience}
                    onChange={(e) => setCurrentPopup({
                      ...currentPopup,
                      target_audience: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="all">All Users</option>
                    <option value="authenticated">Authenticated Users</option>
                    <option value="premium">Premium Users</option>
                    <option value="new">New Users</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={currentPopup.is_active}
                    onChange={(e) => setCurrentPopup({ ...currentPopup, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Preview
                </button>
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

      {/* Preview Modal */}
      {previewMode && (
        <>
          <PopupPreview popup={currentPopup} />
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setPreviewMode(false)}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-700 dark:text-gray-200"
            >
              Close Preview
            </button>
          </div>
        </>
      )}
    </div>
  );
}