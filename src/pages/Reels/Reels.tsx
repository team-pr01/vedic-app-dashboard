import { useState } from "react";
import ReelsPageHeader from "../../components/ReelsPage/ReelsPageHeader/ReelsPageHeader";
import ReelCard from "../../components/ReelsPage/ReelCard/ReelCard";
import AddReelForm from "../../components/ReelsPage/AddReelForm/AddReelForm";
import {
  useGetAllReelsQuery,
  useGetSingleReelQuery,
} from "../../redux/Features/Reels/reelsApi";
import Loader from "../../components/Shared/Loader/Loader";
import Categories from "../../components/Categories/Categories";

export type TReels = {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoSource: string;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};


const Reels = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetAllReelsQuery({});
  const [reelId, setReelId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const { data: singleReelData } = useGetSingleReelQuery(reelId);
  return (
    <div className="space-y-6">
      <ReelsPageHeader setShowForm={setShowForm} setMode={setMode} setShowCategoryForm={setShowCategoryForm}  />

      {isLoading ? (
        <Loader size="size-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((reel: TReels) => (
            <ReelCard
              key={reel._id}
              reel={reel}
              setShowForm={setShowForm}
              setMode={setMode}
              setReelId={setReelId}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AddReelForm
        showForm={showForm}
        setShowForm={setShowForm}
        defaultValues={singleReelData?.data}
        mode={mode}
      />

      {/* Category management */}
      <Categories showModal={showCategoryForm} setShowModal={setShowCategoryForm} areaName="reels" />
    </div>
  );
};

export default Reels;
