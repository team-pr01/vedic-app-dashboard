import { Pencil } from "lucide-react";

const ViewBookModal = ({
  book,
  showForm,
  setShowForm,
  setShowEditBookModalOpen,
  isLoading,
}: {
  book: any;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditBookModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}) => {
  console.log(book);
  
  
  if (!showForm || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Book Details
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setShowEditBookModalOpen(true);
              }}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
            >
              <Pencil className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Book Summary */}
        <div className="mb-6">
          <img
            src={book?.data?.imageUrl}
            alt="Book?.data? Cover"
            className="w-full h-64 object-cover rounded mb-4"
          />
          <h2 className="text-2xl font-bold mb-1">{book?.data?.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {book?.data?.description}
          </p>
        </div>

        {/* Chapters */}
        {book?.data?.chapters?.map((chapter: any, index: number) => (
          <div
            key={index}
            className="border-t pt-4 mt-4 border-gray-300 dark:border-gray-600"
          >
            <h4 className="text-lg font-semibold mb-1">
              {chapter.chapterTitle}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Order: {chapter.order}
            </p>
            <div className="text-sm text-gray-800 dark:text-gray-300 mb-2">
              <strong>Types:</strong>{" "}
              {Array.isArray(chapter.type) ? chapter.type.join(", ") : "-"}
            </div>

            {/* Sloks/Mantras */}
            {chapter.slokOrMantras?.length ? (
              <div className="mt-2 space-y-3">
                {chapter.slokOrMantras.map((slok: any, slokIndex: number) => (
                  <div
                    key={slokIndex}
                    className="p-3 border rounded bg-gray-50 dark:bg-gray-700 text-sm"
                  >
                    <p>
                      <span className="font-semibold">Type:</span> {slok.type}
                    </p>
                    <p>
                      <span className="font-semibold">Number:</span>{" "}
                      {slok.number}
                    </p>
                    <p>
                      <span className="font-semibold">Original Text:</span>{" "}
                      {slok.originalText}
                    </p>
                    <p>
                      <span className="font-semibold">Translations:</span>
                    </p>
                    <ul className="ml-4 list-disc">
                      {slok.translations &&
                        Object.entries(slok.translations).map(
                          ([lang, text]: [string, any], idx) => (
                            <li key={idx}>
                              <span className="font-semibold">{lang}:</span>{" "}
                              {text}
                            </li>
                          )
                        )}
                    </ul>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(slok.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated: {new Date(slok.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No slok/mantra found.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewBookModal;
