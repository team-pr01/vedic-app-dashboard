import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import VastuCard from "../../components/VastuPage/VastuCard/VastuCard";
import AddVastuForm from "../../components/VastuPage/AddVastuForm/AddVastuForm";
import {
  useGetAllVastuQuery,
  useGetSingleVastuQuery,
} from "../../redux/Features/Vastu/vastuApi";
import Loader from "../../components/Shared/Loader/Loader";

export type TVastu = {
  _id: string;
  title: string;
  description: string;
  category: string;
  direction: string;
  imageUrl: string;
  importance: "high" | "medium" | "low";
  recommendations: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Vastu = () => {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetAllVastuQuery({});
  const [vastuId, setVastuId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const { data: singleVastuData } = useGetSingleVastuQuery(vastuId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vastu Management"
        buttonText="Add New Principle"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((vastu: TVastu) => (
            <VastuCard
              key={vastu?._id}
              vastu={vastu}
              setShowForm={setShowForm}
              setMode={setMode}
              setVastuId={setVastuId}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddVastuForm
          setShowForm={setShowForm}
          defaultValues={singleVastuData?.data}
          mode={mode}
        />
      )}
    </div>
  );
};

export default Vastu;
