import React, { useState } from "react";
import { Key, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useGetAllApiKeysQuery } from "../redux/Features/ApiKeys/apiKeyApi";
import ApiKeyCard from "./ApiKeyPage/ApiKeyCard/ApiKeyCard";

interface APIKey {
  id: string;
  name: string;
  key: string;
  service: "OpenAI" | "Google Cloud" | "DeepSeek" | "Grok" | "Other";
  model?: string;
  created_at: string;
  last_used?: string;
  status: "active" | "inactive";
  usage_count?: number;
  rate_limit?: number;
}

const AI_SERVICES = [
  {
    name: "DeepSeek",
    models: [
      "deepseek-chat",
      "deepseek-coder",
      "deepseek-math",
      "deepseek-vision",
    ],
  },
  {
    name: "Grok",
    models: ["grok-1", "grok-vision", "grok-code"],
  },
  {
    name: "OpenAI",
    models: ["gpt-4", "gpt-3.5-turbo"],
  },
  {
    name: "Google Cloud",
    models: ["gemini-pro", "gemini-vision"],
  },
];

const sampleKeys: APIKey[] = [
  {
    id: "1",
    name: "DeepSeek Production",
    key: "dsk_1234567890abcdef",
    service: "DeepSeek",
    model: "deepseek-chat",
    created_at: new Date().toISOString(),
    status: "active",
    usage_count: 150,
    rate_limit: 1000,
  },
  {
    id: "2",
    name: "Grok API",
    key: "grk_ABC123DEF456",
    service: "Grok",
    model: "grok-1",
    created_at: new Date().toISOString(),
    status: "active",
    usage_count: 75,
    rate_limit: 500,
  },
];

export function APIKeyManager() {
  const { data } = useGetAllApiKeysQuery({});
  console.log(data);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(sampleKeys);
  const [showForm, setShowForm] = useState(false);

  const [newKey, setNewKey] = useState<Partial<APIKey>>({
    status: "active",
    service: "DeepSeek",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key: APIKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKey.name || "",
      key: newKey.key || "",
      service: newKey.service as APIKey["service"],
      model: newKey.model,
      created_at: new Date().toISOString(),
      status: newKey.status as "active" | "inactive",
      usage_count: 0,
      rate_limit: newKey.rate_limit,
    };
    setApiKeys([...apiKeys, key]);
    setShowForm(false);
    setNewKey({ status: "active", service: "DeepSeek" });
    toast.success("API key added successfully");
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
        {data?.data?.map((apiKey: any) => (
          <ApiKeyCard Key={apiKey?._id} apiKey={apiKey} />
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
                  value={newKey.name || ""}
                  onChange={(e) =>
                    setNewKey({ ...newKey, name: e.target.value })
                  }
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
                      service: e.target.value as APIKey["service"],
                      model: undefined,
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  {AI_SERVICES.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {newKey.service && newKey.service !== "Other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model
                  </label>
                  <select
                    value={newKey.model}
                    onChange={(e) =>
                      setNewKey({ ...newKey, model: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="">Select a model</option>
                    {AI_SERVICES.find(
                      (s) => s.name === newKey.service
                    )?.models.map((model) => (
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
                  value={newKey.key || ""}
                  onChange={(e) =>
                    setNewKey({ ...newKey, key: e.target.value })
                  }
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
                  value={newKey.rate_limit || ""}
                  onChange={(e) =>
                    setNewKey({
                      ...newKey,
                      rate_limit: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  checked={newKey.status === "active"}
                  onChange={(e) =>
                    setNewKey({
                      ...newKey,
                      status: e.target.checked ? "active" : "inactive",
                    })
                  }
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
