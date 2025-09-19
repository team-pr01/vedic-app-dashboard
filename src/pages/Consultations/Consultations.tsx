import { Check, Eye, Trash2, UserCheck } from "lucide-react";
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
import Filters from "../../components/Reusable/Filters/Filters";

const Consultations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const {
    data: consultations,
    isLoading,
    isFetching,
  } = useGetAllConsultationsQuery({
    keyword: searchQuery,
    category,
    status,
  });
  const [updateConsultationStatus, { isLoading: isUpdatingStatus }] =
    useUpdateConsultationStatusMutation();
  const [isScheduleModalOpen, setIsScheduleModalOpen] =
    useState<boolean>(false);
  const [selectedConsultationId, setSelectedConsultationId] =
    useState<string>("");
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(
    null
  );

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

  const handleCancelConsultation = async (id: string) => {
    try {
      const payload = {
        status: "cancelled",
      };
      const response = await updateConsultationStatus({
        data: payload,
        id,
      }).unwrap();
      toast.success(response?.message || "Consultation cancelled.");
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCheck className="h-6 w-6 mr-2" />
          Consultations
        </h2>
        <div className="flex items-center gap-2">
          <Filters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCategory={setCategory}
            category={category}
            fieldName="consultancyService"
            placeholder="consultations..."
          />
          <select
            value={status}
            onChange={(e) => setStatus && setStatus(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="">All</option>
            <option value={"pending"}>Pending</option>
            <option value={"completed"}>Completed</option>
            <option value={"cancelled"}>Cancelled</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-900">
            <tr>
              {[
                "User Name",
                "User Phone",
                "Consultant Name",
                "Consultant Phone",
                "Scheduled At",
                "Category",
                "Status",
                "Created At",
                "Manage Consultation",
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
                        consultation.category,
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

                      {/* Schedule & Cancel Buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <button
                          className={`px-3 py-1 text-sm font-medium rounded-md text-white ${
                            consultation.status === "cancelled"
                              ? "bg-orange-800 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                          disabled={consultation.status === "cancelled"}
                          onClick={() => {
                            setIsScheduleModalOpen(true);
                            setSelectedConsultationId(consultation._id);
                          }}
                        >
                          Schedule
                        </button>

                        <button
                          className={`px-3 py-1 text-sm font-medium rounded-md text-white ${
                            consultation.status === "cancelled"
                              ? "bg-red-800 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                          disabled={
                            consultation.status === "cancelled" ||
                            isUpdatingStatus
                          }
                          onClick={() =>
                            handleCancelConsultation(consultation._id)
                          }
                        >
                          {isUpdatingStatus ? "Cancelling..." : "Cancel"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setSelectedConsultation(consultation)
                            }
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleMarkAsCompleted(consultation._id)
                            }
                            disabled={consultation.status === "cancelled"}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-blue-300 disabled:cursor-not-allowed"
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
