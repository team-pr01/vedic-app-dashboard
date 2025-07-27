import { Dispatch, FC, SetStateAction, useState } from "react";
import { Pencil, Trash2, Star, Clock } from "lucide-react";
import { TConsultancyService } from "../../../pages/ConsultancyService/ConsultancyService";
import { useDeleteConsultancyServiceMutation } from "../../../redux/Features/ConsultancyService/consultancyServiceApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../DeleteConfirmationModal/DeleteConfirmationModal";

type TConsultancyServiceCardProps = {
  service: TConsultancyService;
  setConsultancyServiceId: (id: string) => void;
  setMode: Dispatch<SetStateAction<"add" | "edit">>;
  setShowForm: (show: boolean) => void;
};

const ConsultancyServiceCard: FC<TConsultancyServiceCardProps> = ({
  service,
  setConsultancyServiceId,
  setMode,
  setShowForm,
}) => {
  const handleEdit = () => {
    setConsultancyServiceId(service._id);
    setMode("edit");
    setShowForm(true);
  };

  const [deleteConsultancyService] = useDeleteConsultancyServiceMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    toast.promise(deleteConsultancyService(service?._id).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
  };

  return (
    <>
      <div className="flex gap-4 p-4 rounded-2xl shadow-md bg-white items-center hover:shadow-lg transition">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="size-32 object-cover rounded-full border"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">
            {service.name}
          </h2>
          <p className="text-sm text-[#fa5a5a] font-medium">
            {service.specialty}
          </p>
          <p className="text-sm text-gray-500">
            {service.experience} years experience
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <Star size={16} className="text-yellow-500" />
            <span className="font-medium">{service.rating}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-green-500">
            <Clock size={16} />
            <span>{service.availableTime}</span>
          </div>
          <div className="flex gap-2 mt-2">
            {service?.availabilityType?.map((type) => (
              <div
                key={type}
                className="text-xs border px-2 py-1 rounded-full text-blue-600 hover:bg-blue-50 flex items-center gap-1"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
        <div className="text-right flex flex-col gap-2 items-end">
          <p className="text-lg font-bold text-emerald-600">৳{service.fees}</p>
          <div className="flex gap-2">
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

export default ConsultancyServiceCard;
