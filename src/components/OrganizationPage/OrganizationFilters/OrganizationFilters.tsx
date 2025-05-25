import { Search } from "lucide-react";

type TOrganizationFiltersFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setStatus: (status: string) => void;
};
const OrganizationFilters: React.FC<TOrganizationFiltersFiltersProps> = ({
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
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
          />
        </div>
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="all">All Types</option>
          <option value="gurukul">Gurukul</option>
          <option value="vedic_institution">Vedic Institution</option>
          <option value="ashram">Ashram</option>
      </select>
    </div>
  );
};

export default OrganizationFilters;
