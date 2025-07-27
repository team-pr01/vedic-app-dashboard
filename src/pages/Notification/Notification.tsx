import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Send } from "lucide-react";
import NotificationCard from "../../components/NotificationPage/NotificationCard/NotificationCard";
import SendNotificationForm from "./../../components/NotificationPage/SendNotificationForm/SendNotificationForm";
import { useGetAllNotificationsQuery } from "../../redux/Features/Notification/notificationApi";
import Loader from "../../components/Shared/Loader/Loader";

export const dummyNotifications = [
  {
    id: "1",
    title: "Weekly Update",
    message: "Here's your weekly update on project progress.",
    status: "sent",
    type: "Team",
    scheduled_for: "2025-06-05T10:00:00Z",
    sent_at: "2025-06-05T10:05:00Z",
  },
  {
    id: "2",
    title: "Server Maintenance",
    message: "We will perform maintenance on Sunday at 2 AM.",
    status: "scheduled",
    type: "System",
    scheduled_for: "2025-06-09T02:00:00Z",
  },
  {
    id: "3",
    title: "Policy Update",
    message:
      "Our terms of service have been updated. Please review the changes.",
    status: "failed",
    type: "User",
    scheduled_for: "2025-06-01T09:30:00Z",
  },
  {
    id: "4",
    title: "Event Reminder",
    message: "Don’t forget the company-wide Q&A session on Friday!",
    status: "sent",
    type: "Announcement",
    scheduled_for: "2025-06-03T15:00:00Z",
    sent_at: "2025-06-03T15:02:00Z",
  },
  {
    id: "5",
    title: "System Alert",
    message: "High memory usage detected on Server #12.",
    status: "scheduled",
    type: "Admin",
    scheduled_for: "2025-06-10T06:45:00Z",
  },
];

const Notification = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { data, isLoading } = useGetAllNotificationsQuery({});


  return (
    <div>
      <PageHeader
        title="Notification Center"
        buttonText="New Notification"
        icon={<Send className="w-6 h-6 mr-2 text-white" />}
        onClick={() => {
          setShowForm(true);
        }}
        setShowCategoryForm={() => {}}
        isCategoryButtonVisible={false}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <h1 className="text-center text-gray-500 dark:text-gray-100 mt-16">
          No notifications found
        </h1>
      ) : (
        <div className="flex flex-col gap-6">
          {data?.data?.map((notification: any) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      )}

      {showForm && (
        <SendNotificationForm showForm={showForm} setShowForm={setShowForm} />
      )}
    </div>
  );
};

export default Notification;
