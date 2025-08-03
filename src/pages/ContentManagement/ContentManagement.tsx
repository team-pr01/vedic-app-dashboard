import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import AddContentForm from "../../components/ContentPage/AddContentForm/AddContentForm";
import { useGetAllContentsQuery, useGetSingleContentQuery } from "../../redux/Features/Content/contentApi";
import Loader from "../../components/Shared/Loader/Loader";
import ContentCard from "../../components/ContentPage/ContentCard/ContentCard";

const ContentManagement = () => {
  const { data, isLoading } = useGetAllContentsQuery({});
  const [showForm, setShowForm] = useState(false);
  const [contentId, setContentId] = useState<string>("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const {
      data: singleContent,
      isLoading: isSingleDataLoading,
      isFetching: isSingleDataFetching,
    } = useGetSingleContentQuery(contentId);

  return (
    <div>
      <PageHeader
        title="Content Management"
        buttonText="Add New Content"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => setShowForm(true)}
        isCategoryButtonVisible={false}
      />

      {isLoading ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <h1 className="text-center text-xl font-semibold text-gray-600">
          No Data Found
        </h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data?.map((content: any) => (
            <ContentCard
              key={content?._id}
              content={content}
              setContentId={setContentId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <AddContentForm
          setShowForm={setShowForm}
          defaultValues={singleContent?.data}
          mode={mode}
          showForm={showForm}
          setMode={setMode}
          // isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}
    </div>
  );
};

export default ContentManagement;
