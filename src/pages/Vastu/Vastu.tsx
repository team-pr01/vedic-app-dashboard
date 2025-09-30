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
import Categories from "../../components/Categories/Categories";
import VastuTips from "../../components/VastuPage/VastuTips/VastuTips";

export type TVastu = {
  _id: string;
  title: string;
  category: string;
  videoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Vastu = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetAllVastuQuery({});
  const [vastuId, setVastuId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const { data: singleVastuData } = useGetSingleVastuQuery(vastuId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vastu Management"
        buttonText="Add New Vastu Principle"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
        setShowCategoryForm={setShowCategoryForm}
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

      {/* Category management */}
      <Categories
        showModal={showCategoryForm}
        setShowModal={setShowCategoryForm}
        areaName="vastu"
      />

      <VastuTips/>
    </div>
  );
};

export default Vastu;
