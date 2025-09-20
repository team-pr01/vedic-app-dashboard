import { Pen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { TDonationPrograms } from "../../../pages/DonationPrograms/DonationPrograms";
import { useDeleteDonationProgramMutation } from "../../../redux/Features/DonationPrograms/donationProgramApi";

interface DonationCardProps {
  donation: TDonationPrograms;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setDonationId: React.Dispatch<React.SetStateAction<string>>;
}

const DonationCard = ({
  donation,
  setDonationId,
  setShowForm,
  setMode,
}: DonationCardProps) => {
  const [deleteDonationProgram] = useDeleteDonationProgramMutation();
  const handleDeleteDonation = async (id: string) => {
    console.log(id);
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteDonationProgram(id).unwrap(), {
      loading: "Deleting Popup...",
      success: "Popup deleted successfully!",
      error: "Failed to delete Popup.",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <img
        src={donation?.imageUrl}
        alt={donation?.title}
        className="w-full h-82 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {donation?.title}
            </h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setMode && setMode("edit");
                setDonationId && setDonationId(donation?._id);
                setShowForm && setShowForm(true);
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Pen className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteDonation(donation?._id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 capitalize">
          {donation?.description}
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 capitalize">
         Amount Raised {donation?.amountRaised} out of {donation?.amountNeeded}
        </p>
      </div>
    </div>
  );
};

export default DonationCard;
