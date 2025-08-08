import { Bell } from "lucide-react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import PopupCard, {
  TPopup,
} from "../../components/PopupsPage/PopupCard/PopupCard";
import AddPopupForm from "../../components/PopupsPage/AddPopupForm/AddPopupForm";
import {
  useGetAllPopupsQuery,
  useGetSinglePopupQuery,
} from "../../redux/Features/Popup/popupApi";
import Loader from "../../components/Shared/Loader/Loader";

export const dummyPopups = [
  {
    _id: "1",
    title: "New Feature Launch",
    content: "We're launching a new dashboard experience. Explore it now!",
    is_active: true,
    image_url: "https://source.unsplash.com/random/400x200?technology",
    start_date: "2025-06-01",
    end_date: "2025-06-10",
    target_audience: ["Students", "Admins"],
  },
  {
    _id: "2",
    title: "Maintenance Notice",
    content: "Scheduled maintenance on Saturday. Expect brief downtimes.",
    is_active: false,
    image_url: "https://source.unsplash.com/random/400x200?maintenance",
    start_date: "2025-06-15",
    end_date: "2025-06-15",
    target_audience: ["Instructors", "Managers"],
  },
  {
    _id: "3",
    title: "Summer Sale",
    content: "Special discounts on all courses for the summer season.",
    is_active: true,
    image_url: "https://source.unsplash.com/random/400x200?sale",
    start_date: "2025-06-05",
    end_date: "2025-06-30",
    target_audience: ["All Users"],
  },
];

const Popups = () => {
  const [id, setId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetAllPopupsQuery({});
  const { data: singlePopupData } = useGetSinglePopupQuery(id);
  const [mode, setMode] = useState<"add" | "edit">("add");
  return (
    <div>
      <PageHeader
        title="Popup Notifications"
        buttonText="Add Popup"
        icon={<Bell className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
        isCategoryButtonVisible={false}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <p className="text-center text-gray-500 dark:text-gray-100">
          No data found
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((popup: TPopup) => (
            <PopupCard
              key={popup._id}
              popup={popup}
              setShowForm={setShowForm}
              setMode={setMode}
              setId={setId}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddPopupForm
          showForm={showForm}
          setShowForm={setShowForm}
          defaultValues={singlePopupData?.data}
          mode={mode}
        />
      )}
    </div>
  );
};

export default Popups;
