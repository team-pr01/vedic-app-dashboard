import { Bell } from "lucide-react";
import { PopupManager } from "../../components/PopupManager";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import PopupCard from "../../components/PopupsPage/PopupCard/PopupCard";
import AddPopupForm from "../../components/PopupsPage/AddPopupForm/AddPopupForm";

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
  const [showForm, setShowForm] = useState(false);
  //   const { data, isLoading } = useGetAllVastuQuery({});
  const [vastuId, setVastuId] = useState("");
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
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {dummyPopups.map((popup) => (
          <PopupCard
            key={popup._id}
            popup={popup}
            //   setCurrentPopup={setCurrentPopup}
            //   setPreviewMode={setPreviewMode}
            //   setIsEditing={setIsEditing}
            setShowForm={setShowForm}
            //   handleDelete={handleDelete}
          />
        ))}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <AddPopupForm
            showForm={showForm}
            setShowForm={setShowForm}
            //   defaultValues={singleVastuData?.data}
            mode={mode}
          />
        )}
      </div>
      <PopupManager />
    </div>
  );
};

export default Popups;
