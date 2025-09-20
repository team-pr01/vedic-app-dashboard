import { useState } from "react";
import { useDeleteDonationMutation, useGetAllDonationsQuery } from "../../redux/Features/Donation/donationApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { CreditCard, Search, Trash2 } from "lucide-react";
import Loader from "../../components/Shared/Loader/Loader";

const TotalDonations = () => {
    const [selectedDonationId, setSelectedDonationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    data: donations,
    isLoading,
    isFetching,
  } = useGetAllDonationsQuery({
    keyword: searchQuery,
  });

  const [deleteDonation] = useDeleteDonationMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleConfirmDelete = async () => {
    toast.promise(deleteDonation(selectedDonationId).unwrap(), {
      loading: "Deleting...",
      success: "Deleted successfully!",
      error: "Failed to delete.",
    });
    setSelectedDonationId("");
  };
  return (
     <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          All Donations
        </h2>
          <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search donations...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
          />
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-900">
            <tr>
              {[
                "User Name",
                "User Email",
                "User Phone",
                "Amount",
                "Donation Date",
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
              {donations?.data?.length > 0 ? (
                donations.data.map(
                  (donation: any & { _id: string }) => (
                    <tr key={donation._id}>
                      {[
                        donation.userName,
                        donation.userEmail,
                        donation.userPhoneNumber,
                        donation.amount,
                        donation.createdAt
                          ? new Date(donation.createdAt).toLocaleString()
                          : "N/A",
                      ].map((field, idx) => (
                        <td
                          key={idx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {field}
                        </td>
                      ))}

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSelectedDonationId(donation._id);
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
                    No donation found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>

        {showDeleteModal && (
          <DeleteConfirmationModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default TotalDonations;
