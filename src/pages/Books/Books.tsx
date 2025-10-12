import { useState } from "react";
import { Book, Search } from "lucide-react";
import AddBookForm from "../../components/BookPage/AddBookForm/AddBookForm";
import {
  useGetAllBooksQuery,
  useGetSingleBookQuery,
} from "../../redux/Features/Book/bookApi";
import AllBooksTable from "../../components/BookPage/AllBooksTable/AllBooksTable";
import AllTextsTable from "../../components/BookPage/AllTextsTable/AllTextsTable";
import {
  useGetAllTextsQuery,
  useGetSingleTextQuery,
} from "../../redux/Features/Book/textsApi";
import AddorEditBookTextForm from "../../components/BookPage/AddorEditBookTextForm/AddorEditBookTextForm";
import Translations from "../../components/BookPage/Translations/Translations";
import { useGetAllReportedMantrasQuery } from "../../redux/Features/Book/reportedMantraApi";
import AllReportedMantrasTable from "../../components/BookPage/AllReportedMantrasTable/AllReportedMantrasTable";

export type TBook = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  chapters: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const Books = () => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showBookTextForm, setShowBookTextForm] = useState<boolean>(false);
  const [isReviewMantraModalOpen, setIsReviewMantraModalOpen] = useState<boolean>(false);
  const [reportedMantraStatus, setReportedMantraStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<null | string>("");
  const [selectedBookTextId, setSelectedBookTextId] = useState<null | string>(
    ""
  );
  const { data: singleBook, isLoading: isSingleBookLoading } =
    useGetSingleBookQuery(selectedBookId);

  const {
    data: books,
    isLoading,
    isFetching,
  } = useGetAllBooksQuery({ keyword: searchQuery });

  const {
    data: bookTexts,
    isLoading: isBookTextsLoading,
    isFetching: isBookTextsFetching,
  } = useGetAllTextsQuery({ keyword: searchQuery });

  const { data: singleBookText, isLoading: isSingleBookTextLoading } =
    useGetSingleTextQuery(selectedBookTextId);

  const {
    data: reportedMantras,
    isLoading: isReportedMantrasLoading,
    isFetching: isReportedMantrasFetching,
  } = useGetAllReportedMantrasQuery({ status: reportedMantraStatus });

  const [activeTab, setActiveTab] = useState("Manage Books");

  const tabButtons: string[] = [
    "Manage Books",
    "Manage Texts",
    "Translations",
    "Mantra Reports",
  ];

  const buttonOnclick = () => {
    if (activeTab === "Manage Books") {
      setShowForm(true);
      setMode("add");
    }
    if (activeTab === "Manage Texts") {
      setShowBookTextForm(true);
      setMode("add");
    }
  };

  const buttonText = activeTab === "Manage Books" ? "Add Book" : "Add Text";

  return (
    <div className="flex flex-col bg-white rounded-2xl p-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Book & Text Management
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-5">
        {tabButtons.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 font-medium transition-colors 
              ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Add book button */}
      {(activeTab === "Manage Books" || activeTab === "Manage Texts") && (
        <div className="flex items-center justify-between mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700"
            />
          </div>

          <button
            onClick={buttonOnclick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Book className="w-5 h-5 mr-2 text-white" />

            {buttonText}
          </button>
        </div>
      )}

      {activeTab === "Manage Books" && (
        <AllBooksTable
          books={books?.data}
          isLoading={isLoading || isFetching}
          onEdit={(bookId) => {
            setSelectedBookId(bookId);
            setMode("edit");
            setShowForm(true);
          }}
        />
      )}

      {activeTab === "Manage Texts" && (
        <AllTextsTable
          texts={bookTexts?.data}
          isLoading={isBookTextsLoading || isBookTextsFetching}
          onEdit={(bookTextId) => {
            setSelectedBookTextId(bookTextId);
            setMode("edit");
            setShowBookTextForm(true);
          }}
        />
      )}

      {activeTab === "Translations" && <Translations />}

      {activeTab === "Mantra Reports" && (

      <div className="flex flex-col gap-4 mt-8">
        {/* Status */}
      <div className="flex justify-end">
        <select
          value={reportedMantraStatus}
          onChange={(e) => setReportedMantraStatus(e.target.value)}
          className="px-[18px] py-2 rounded-lg bg-neutral-70 border text-neutral-65 focus:outline-none focus:border-primary-10 transition duration-300"
        >
          <option value="" disabled>
            All Reports
          </option>
          {["pending", "resolved", "dismissed"].map(
            (option: any, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            )
          )}
        </select>
      </div>
        <AllReportedMantrasTable
          reportedMantras={reportedMantras?.data}
          isLoading={isReportedMantrasLoading || isReportedMantrasFetching}
          isReviewMantraModalOpen={isReviewMantraModalOpen}
          setIsReviewMantraModalOpen={setIsReviewMantraModalOpen}
        />
      </div>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <AddBookForm
          setShowForm={setShowForm}
          defaultValues={singleBook?.data}
          mode={mode}
          setMode={setMode}
          isSingleDataLoading={isSingleBookLoading}
        />
      )}

      {/* Add Form Modal */}
      {showBookTextForm && (
        <AddorEditBookTextForm
          setShowForm={setShowBookTextForm}
          defaultValues={singleBookText?.data}
          mode={mode}
          setMode={setMode}
          isSingleDataLoading={isSingleBookTextLoading}
          bookNames={books?.data}
        />
      )}
    </div>
  );
};

export default Books;
