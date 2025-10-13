import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Send } from "lucide-react";
import NotificationCard from "../../components/NotificationPage/NotificationCard/NotificationCard";
import SendNotificationForm from "./../../components/NotificationPage/SendNotificationForm/SendNotificationForm";
import { useGetAllNotificationsQuery } from "../../redux/Features/Notification/notificationApi";
import Loader from "../../components/Shared/Loader/Loader";

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
