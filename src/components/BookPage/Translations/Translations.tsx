import { useState } from "react";
import { useGetAllBooksQuery } from "../../../redux/Features/Book/bookApi";
import Loader from "../../Shared/Loader/Loader";
import { Book } from "lucide-react";
import TranslateBookModal from "./TranslateBookModal";
import { useGetTextByDetailsQuery } from "../../../redux/Features/Book/textsApi";

type TSelectedBook = {
  _id: string;
  name: string;
  levels: { _id: string; name: string }[];
} | null;

const Translations = () => {
  const { data: books } = useGetAllBooksQuery({});
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<TSelectedBook>(null);
  const [locationValues, setLocationValues] = useState<Record<string, string>>({});

  const shouldFetch =
    !!selectedBook?._id &&
    Object.values(locationValues).every((v) => v.trim() !== "");

  const { data: singleText, isLoading: isSingleTextLoading, isFetching: isSingleTextFetching } =
  useGetTextByDetailsQuery(
    {
      bookId: selectedBook?._id!,
      levels: locationValues, // <-- pass it here
    },
    {
      skip: !shouldFetch,
    }
  );


  const allBookNames = books?.data?.map((item: any) => ({
    _id: item?._id,
    name: item?.name,
    levels: item.levels || [],
  }));

  if (!allBookNames) return <Loader size="size-10" />;

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = allBookNames.find((b: any) => b._id === selectedId);
    if (selected) {
      setSelectedBook(selected);
      // Reset location values for the new book
      const initialLocation: Record<string, string> = {};
      selected.levels.forEach((lvl: any) => {
        initialLocation[lvl.name] = "";
      });
      setLocationValues(initialLocation);
    }
  };

  const handleLocationChange = (levelName: string, value: string) => {
    setLocationValues((prev) => ({ ...prev, [levelName]: value }));
  };

  return (
    <div className="bg-gray-100 p-4 rounded-2xl mt-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
        Find Text by Location
      </h3>

      <div className="flex justify-between items-center gap-4 mt-3">
        <div className="flex items-center gap-4">
          {/* Books dropdown */}
          <div className="flex flex-col gap-2 font-Inter w-[600px]">
            <label className="text-neutral-65">
              Book
              <span className="text-red-600"> *</span>
            </label>
            <select
              value={selectedBook?._id || ""}
              onChange={handleBookChange}
              className="px-[18px] py-2 rounded-lg bg-neutral-70 border text-neutral-65 focus:outline-none focus:border-primary-10 transition duration-300"
            >
              <option value="" disabled>
                Select Book
              </option>
              {allBookNames.map((option: any) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic location fields */}
          {selectedBook && (
            <div className="flex flex-col gap-2 font-Inter w-full">
              <label className="text-neutral-65">
                Enter Location
                <span className="text-red-600"> *</span>
              </label>
              <div className="flex items-center gap-2">
                {selectedBook.levels.map((lvl) => (
                  <input
                    key={lvl._id}
                    placeholder={lvl.name}
                    value={locationValues[lvl.name] || ""}
                    onChange={(e) => handleLocationChange(lvl.name, e.target.value)}
                    className="px-[18px] py-2 rounded-lg border focus:outline-none focus:border-primary-500 transition duration-300 bg-neutral-50 w-[200px]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsTranslateModalOpen(true)}
          disabled={!shouldFetch || isSingleTextFetching}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed mt-8"
        >
          {isSingleTextFetching || isSingleTextLoading ? (
            "Finding Text..."
          ) : (
            <p className="flex">
              <Book className="w-5 h-5 mr-2 text-white" />
              Translate
            </p>
          )}
        </button>
      </div>

      {isTranslateModalOpen && (
        <TranslateBookModal
          data={singleText?.data}
          setIsTranslateModalOpen={setIsTranslateModalOpen}
        />
      )}

      {Object.values(locationValues).some((v) => v) && !singleText?.data && (
        <p className="mt-3 text-red-500">
          No text found. Try to search by another location
        </p>
      )}
    </div>
  );
};

export default Translations;
