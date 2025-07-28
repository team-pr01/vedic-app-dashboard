import { useState } from "react";
import { Key, Plus } from "lucide-react";
import { useGetAllApiKeysQuery } from "../redux/Features/ApiKeys/apiKeyApi";
import ApiKeyCard from "./ApiKeyPage/ApiKeyCard/ApiKeyCard";
import AddApiKeyForm from "./ApiKeyPage/AddApiKeyForm/AddApiKeyForm";
import Loader from "./Shared/Loader/Loader";

export function APIKeyManager() {
  const { data, isLoading } = useGetAllApiKeysQuery({});
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Key className="h-6 w-6 mr-2 text-blue-500" />
          API Key Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New API Key
        </button>
      </div>

      {isLoading ? (
        <Loader size="size-10" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.data?.map((apiKey: any) => (
            <ApiKeyCard Key={apiKey?._id} apiKey={apiKey} />
          ))}
        </div>
      )}

      {/* Add New API Key Modal */}
      <AddApiKeyForm showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
}
