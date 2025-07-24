import { Plus, Video } from "lucide-react";
const ReelsPageHeader = ({
  setShowForm,
  setMode,
  setShowReelCategoryForm,
}: {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setMode?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  setShowReelCategoryForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <Video className="h-6 w-6 mr-2 text-blue-500" />
        Video Reels
      </h2>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setShowReelCategoryForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Manage Categories
        </button>
        <button
          onClick={() => {
            setMode && setMode("add");
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Reel
        </button>
      </div>
    </div>
  );
};

export default ReelsPageHeader;
