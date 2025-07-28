import { useState } from "react";
import toast from "react-hot-toast";
import { Key, Copy, Eye, EyeOff, Trash2, Brain, Code } from "lucide-react";
import { useDeleteApiKeyMutation } from "../../../redux/Features/ApiKeys/apiKeyApi";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";

const ApiKeyCard = ({ apiKey }: any) => {
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getServiceIcon = (service: any) => {
    switch (service) {
      case "DeepSeek":
      case "Grok":
        return <Brain className="h-5 w-5" />;
      case "OpenAI":
        return <Code className="h-5 w-5" />;
      default:
        return <Key className="h-5 w-5" />;
    }
  };

  const [deleteApiKey] = useDeleteApiKeyMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleConfirmDelete = async () => {
    toast.promise(deleteApiKey(apiKey?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
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

        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 font-mono text-sm">
            {showKey[apiKey._id] ? apiKey.key : "•".repeat(20)}
          </div>
          <button
            onClick={() => toggleKeyVisibility(apiKey._id)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {showKey[apiKey.id] ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => copyToClipboard(apiKey?.key)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Copy className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Created: {new Date(apiKey.createdAt).toLocaleDateString()}
        </div>
      </div>
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ApiKeyCard;
