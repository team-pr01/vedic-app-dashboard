import { useState } from "react";
import { useGetAllBooksQuery } from "../../../redux/Features/Book/bookApi";
import Loader from "../../Shared/Loader/Loader";
import { Book } from "lucide-react";

type TSelectedBook = {
  _id: string;
  name: string;
} | null;

const Translations = () => {
  const { data: books } = useGetAllBooksQuery({});
  const [selectedBook, setSelectedBook] = useState<TSelectedBook>(null);
  const [chapter, setChapter] = useState<string>("");
  const [verse, setVerse] = useState<string>("");

  const allBookNames = books?.data?.map((item: any) => ({
    _id: item?._id,
    name: item?.name,
  }));

  if (!allBookNames) return <Loader size="size-10" />;

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = allBookNames.find((b: any) => b._id === selectedId);
    if (selected) setSelectedBook(selected);
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
              className={`px-[18px] py-2 rounded-lg bg-neutral-70 border text-neutral-65 focus:outline-none focus:border-primary-10 transition duration-300`}
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

          {selectedBook && (
            <div className="flex flex-col gap-2 font-Inter w-full">
              <label className="text-neutral-65">
                Enter Location
                <span className="text-red-600"> *</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  placeholder="Chapter"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="px-[18px] py-2 rounded-lg border focus:outline-none focus:border-primary-500 transition duration-300 bg-neutral-50 w-[200px]"
                />
                <input
                  placeholder="Verse"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  className="px-[18px] py-2 rounded-lg border focus:outline-none focus:border-primary-500 transition duration-300 bg-neutral-50 w-[200px]"
                />
              </div>
            </div>
          )}
        </div>

        <button
          disabled={!chapter && !verse}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed mt-8"
        >
          <Book className="w-5 h-5 mr-2 text-white" />
          Find Text
        </button>
      </div>
    </div>
  );
};

export default Translations;
