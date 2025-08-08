import React, { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteContentMutation } from "../../../redux/Features/Content/contentApi";
import { getEmbedUrl } from "../../YogaPage/YogaCard/YogaCard";

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

  const embedUrl = content?.videoUrl ? getEmbedUrl(content.videoUrl) : null;
  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition w-96 h-96">
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

          {content?.videoUrl ? (
            <iframe
              className="w-full h-96 rounded-2xl"
              src={embedUrl as string}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={content?.imageUrl}
              alt={content?.title}
              className="w-full h-96 rounded-2xl"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ContentCard;
