import { Plus } from "lucide-react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import { useGetAllAyurvedaQuery, useGetSingleAyurvedaQuery } from "../../redux/Features/Ayurveda/ayurvedaApi";
import Filters from "../../components/Reusable/Filters/Filters";

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

  const { data: singleAyurvedaData, isLoading: isSingleDataLoading, isFetching: isSingleDataFetching } = useGetSingleAyurvedaQuery(ayurvedaId);

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
    </div>
  );
};

export default Ayurveda;
