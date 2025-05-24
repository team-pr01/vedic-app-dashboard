import { Search } from "lucide-react";

type TEmergencyPageFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setStatus: (status: string) => void;
};
const EmergencyPageFilters: React.FC<TEmergencyPageFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  setStatus,
}) => {
  return (
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
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="">All Status</option>

        {/* to be changed to active instated of processing */}
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
};

export default EmergencyPageFilters;
