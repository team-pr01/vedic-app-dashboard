import { Calendar, Check, Trash2, Users, X } from "lucide-react";
import React from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  status: "scheduled" | "sent" | "failed";
  type: string;
  scheduled_for: string;
  sent_at?: string;
};

type NotificationCardProps = {
  notification: Notification;
  onDelete: (id: string) => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {notification.title}
          </h3>
          {/* <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              notification.status === "scheduled"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : notification.status === "sent"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {notification.status?.toUpperCase()}
          </span> */}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onDelete(notification?._id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-gray-600 dark:text-gray-300">{notification?.message}</p>

      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
           Sent: {new Date(notification?.createdAt).toLocaleString()}
        </span>
        <span className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {notification?.targetedAudience?.join(", ")}
        </span>
      </div>
    </div>
  );
};

export default NotificationCard;
