import React from "react";
import { Pen, Trash2 } from "lucide-react";
import Loader from "../../Shared/Loader/Loader";

export type TBooks = {
  _id: string;
  imageUrl?: string;
  name: string;
  type: "veda" | "purana" | "upanishad";
  structure:
    | "Chapter-Verse"
    | "Mandala-Sukta-Rik"
    | "Kanda-Sarga-Shloka"
    | "Custom";
  level1Name?: string;
  level2Name?: string;
  level3Name?: string;
};

type AllBooksTableProps = {
  books?: TBooks[];
  isLoading?: boolean;
  onEdit: (bookId: string) => void;
};

const AllBooksTable: React.FC<AllBooksTableProps> = ({
  books,
  isLoading,
  onEdit,
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader size="size-10" />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20 text-gray-500 dark:text-gray-400 text-lg">
        No book found
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-700 dark:text-gray-200">
            <th className="pb-2">Cover</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Structure</th>
            <th className="pb-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Border below headers */}
          <tr>
            <td colSpan={5}>
              <div className="border-b border-gray-300 dark:border-gray-600 mb-2"></div>
            </td>
          </tr>

          {books.map((book) => (
            <React.Fragment key={book?._id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 align-middle capitalize">
                <td className="py-2 align-middle">
                  <img
                    src={book?.imageUrl}
                    alt={book?.name}
                    className="size-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 align-middle text-gray-700 dark:text-gray-200">
                  {book?.name}
                </td>
                <td className="py-2 align-middle text-gray-700 dark:text-gray-200">
                  {book?.type}
                </td>
                <td className="py-2 align-middle text-gray-700 dark:text-gray-200">
                  {book?.structure}
                </td>
                <td className="py-2 align-middle flex gap-3 items-center mt-5">
                  <button onClick={() => onEdit(book?._id)}>
                    <Pen className="w-5 h-5 text-blue-500" />
                  </button>
                  <button>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>
              {/* Border after each book */}
              <tr>
                <td colSpan={5}>
                  <div className="border-b border-gray-200 dark:border-gray-600 my-2"></div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllBooksTable;
