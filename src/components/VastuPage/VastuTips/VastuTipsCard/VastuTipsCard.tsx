import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { TVastuTips } from "../VastuTips";
import { useDeleteVastuTipsMutation } from "../../../../redux/Features/Vastu/vastuTipsApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../../DeleteConfirmationModal/DeleteConfirmationModal";

type VastuTipsCardProps = {
  data: TVastuTips;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setVastuTipsId: React.Dispatch<React.SetStateAction<string | null>>;
};

const VastuTipsCard: React.FC<VastuTipsCardProps> = ({
  data,
  setMode,
  setShowForm,
  setVastuTipsId,
}) => {
  const [deleteVastuTips] = useDeleteVastuTipsMutation();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteVastuTips(data?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Left icon/image */}
      <img
        src={data?.imageUrl}
        alt={data?.title}
        className="w-10 h-10 object-contain"
      />

      {/* Content */}
      <div className="flex-1">
        {/* Title + Icons */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {data?.title}{" "}
            <span className="bg-orange-500 p-1 rounded text-white text-xs">
              {data?.category}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode("edit");
                setVastuTipsId(data?._id);
                setShowForm(true);
              }}
              className="p-1 text-gray-500 hover:text-blue-600"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1 text-gray-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Tips */}
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 text-sm">
          {data?.tips?.map((tip: string, index: number) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default VastuTipsCard;
