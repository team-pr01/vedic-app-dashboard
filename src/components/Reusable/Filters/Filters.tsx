import { Search } from "lucide-react";

type TOption = {
  label: string;
  value: string;
};

type TFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  options: TOption[];
  placeholder?: string;
  selectLabel?: string;
};

const Filters: React.FC<TFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedOption,
  setSelectedOption,
  options,
  placeholder = "Search...",
  selectLabel = "Select Option",
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2"
      >
        <option value="" disabled>
          {selectLabel}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
