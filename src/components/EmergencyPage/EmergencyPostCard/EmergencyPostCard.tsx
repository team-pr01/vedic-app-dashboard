import {
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
  Timer,
  Trash2,
  Users,
} from "lucide-react";
import {
  useChangeStatusToResolvedMutation,
  useDeleteEmergencyMutation,
} from "../../../redux/Features/Emergencies/emergencyApi";
import toast from "react-hot-toast";
import { useState } from "react";
import EmergencyPostForm from "../EmergencyPostForm/EmergencyPostForm";

type TEmergencyPostCardProps = {
  post: any;
};
const EmergencyPostCard: React.FC<TEmergencyPostCardProps> = ({ post }) => {
  const [deleteEmergency] = useDeleteEmergencyMutation();
  const [changeStatusToResolved] = useChangeStatusToResolvedMutation();

  const handleChangeStatus = async (messageId: string, status: string) => {
    try {
      toast.promise(
        changeStatusToResolved({ id: messageId, status: status }).unwrap(),
        {
          loading: "Updating emergency post status...",
          success: `Emergency post marked as ${status}",`,
          error: "Failed to update status.",
        }
      );
    } catch (error) {
      console.error("Error resolving message:", error);
      toast.error("Failed to resolve message");
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    toast.promise(deleteEmergency(messageId).unwrap(), {
      loading: "Deleting emergency post...",
      success: "Emergency post deleted successfully!",
      error: "Failed to delete emergency post.",
    });
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text); // mark as copied

      setTimeout(() => {
        setCopiedId(null); // reset after 3 seconds
      }, 3000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [postData, setPostData] = useState(null);
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {post._id}
              </h3>
              {copiedId === post._id ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy
                  className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => handleCopy(post._id)}
                />
              )}
            </div>

            <div className="flex items-center mt-3 space-x-2 ">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.status === "resolved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : post.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : " text-gray-800 bg-blue-200 dark:text-gray-200"
                }`}
              >
                {post.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {post.message}
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            <h1 className="text-purple-600 font-semibold mt-4">User Info</h1>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {post?.user?.name || "Unknown User"}
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {post?.user?.email || "No Email"}
              </span>
              <a
                href={`tel:${post?.user?.phoneNumber}`}
                className="flex items-center hover:underline w-fit text-green-600"
              >
                <Phone className="h-4 w-4 mr-1" />
                {post?.user?.phoneNumber || "No Phone"}
              </a>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {post?.location || "No Location"}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {(post?.status === "pending" || post?.status === "processing") && (
              <button
                onClick={() => handleChangeStatus(post._id, "resolved")}
                className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-lg dark:text-green-400 dark:hover:bg-green-900/20"
              >
                Resolved
              </button>
            )}

            {post?.status === "pending" && (
              <button
                onClick={() => handleChangeStatus(post._id, "processing")}
                className="px-2 py-1 text-xs bg-blue-200 rounded-lg dark:text-green-400 dark:hover:bg-green-900/20 "
              >
                Processing
              </button>
            )}

            {post?.status === "processing" && (
              <button
                onClick={() => handleChangeStatus(post._id, "pending")}
                className="px-2 py-1 text-xs text-yellow-600 bg-yellow-100 rounded-lg dark:text-green-400 dark:hover:bg-green-900/20 "
              >
                Pending
              </button>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowForm(true);
                  setPostData(post);
                }}
                className="p-2 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-red-900/20"
              >
                <Send className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(post?._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* New Message Form Modal */}
      <EmergencyPostForm showForm={showForm} setShowForm={setShowForm} postData={postData} />
    </>
  );
};

export default EmergencyPostCard;
