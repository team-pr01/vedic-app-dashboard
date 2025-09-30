import { Plus } from "lucide-react";
import PageHeader from "../../Reusable/PageHeader/PageHeader";
import VastuTipsCard from "./VastuTipsCard/VastuTipsCard";
import { useState } from "react";
import Loader from "../../Shared/Loader/Loader";
import {
  useGetSingleVastuTipsQuery,
} from "../../../redux/Features/Vastu/vastuTipsApi";
import ManageVastuTipsForm from "./ManageVastuTipsForm/ManageVastuTipsForm";

export type TVastuTips = {
  _id: string;
  imageUrl: string;
  title: string;
  tips: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

const VastuTips = ({data, isLoading} : {data: any, isLoading: boolean}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [vastuTipsId, setVastuTipsId] = useState<string | null>("");
  
  const {
    data: singleVastuTipsData,
    isFetching,
    isLoading: isSingleDataLoading,
  } = useGetSingleVastuTipsQuery(vastuTipsId);
  return (
    <div className="pt-10">
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
      ) : data?.data?.length < 1 ? (
        <p>No vastu tips added</p>
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <ManageVastuTipsForm
          setShowForm={setShowForm}
          defaultValues={singleVastuTipsData?.data}
          mode={mode}
          setMode={setMode}
          isLoading={isSingleDataLoading || isFetching}
        />
      )}
    </div>
  );
};

export default VastuTips;
