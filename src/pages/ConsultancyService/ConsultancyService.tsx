import { Plus } from "lucide-react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import ConsultancyServiceFilters from "../../components/ConsultancyServicePage/ConsultancyServiceFilters/ConsultancyServiceFilters";
import {
  useGetAlConsultancyServicesQuery,
  useGetSingleConsultancyServiceQuery,
} from "../../redux/Features/ConsultancyService/consultancyServiceApi";
import ConsultancyServiceCard from "../../components/ConsultancyServicePage/ConsultancyServiceCard/ConsultancyServiceCard";
import Loader from "../../components/Shared/Loader/Loader";
import AddConsultancyServiceForm from "../../components/ConsultancyServicePage/AddConsultancyServiceForm/AddConsultancyServiceForm";
import Categories from "../../components/Categories/Categories";

export type TConsultancyService = {
  _id: string;
  imageUrl?: string;
  name: string;
  specialty: string;
  experience: string;
  category: string;
  availableTime: string;
  availabilityType: string[];
  fees: string;
  rating: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const ConsultancyService = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [consultancyServiceId, setConsultancyServiceId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  //   Get all Consultancy Services
  const { data, isLoading, isFetching } = useGetAlConsultancyServicesQuery({
    keyword: searchQuery,
    category,
  });

  const {
    data: singleConsultancyService,
    isLoading: isSingleDataLoading,
    isFetching: isSingleDataFetching,
  } = useGetSingleConsultancyServiceQuery(consultancyServiceId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultancy Services"
        buttonText="Add Service"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
        setShowCategoryForm={setShowCategoryForm}
      />

      {/* Filters and Search */}
      <ConsultancyServiceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCategory={setCategory}
        category={category}
      />

      {/* Organization List */}
      {isLoading || isFetching ? (
        <Loader size="size-10" />
      ) : (
         data?.data?.length < 1 ?
          <h1 className="text-center text-xl font-semibold text-gray-600">No Data Found</h1> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
         
          
          data?.data?.map((service: TConsultancyService) => (
            <ConsultancyServiceCard
              key={service?._id}
              service={service}
              setConsultancyServiceId={setConsultancyServiceId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddConsultancyServiceForm
          setShowForm={setShowForm}
          defaultValues={singleConsultancyService?.data}
          mode={mode}
          isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}

      {/* Category management */}
      <Categories showModal={showCategoryForm} setShowModal={setShowCategoryForm} areaName="consultancyService" />
    </div>
  );
};

export default ConsultancyService;
