import { Plus } from "lucide-react";
import PageHeader from "../../Reusable/PageHeader/PageHeader";
import VastuTipsCard from "./VastuTipsCard/VastuTipsCard";
import { useState } from "react";
import Loader from "../../Shared/Loader/Loader";
import { useGetAllVastuTipsQuery } from "../../../redux/Features/Vastu/vastuTipsApi";

export type TVastuTips = {
  _id: string;
  imageUrl: string;
  title: string;
  tips: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

const VastuTips = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [vastuTipsId, setVastuTipsId] = useState<string | null>("");
  const { data, isLoading } = useGetAllVastuTipsQuery({});
  return (
    <div className="mt-10">
      <PageHeader
        title="Popular Vastu Tips"
        buttonText="Add New Vastu Tips"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
        isCategoryButtonVisible={false}
      />
        {isLoading ? (
          <Loader size="size-10" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((vastuTip: TVastuTips) => (
              <VastuTipsCard
                key={vastuTip?._id}
                data={vastuTip}
                setShowForm={setShowForm}
                setMode={setMode}
                setVastuTipsId={setVastuTipsId}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default VastuTips;
