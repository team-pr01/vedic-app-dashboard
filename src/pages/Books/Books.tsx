import { useState } from "react";
import { Book, Search } from "lucide-react";
import AddBookForm from "../../components/BookPage/AddBookForm/AddBookForm";
import {
  useGetAllBooksQuery,
  useGetSingleBookQuery,
} from "../../redux/Features/Book/bookApi";
import AddChapterForm from "../../components/BookPage/AddChapterForm/AddChapterForm";
import Loader from "../../components/Shared/Loader/Loader";
import AddSlokOrMantraForm from "../../components/BookPage/AddSlokOrMantraForm/AddSlokOrMantraForm";
import ViewBookModal from "../../components/BookPage/ViewBookModal/ViewBookModal";
import EditBookModal from "../../components/BookPage/EditBookModal/EditBookModal";
import AllBooksTable from "../../components/BookPage/AllBooksTable/AllBooksTable";

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
  const [formType, setFormType] = useState<"add" | "edit">("add");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showAddChapterForm, setShowAddChapterForm] = useState<boolean>(false);
  const [showAddSlokOrMantraForm, setShowAddSlokOrMantraForm] =
    useState<boolean>(false);
  const [showBookDetailsModal, setShowBookDetailsModal] =
    useState<boolean>(false);
  const [showEditBookModalOpen, setShowEditBookModalOpen] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [id, setId] = useState("");
  const { data: singleBook, isLoading: isSingleBookLoading } =
    useGetSingleBookQuery(id);

  const {
    data: books,
    isLoading,
    isFetching,
  } = useGetAllBooksQuery({ keyword: searchQuery });

  const [activeTab, setActiveTab] = useState("Manage Books");

  const tabButtons: string[] = [
    "Manage Books",
    "Manage Texts",
    "Translations",
    "Mantra Reports",
  ];

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
      <div className="flex items-center justify-between mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-slate-700 dark:bg-gray-800"
          />
        </div>

        <button
          onClick={() => {
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Book className="w-5 h-5 mr-2 text-white" />
          Add Book
        </button>
      </div>

      <AllBooksTable books={books?.data} isLoading={isLoading || isFetching} />

      {/* Add Form Modal */}
      {showForm && (
        <AddBookForm
          showForm={showForm}
          setShowForm={setShowForm}
          defaultValues={singleBook}
          id={id}
          formType={formType}
        />
      )}

      {showAddChapterForm && (
        <AddChapterForm
          showForm={showAddChapterForm}
          setShowForm={setShowAddChapterForm}
          bookId={id}
        />
      )}
      {showAddSlokOrMantraForm && (
        <AddSlokOrMantraForm
          showForm={showAddSlokOrMantraForm}
          setShowForm={setShowAddSlokOrMantraForm}
          bookId={id}
          selectedChapters={selectedChapters}
        />
      )}
      {showBookDetailsModal && (
        <ViewBookModal
          book={singleBook}
          showForm={showBookDetailsModal}
          setShowForm={setShowBookDetailsModal}
          setShowEditBookModalOpen={setShowEditBookModalOpen}
          isLoading={isSingleBookLoading}
        />
      )}
      {showEditBookModalOpen && (
        <EditBookModal
          book={singleBook}
          showForm={showEditBookModalOpen}
          setShowForm={setShowEditBookModalOpen}
          isLoading={isSingleBookLoading}
        />
      )}
    </div>
  );
};

export default Books;
