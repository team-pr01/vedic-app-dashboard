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
      <div className="flex flex-col gap-4 rounded-2xl shadow-md bg-white  hover:shadow-lg transition w-96 h-96">
        <div className="relative">
             <div className="flex justify-end gap-2 absolute top-4 right-4 z-20">
            <button
              onClick={handleEdit}
              className="text-white hover:text-blue-600"
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
          <div>
            <img
              src={content?.imageUrl}
              alt={content?.title}
              className="w-full h-96 rounded-2xl relative"
            />
            <div className="bg-gray-700/50 w-full h-full absolute top-0 bottom-0 right-0 left-0 rounded-2xl"></div>
          </div>

           <div className="p-4 absolute bottom-0">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {content?.title}
            </h2>
            <p className="text-sm text-white font-medium mt-2">
              {content?.subtitle}
            </p>
            <p className="text-sm text-white mt-1">
              {content?.description}
            </p>
          </div>

         
        </div>
        </div>
       
      </div>
    </>
  );
};

export default ContentCard;
