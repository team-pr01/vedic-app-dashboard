import { useState } from "react";
import { TDailyHoroscope } from "../../../pages/DailyHoroscope/DailyHoroscope";
import { useDeleteDailyHoroscopeMutation } from "../../../redux/Features/DailyHoroscope/dailyHoroscopeApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";
import { Trash, Edit } from "lucide-react";

const DailyHoroscopeCard = ({
  data,
  setDailyHoroscopeId,
  setMode,
  setShowForm,
}: {
  data: TDailyHoroscope;
  setDailyHoroscopeId: React.Dispatch<React.SetStateAction<string>>;
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleEdit = () => {
    setDailyHoroscopeId(data?._id);
    setMode("edit");
    setShowForm(true);
  };

  const [deleteDailyHoroscope] = useDeleteDailyHoroscopeMutation();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteDailyHoroscope(data?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative">
        {/* Action Buttons */}
        <div className="absolute top-8 right-4 flex gap-2">
          <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">
            <Edit size={18} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash size={18} />
          </button>
        </div>

        {/* Horoscope Sign and Title */}
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">⭐</span>
          <h2 className="text-xl font-bold text-gray-800">{data?.name}</h2>
        </div>

        {/* Horoscope Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-4">
          {data?.description}
        </p>

        {/* Separator Line */}
        <hr className="my-4 border-gray-200" />

        {/* Lucky Attributes (Color, Number, Direction) */}
        <div className="flex justify-between text-center">
          {/* Color */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Color</p>
            <p className="text-lg font-semibold">{data?.color}</p>
          </div>

          {/* Number */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Number</p>
            <p className="text-lg font-semibold text-gray-800">{data?.number}</p>
          </div>

          {/* Direction */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Direction</p>
            <p className="text-lg font-semibold text-gray-800">{data?.direction}</p>
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

export default DailyHoroscopeCard;
