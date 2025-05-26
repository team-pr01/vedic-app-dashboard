import { Compass, Edit2, HomeIcon, Trash2 } from "lucide-react";
import { TVastu } from "../../../pages/Vastu/Vastu";
import toast from "react-hot-toast";
import { useDeleteVastuMutation } from "../../../redux/Features/Vastu/vastuApi";

type TVastuCardProps = {
  vastu: TVastu;
  setShowForm: (show: boolean) => void;
  setMode?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setVastuId?: React.Dispatch<React.SetStateAction<string>>;
};
const VastuCard: React.FC<TVastuCardProps> = ({ vastu, setShowForm, setMode, setVastuId }) => {
   const [deleteVastu] = useDeleteVastuMutation();
    const handleDeleteVastu = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete?")) return;
  
      toast.promise(deleteVastu(id).unwrap(), {
        loading: "Deleting vastu...",
        success: "Vastu deleted successfully!",
        error: "Failed to delete vastu.",
      });
    };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <img
        src={vastu?.imageUrl}
        alt={vastu?.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {vastu.title}
            </h3>
            <div className="flex items-center mt-1">
              <Compass className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {vastu.direction}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              vastu.importance === "high"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : vastu.importance === "medium"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {vastu.importance} priority
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {vastu.description}
        </p>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Recommendations:
          </h4>
          <ul className="mt-2 space-y-1">
            {vastu?.recommendations?.map((rec: string, index: number) => (
              <li
                key={index}
                className="text-sm text-gray-600 dark:text-gray-300 flex items-center"
              >
                <HomeIcon className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
            {vastu.category}
          </span>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={() => {
              setVastuId && setVastuId(vastu?._id);
              setMode && setMode("edit");
              setShowForm(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button onClick={() => handleDeleteVastu(vastu?._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VastuCard;
