import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import YogaCard from "../../components/YogaPage/YogaCard/YogaCard";
import AddYogaForm from "../../components/YogaPage/AddYogaForm/AddYogaForm";
import {
  useGetAllYogaQuery,
  useGetSingleYogaQuery,
} from "../../redux/Features/Yoga/yogaApi";
import Loader from "../../components/Shared/Loader/Loader";

export type TYoga = {
  _id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  imageUrl: string;
  videoUrl: string;
  contraindications: string[];
  categories: string[];
};

const Yoga = () => {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetAllYogaQuery({});
  const [yogaId, setYogaId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const { data: singleYogaData } = useGetSingleYogaQuery(yogaId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Yoga Asanas Management"
        buttonText="Add New Asana"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((yoga: TYoga) => (
            <YogaCard
              key={yoga._id}
              yoga={yoga}
              setShowForm={setShowForm}
              setMode={setMode}
              setYogaId={setYogaId}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AddYogaForm
        showForm={showForm}
        setShowForm={setShowForm}
        defaultValues={singleYogaData?.data}
        mode={mode}
      />
    </div>
  );
};

export default Yoga;
