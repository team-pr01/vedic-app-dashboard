import { Search } from "lucide-react";

type TReligiousTextsFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setLanguage: (status: string) => void;
};
const ReligiousTextsFilters: React.FC<TReligiousTextsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  setLanguage,
}) => {

 const allLanguages = [
  { code: 'sa', name: 'Sanskrit', script: 'Devanagari' },
  { code: 'en', name: 'English', script: 'Latin' },
  { code: 'hi', name: 'Hindi', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', script: 'Bengali' },
  { code: 'ta', name: 'Tamil', script: 'Tamil' },
  { code: 'te', name: 'Telugu', script: 'Telugu' },
  { code: 'kn', name: 'Kannada', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', script: 'Malayalam' },
  { code: 'gu', name: 'Gujarati', script: 'Gujarati' },
  { code: 'mr', name: 'Marathi', script: 'Devanagari' },
  { code: 'pa', name: 'Punjabi', script: 'Gurmukhi' },
  { code: 'or', name: 'Odia', script: 'Odia' },
  { code: 'as', name: 'Assamese', script: 'Bengali' },
  { code: 'ks', name: 'Kashmiri', script: 'Perso-Arabic' },
  { code: 'sd', name: 'Sindhi', script: 'Perso-Arabic' },
  { code: 'ur', name: 'Urdu', script: 'Perso-Arabic' },
  { code: 'ne', name: 'Nepali', script: 'Devanagari' },
  { code: 'si', name: 'Sinhala', script: 'Sinhala' },
  { code: 'my', name: 'Myanmar', script: 'Myanmar' },
  { code: 'km', name: 'Khmer', script: 'Khmer' },
  { code: 'th', name: 'Thai', script: 'Thai' },
  { code: 'lo', name: 'Lao', script: 'Lao' },
  { code: 'bo', name: 'Tibetan', script: 'Tibetan' },
  { code: 'dz', name: 'Dzongkha', script: 'Tibetan' },
  { code: 'pi', name: 'Pali', script: 'Various' }
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
        value={status}
        onChange={(e) => setLanguage(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <option value="" selected disabled>All Language</option>

        {/* to be changed to active instated of processing */}
        {
          allLanguages.map((language) => (
            <option key={language.name} value={language.name}>
              {language.name}
            </option>
          ))
        }
      </select>
    </div>
  );
};

export default ReligiousTextsFilters;