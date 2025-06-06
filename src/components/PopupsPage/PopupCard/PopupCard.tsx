import { Calendar, Check, Eye, Trash2 } from "lucide-react";

interface Popup {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  image_url?: string;
  start_date: string;
  end_date: string;
  target_audience: string[];
}

interface PopupCardProps {
  popup: Popup;
  setCurrentPopup: (popup: Popup) => void;
  setPreviewMode: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
  setShowForm: (value: boolean) => void;
  handleDelete: (id: string) => void;
}

const PopupCard = ({
  popup,
  setCurrentPopup,
  setPreviewMode,
  setIsEditing,
  setShowForm,
  handleDelete,
}: PopupCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {popup.image_url && (
        <img
          src={popup.image_url}
          alt={popup.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {popup.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                popup.is_active
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {popup.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCurrentPopup(popup);
                setPreviewMode(true);
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setCurrentPopup(popup);
                setIsEditing(true);
                setShowForm(true);
              }}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(popup.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {popup.content}
        </p>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(popup.start_date).toLocaleDateString()} -{" "}
            {new Date(popup.end_date).toLocaleDateString()}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {popup.target_audience.map((audience, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {audience}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopupCard;
