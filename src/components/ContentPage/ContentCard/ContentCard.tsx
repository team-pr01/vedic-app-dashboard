import React, { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteContentMutation } from "../../../redux/Features/Content/contentApi";

type TContentCardProps = {
  content: any;
  setContentId: (id: string) => void;
  setMode: Dispatch<SetStateAction<"add" | "edit">>;
  setShowForm: (show: boolean) => void;
};

const ContentCard: React.FC<TContentCardProps> = ({
  content,
  setContentId,
  setMode,
  setShowForm,
}) => {
  const handleEdit = () => {
    setContentId(content?._id);
    setMode("edit");
    setShowForm(true);
  };

  const [deleteContent] = useDeleteContentMutation();

  const handleConfirmDelete = async () => {
    toast.promise(deleteContent(content?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };
  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl shadow-md bg-white  hover:shadow-lg transition">
        <img
          src={content?.imageUrl}
          alt={content?.title}
          className="w-full h-72 rounded-t-2xl"
        />
        <div className="p-4">
            <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {content?.title}
          </h2>
          <p className="text-sm text-gray-700 font-medium">
            {content?.subtitle}
          </p>
          <p className="text-sm text-gray-700 font-medium">
            {content?.description}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-500 hover:text-blue-600"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleConfirmDelete}
            className="text-red-500 hover:text-red-600"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default ContentCard;
