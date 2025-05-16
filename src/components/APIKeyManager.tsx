import React, { useState } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Check, Brain, Code } from 'lucide-react';
import toast from 'react-hot-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  service: 'OpenAI' | 'Google Cloud' | 'DeepSeek' | 'Grok' | 'Other';
  model?: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'inactive';
  usage_count?: number;
  rate_limit?: number;
}

const AI_SERVICES = [
  { 
    name: 'DeepSeek', 
    models: [
      'deepseek-chat',
      'deepseek-coder',
      'deepseek-math',
      'deepseek-vision'
    ]
  },
  { 
    name: 'Grok', 
    models: [
      'grok-1',
      'grok-vision',
      'grok-code'
    ]
  },
  { 
    name: 'OpenAI',
    models: [
      'gpt-4',
      'gpt-3.5-turbo'
    ]
  },
  { 
    name: 'Google Cloud',
    models: [
      'gemini-pro',
      'gemini-vision'
    ]
  }
];

const sampleKeys: APIKey[] = [
  {
    id: '1',
    name: 'DeepSeek Production',
    key: 'dsk_1234567890abcdef',
    service: 'DeepSeek',
    model: 'deepseek-chat',
    created_at: new Date().toISOString(),
    status: 'active',
    usage_count: 150,
    rate_limit: 1000
  },
  {
    id: '2',
    name: 'Grok API',
    key: 'grk_ABC123DEF456',
    service: 'Grok',
    model: 'grok-1',
    created_at: new Date().toISOString(),
    status: 'active',
    usage_count: 75,
    rate_limit: 500
  }
];

export function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(sampleKeys);
  const [showForm, setShowForm] = useState(false);
  const [showKey, setShowKey] = useState<{[key: string]: boolean}>({});
  const [newKey, setNewKey] = useState<Partial<APIKey>>({
    status: 'active',
    service: 'DeepSeek'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key: APIKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKey.name || '',
      key: newKey.key || '',
      service: newKey.service as APIKey['service'],
      model: newKey.model,
      created_at: new Date().toISOString(),
      status: newKey.status as 'active' | 'inactive',
      usage_count: 0,
      rate_limit: newKey.rate_limit
    };
    setApiKeys([...apiKeys, key]);
    setShowForm(false);
    setNewKey({ status: 'active', service: 'DeepSeek' });
    toast.success('API key added successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteKey = (id: string) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted');
    }
  };

  const getServiceIcon = (service: APIKey['service']) => {
    switch (service) {
      case 'DeepSeek':
      case 'Grok':
        return <Brain className="h-5 w-5" />;
      case 'OpenAI':
        return <Code className="h-5 w-5" />;
      default:
        return <Key className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Key className="h-6 w-6 mr-2 text-blue-500" />
          AI Services Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New API Key
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mr-3 text-blue-500 dark:text-blue-400">
                  {getServiceIcon(apiKey.service)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {apiKey.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {apiKey.service}
                    </p>
                    {apiKey.model && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {apiKey.model}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                apiKey.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {apiKey.status}
              </span>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 font-mono text-sm">
                {showKey[apiKey.id] ? apiKey.key : '•'.repeat(20)}
              </div>
              <button
                onClick={() => toggleKeyVisibility(apiKey.id)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {showKey[apiKey.id] ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey.key)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Copy className="h-5 w-5" />
              </button>
              <button
                onClick={() => deleteKey(apiKey.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Usage Count</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {apiKey.usage_count || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limit</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {apiKey.rate_limit || 'N/A'} / month
                </p>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Created: {new Date(apiKey.created_at).toLocaleDateString()}
              {apiKey.last_used && ` • Last used: ${new Date(apiKey.last_used).toLocaleDateString()}`}
            </div>
          </div>
        ))}
      </div>

      {/* Add New API Key Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New API Key
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={newKey.name || ''}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Service
                </label>
                <select
                  value={newKey.service}
                  onChange={(e) => {
                    setNewKey({ 
                      ...newKey, 
                      service: e.target.value as APIKey['service'],
                      model: undefined
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  {AI_SERVICES.map(service => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {newKey.service && newKey.service !== 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model
                  </label>
                  <select
                    value={newKey.model}
                    onChange={(e) => setNewKey({ ...newKey, model: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="">Select a model</option>
                    {AI_SERVICES.find(s => s.name === newKey.service)?.models.map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  API Key
                </label>
                <input
                  type="text"
                  value={newKey.key || ''}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rate Limit (per month)
                </label>
                <input
                  type="number"
                  value={newKey.rate_limit || ''}
                  onChange={(e) => setNewKey({ ...newKey, rate_limit: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  checked={newKey.status === 'active'}
                  onChange={(e) => setNewKey({
                    ...newKey,
                    status: e.target.checked ? 'active' : 'inactive'
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="status"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
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
                  Add Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}