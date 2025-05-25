import { Edit2, Trash2 } from "lucide-react";
import { TReels } from "../../../pages/Reels/Reels";
import { useDeleteReelMutation } from "../../../redux/Features/Reels/reelsApi";
import toast from "react-hot-toast";

const ReelCard = ({
  reel,
  setShowForm,
}: {
  reel: TReels;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [deleteReel] = useDeleteReelMutation();

  const handleDeleteReel = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteReel(id).unwrap(), {
      loading: "Deleting reel...",
      success: "Reel deleted successfully!",
      error: "Failed to delete reel.",
    });
  };

  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]{11})/);
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };

  const embedUrl = reel?.videoUrl ? getEmbedUrl(reel.videoUrl) : null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-video">
        <iframe
          src={embedUrl as string}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {reel?.title}
            </h3>
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                {reel?.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                {reel?.videoSource}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowForm(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteReel(reel?._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {reel?.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {reel?.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Added{" "}
          {reel?.createdAt
            ? new Date(reel.createdAt).toLocaleDateString()
            : "Unknown"}
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
