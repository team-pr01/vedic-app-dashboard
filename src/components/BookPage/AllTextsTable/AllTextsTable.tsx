import React, { useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import Loader from "../../Shared/Loader/Loader";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";
import toast from "react-hot-toast";
import { useDeleteTextMutation } from "../../../redux/Features/Book/textsApi";

export type TLocation = {
  levelName: string;
  value: string;
};

export type TBookText = {
  _id: string;
  bookId: {
    name : string
  };
  location: TLocation[];
  originalText: string;
  primaryTranslation: string;
  tags: string[];
  isVerified?: boolean;
};

type AllTextsTableProps = {
  texts?: TBookText[];
  isLoading?: boolean;
  onEdit: (textId: string) => void;
};

const AllTextsTable: React.FC<AllTextsTableProps> = ({
  texts,
  isLoading,
  onEdit,
}) => {
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteText] = useDeleteTextMutation();

  const handleConfirmDelete = async () => {
    if (!selectedTextId) return;
    toast.promise(deleteText({ id: selectedTextId }).unwrap(), {
      loading: "Deleting text...",
      success: "Text deleted successfully!",
      error: "Failed to delete text.",
    });
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader size="size-10" />
      </div>
    );
  }

  if (!texts || texts.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20 text-gray-500 dark:text-gray-400 text-lg">
        No text found
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-700 dark:text-gray-200">
            <th className="pb-2">Book & Location</th>
            <th className="pb-2">Text</th>
            <th className="pb-2">Tags</th>
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

          {texts.map((text) => (
            <React.Fragment key={text._id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 align-middle">
                <td className="py-2 align-middle text-gray-700 dark:text-gray-200">
                  <div className="font-medium">{text.bookId?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                   {
                    text?.location?.map((location) => `${location.levelName}-${location?.value}`).join(", ")
                   }
                  </div>
                </td>
                <td className="py-2 align-middle text-gray-700 dark:text-gray-200">
                  {text.originalText}
                </td>
                <td className="py-2 align-middle text-gray-700 dark:text-gray-200 capitalize">
                  {text.tags.join(", ")}
                </td>
                <td className="py-2 align-middle flex gap-3 items-center">
                  <button onClick={() => onEdit(text._id)}>
                    <Pen className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTextId(text._id);
                      setShowDeleteModal(true);
                    }}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>

              {/* Border after each text */}
              <tr>
                <td colSpan={5}>
                  <div className="border-b border-gray-200 dark:border-gray-600 my-2"></div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AllTextsTable;
