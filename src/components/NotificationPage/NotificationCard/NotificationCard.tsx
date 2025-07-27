import { Calendar, Trash2, Users } from "lucide-react";
import React from "react";
import { useDeleteNotificationMutation } from "../../../redux/Features/Notification/notificationApi";
import toast from "react-hot-toast";

type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  targetedAudience: string[];
};

type NotificationCardProps = {
  notification: Notification;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDeleteNews = async (id: string) => {
    console.log(id);
    if (!window.confirm("Are you sure you want to delete?")) return;

    toast.promise(deleteNotification(id).unwrap(), {
      loading: "Deleting notification...",
      success: "Notification deleted successfully!",
      error: "Failed to delete notification.",
    });
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {notification.title}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteNews(notification?._id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-2 text-gray-600 dark:text-gray-300 bg-gray-200/70 p-3 rounded-lg">
        <span className="text-blue-500">Message</span>
        <p className="italic font-medium mt-1">{notification?.message}</p>
      </div>

      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        <Calendar className="h-4 w-4 mr-1" />
        Received At: {new Date(notification?.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default NotificationCard;
