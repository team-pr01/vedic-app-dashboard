import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Book, Search } from "lucide-react";
import AddBookForm from "../../components/BookPage/AddBookForm/AddBookForm";
import {
  useGetAllBooksQuery,
  useGetSingleBookQuery,
} from "../../redux/Features/Book/bookApi";
import BookCard from "../../components/BookPage/BookCard/BookCard";
import AddChapterForm from "../../components/BookPage/AddChapterForm/AddChapterForm";
import Loader from "../../components/Shared/Loader/Loader";
import AddSlokOrMantraForm from "../../components/BookPage/AddSlokOrMantraForm/AddSlokOrMantraForm";
import ViewBookModal from "../../components/BookPage/ViewBookModal/ViewBookModal";
import EditBookModal from "../../components/BookPage/EditBookModal/EditBookModal";

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

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Manage Books"
        buttonText="Add New Book"
        icon={<Book className="w-6 h-6 mr-2 text-blue-500" />}
        onClick={() => {
          setShowForm(true);
        }}
        setShowCategoryForm={() => {}}
        isCategoryButtonVisible={false}
      />

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

      <div className="mt-10">
        {isLoading || isFetching ? (
          <Loader size="size-10" />
        ) : books?.data?.length < 1 ? (
          <p className="text-center text-gray-500 dark:text-gray-100">
            No data found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books?.data?.map((book: TBook) => (
              <BookCard
                key={book._id}
                book={book}
                setId={setId}
                setShowAddChapterForm={setShowAddChapterForm}
                setShowAddSlokOrMantraForm={setShowAddSlokOrMantraForm}
                // selectedChapters={selectedChapters}
                setSelectedChapters={setSelectedChapters}
                setShowBookDetailsModal={setShowBookDetailsModal}
                setFormType={setFormType}
                setShowForm={setShowForm}
              />
            ))}
          </div>
        )}
      </div>

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
