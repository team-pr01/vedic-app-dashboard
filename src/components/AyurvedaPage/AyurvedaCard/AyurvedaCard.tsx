import React, { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteAyurvedaMutation } from "../../../redux/Features/Ayurveda/ayurvedaApi";
import { getEmbedUrl } from "../../YogaPage/YogaCard/YogaCard";

type TAyurvedaCardProps = {
  ayurveda: any;
  setAyurvedaId: (id: string) => void;
  setMode: Dispatch<SetStateAction<"add" | "edit">>;
  setShowForm: (show: boolean) => void;
};

const AyurvedaCard: React.FC<TAyurvedaCardProps> = ({
  ayurveda,
  setAyurvedaId,
  setMode,
  setShowForm,
}) => {
  const handleEdit = () => {
    setAyurvedaId(ayurveda?._id);
    setMode("edit");
    setShowForm(true);
  };

  const [deleteAyurveda] = useDeleteAyurvedaMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteAyurveda(ayurveda?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };

  const embedUrl = ayurveda?.videoUrl ? getEmbedUrl(ayurveda.videoUrl) : null;
  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl shadow-md bg-white  hover:shadow-lg transition">
        <div className="aspect-video">
          <iframe
            src={embedUrl as string}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div className="bg-orange-100 rounded-3xl px-3 py-[6px] text-xs font-medium w-fit">
              {ayurveda?.category}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {ayurveda?.content?.length > 30
                ? `${ayurveda.content.slice(0, 30)}...`
                : ayurveda?.content}
            </h2>

            <p className="text-sm text-gray-800">
              by <strong>{ayurveda?.expertName}</strong> | Duration :{" "}
              {ayurveda?.duration}
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
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-600"
              type="button"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default AyurvedaCard;
