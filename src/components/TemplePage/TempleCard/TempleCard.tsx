import { Info, MapPin } from "lucide-react";
import {
  useApproveTempleMutation,
  useDeleteTempleMutation,
} from "../../../redux/Features/Temple/templeApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";
import { useState } from "react";

type TTempleCardProps = {
  temple: any;
  setActiveTab: (tab: string) => void;
  setTempleId: (templeId: string) => void;
};
const TempleCard: React.FC<TTempleCardProps> = ({
  temple,
  setActiveTab,
  setTempleId,
}) => {
  const [approveTemple] = useApproveTempleMutation();
  const [deleteTemple] = useDeleteTempleMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteTemple(temple?._id).unwrap(), {
      loading: "Deleting temple...",
      success: "Temple deleted successfully!",
      error: "Failed to delete temple.",
    });
    setShowDeleteModal(false);
  };

  const handleApproveTemple = async () => {
    const payload = {
      status: "approved",
    };

    toast.promise(
      approveTemple({
        id: temple?._id,
        data: payload,
      }).unwrap(),
      {
        loading: "Approving temple...",
        success: "Temple approved successfully!",
        error: "Failed to approve temple.",
      }
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="h-72 overflow-hidden relative">
          <img
            src={temple?.imageUrl}
            alt={temple.name}
            className="w-full h-full object-cover"
          />

          <div
            className={`capitalize text-xs px-4 py-2 rounded-3xl text-white absolute top-4 right-4 ${
              temple?.status === "approved"
                ? "bg-green-500"
                : temple?.status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {temple?.status}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {temple.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {temple?.city}, {temple?.country}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
            <Info className="h-4 w-4 mr-1" />
            {temple.mainDeity}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-2">
            {temple.description}
          </p>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => {
                setTempleId(temple?._id);
                setActiveTab("details");
              }}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm"
            >
              View Details
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm"
            >
              Delete
            </button>
            {temple?.status === "pending" && (
              <button
                onClick={handleApproveTemple}
                className="px-3 py-1 bg-green-100 dark:bg-green-600 text-green-500 dark:text-green-500 rounded-md text-sm"
              >
                Approve
              </button>
            )}
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

export default TempleCard;
