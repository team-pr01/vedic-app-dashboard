import { Search } from "lucide-react";

type TReligiousTextsFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language : string;
  setLanguage: (status: string) => void;
};
const ReligiousTextsFilters: React.FC<TReligiousTextsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
}) => {

 const allLanguages = [
  "Rigveda",
  "Samaveda",
  "Yajurveda",
  "Atharvaveda",
];
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
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="" selected>All</option>

        {/* to be changed to active instated of processing */}
        {
          allLanguages.map((language) => (
            <option key={language} value={language} className="capitalize">
              {language}
            </option>
          ))
        }
      </select>
    </div>
  );
};

export default ReligiousTextsFilters;