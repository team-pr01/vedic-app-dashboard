import { Plus } from "lucide-react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import {
  useGetAllAyurvedaQuery,
  useGetSingleAyurvedaQuery,
} from "../../redux/Features/Ayurveda/ayurvedaApi";
import Filters from "../../components/Reusable/Filters/Filters";
import Loader from "../../components/Shared/Loader/Loader";
import AyurvedaCard from "../../components/AyurvedaPage/AyurvedaCard/AyurvedaCard";
import AddAyurvedaForm from "../../components/AyurvedaPage/AddAyurvedaForm/AddAyurvedaForm";
import Categories from "../../components/Categories/Categories";

export type TAyurveda = {
    _id : string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  expertName: string;
  duration: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Ayurveda = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [ayurvedaId, setAyurvedaId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  // Get all Ayurveda items
  const { data, isLoading, isFetching } = useGetAllAyurvedaQuery({
    keyword: searchQuery,
    category,
  });

  const {
    data: singleAyurvedaData,
    isLoading: isSingleDataLoading,
    isFetching: isSingleDataFetching,
  } = useGetSingleAyurvedaQuery(ayurvedaId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ayurveda"
        buttonText="Add New Ayurveda"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode("add");
          setShowForm(true);
        }}
        setShowCategoryForm={setShowCategoryForm}
      />
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCategory={setCategory}
        category={category}
        fieldName="ayurveda"
      />

      {/* Ayurveda List */}
      {isLoading || isFetching ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <h1 className="text-center text-xl font-semibold text-gray-600">
          No Data Found
        </h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data?.map((ayurveda: TAyurveda) => (
            <AyurvedaCard
              key={ayurveda?._id}
              ayurveda={ayurveda}
              setAyurvedaId={setAyurvedaId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddAyurvedaForm
          setShowForm={setShowForm}
          defaultValues={singleAyurvedaData?.data}
          mode={mode}
          isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}

      {/* Category management */}
      <Categories
        showModal={showCategoryForm}
        setShowModal={setShowCategoryForm}
        areaName="ayurveda"
      />
    </div>
  );
};

export default Ayurveda;
