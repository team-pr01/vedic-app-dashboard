import { Pen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDeletePopupMutation } from "../../../redux/Features/Popup/popupApi";

export type TPopup = {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  displayFrequency: string;
};

interface PopupCardProps {
  popup: TPopup;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

const PopupCard = ({ popup, setId, setShowForm, setMode }: PopupCardProps) => {
  const [deletePopup] = useDeletePopupMutation();
  const handleDeletePopup = async (id: string) => {
    console.log(id);
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deletePopup(id).unwrap(), {
      loading: "Deleting Popup...",
      success: "Popup deleted successfully!",
      error: "Failed to delete Popup.",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <img
        src={popup?.imageUrl}
        alt={popup?.title}
        className="w-full h-82 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {popup?.title}
            </h3>
            {/* <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                popup?.is_active
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {popup?.is_active ? "Active" : "Inactive"}
            </span> */}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setMode && setMode("edit");
                setId && setId(popup?._id);
                setShowForm && setShowForm(true);
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Pen className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeletePopup(popup?._id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 capitalize">
          {popup?.content}
        </p>

        <p className="mt-5 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          Display Frequency : {popup?.displayFrequency}
        </p>
      </div>
    </div>
  );
};

export default PopupCard;
