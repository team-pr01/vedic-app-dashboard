import React from "react";
import { TBook } from "../../../pages/Books/Books";

type BookCardProps = {
  book: TBook;
  setId: (id: string) => void;
  setShowAddChapterForm: (show: boolean) => void;
  setShowAddSlokOrMantraForm: (show: boolean) => void;
  setSelectedChapters: (chapters: any[]) => void;
  setShowBookDetailsModal: (show: boolean) => void;
};

const BookCard: React.FC<BookCardProps> = ({
  book,
  setId,
  setShowAddChapterForm,
  setShowAddSlokOrMantraForm,
  setSelectedChapters,
  setShowBookDetailsModal,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 max-w-[400px]">
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
              setId(book?._id);
              setShowAddSlokOrMantraForm(true);
              setSelectedChapters(book?.chapters);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all"
          >
            Add Slok
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
