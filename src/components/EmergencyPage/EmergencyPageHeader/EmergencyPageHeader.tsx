import { AlertTriangle, Send } from "lucide-react";

const EmergencyPageHeader = ({setShowForm} : {setShowForm: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
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
  );
};

export default EmergencyPageHeader;
