import React from "react";
import { TBook } from "../../../pages/Books/Books";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteBookMutation } from "../../../redux/Features/Book/bookApi";

type BookCardProps = {
  book: TBook;
  setId: (id: string) => void;
  setShowAddChapterForm: (show: boolean) => void;
  setShowAddSlokOrMantraForm: (show: boolean) => void;
  setSelectedChapters: (chapters: any[]) => void;
  setShowBookDetailsModal: (show: boolean) => void;
  setShowForm: (show: boolean) => void;
  setFormType : (type : "add" | "edit") => void
};

const BookCard: React.FC<BookCardProps> = ({
  book,
  setId,
  setShowAddChapterForm,
  setShowAddSlokOrMantraForm,
  setSelectedChapters,
  setShowForm,
  setShowBookDetailsModal,
  setFormType,
}) => {

  const [deleteBook] = useDeleteBookMutation();
      const handleDeleteBook = async () => {
        if (!window.confirm("Are you sure you want to delete?")) return;
    
        toast.promise(deleteBook({id:book?._id}).unwrap(), {
          loading: "Deleting book...",
          success: "Book deleted successfully!",
          error: "Failed to delete book.",
        });
      };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 max-w-[400px] relative">
      <button onClick={handleDeleteBook} className="absolute top-2 right-2 z-10 bg-red-500 p-2 rounded-lg text-white"><Trash className="size-5" /></button>
      <img
        src={book?.imageUrl}
        alt={book?.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {book?.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {book?.description.length > 40
            ? `${book.description.slice(0, 40)}...`
            : book.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setId(book?._id);
              setShowAddChapterForm(true);
            }}
            className="px-4 py-2 bg-[#20B486] text-white text-sm font-medium rounded-md hover:bg-[#199c6d] transition-all"
          >
            Add Chapter
          </button>
          <button
            onClick={() => {
              setFormType("edit");
              setId(book?._id);
              setShowForm(true);
            }}
            // onClick={() => {
            //   setId(book?._id);
            //   setShowAddSlokOrMantraForm(true);
            //   setSelectedChapters(book?.chapters);
            // }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all"
          >
            Edit Book
          </button>
          <button
            onClick={() => {
              setId(book?._id);
              setShowBookDetailsModal(true);
            }}
            className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-all"
          >
            View Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
