import { Check, Eye, Trash2 } from "lucide-react";
import Loader from "../../components/Shared/Loader/Loader";
import {
  useDeleteConsultationMutation,
  useGetAllConsultationsQuery,
  useUpdateConsultationStatusMutation,
} from "../../redux/Features/Consultation/consultationApi";
import { useState } from "react";
import ScheduleConsultationForm from "./../../components/ConsultationPage/ScheduleConsultationForm/ScheduleConsultationForm";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import ConsultationDetails from "../../components/ConsultationPage/ConsultationDetails/ConsultationDetails";

const Consultations = () => {
  const {
    data: consultations,
    isLoading,
    isFetching,
  } = useGetAllConsultationsQuery({});
  const [updateConsultationStatus] = useUpdateConsultationStatusMutation();
  const [isScheduleModalOpen, setIsScheduleModalOpen] =
    useState<boolean>(false);
  const [selectedConsultationId, setSelectedConsultationId] =
    useState<string>("");
    const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);

  const handleMarkAsCompleted = async (id: string) => {
    const payload = {
      status: "completed",
    };
    toast.promise(
      updateConsultationStatus({
        data: payload,
        id,
      }).unwrap(),
      {
        loading: "Loading...",
        success: "Marked as completed successfully!",
        error: "Failed to mark as completed.",
      }
    );
  };

  const [deleteConsultation] = useDeleteConsultationMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleConfirmDelete = async () => {
    toast.promise(deleteConsultation(selectedConsultationId).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
    setSelectedConsultationId("");
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-900">
            <tr>
              {[
                "User Name",
                "User Phone",
                "Consultant Name",
                "Consultant Phone",
                "Scheduled At",
                "Status",
                "Created At",
                "Schedule Consultation", // <-- New column
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <tbody>
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center items-center py-10">
                    <Loader size="size-10" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 max-w-[1000px] capitalize">
              {consultations?.data?.length > 0 ? (
                consultations.data.map(
                  (consultation: any & { _id: string }) => (
                    <tr key={consultation._id}>
                      {[
                        consultation.userName,
                        consultation.userPhoneNumber,
                        consultation.consultantName,
                        consultation.consultantPhoneNumber,
                        consultation.scheduledAt
                          ? new Date(consultation.scheduledAt).toLocaleString()
                          : "N/A",
                        consultation.status || "pending",
                        consultation.createdAt
                          ? new Date(consultation.createdAt).toLocaleString()
                          : "N/A",
                      ].map((field, idx) => (
                        <td
                          key={idx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {field}
                        </td>
                      ))}

                      {/* Schedule Consultation Button */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          className="px-3 py-1 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                          onClick={() => {
                            setIsScheduleModalOpen(true);
                            setSelectedConsultationId(consultation._id);
                          }}
                        >
                          Schedule
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setSelectedConsultation(consultation)} className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleMarkAsCompleted(consultation._id)
                            }
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-blue-300"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSelectedConsultationId(consultation._id);
                            }}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No consultation found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>

        {isScheduleModalOpen && (
          <ScheduleConsultationForm
            onClose={() => setIsScheduleModalOpen(false)}
            consultationId={selectedConsultationId}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
          />
        )}

        {selectedConsultation && (
  <ConsultationDetails
    consultation={selectedConsultation}
    onClose={() => setSelectedConsultation(null)}
  />
)}
      </div>
    </div>
  );
};

export default Consultations;
