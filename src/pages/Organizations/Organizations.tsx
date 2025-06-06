import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import OrganizationCard from "../../components/OrganizationPage/OrganizationCard/OrganizationCard";
import AddOrganizationForm from "../../components/OrganizationPage/AddOrganizationForm/AddOrganizationForm";
import OrganizationFilters from "../../components/OrganizationPage/OrganizationFilters/OrganizationFilters";
import {
  useGetAllOrganizationQuery,
  useGetSingleOrganizationQuery,
} from "../../redux/Features/Organization/organizationApi";
import Loader from "../../components/Shared/Loader/Loader";

export type TOrganization = {
  _id: string;
  name: string;
  type: "gurukul" | "vedic_institution" | "ashram";
  description: string;
  headTeacher: string;
  imageUrl: string;
  studentCapacity: number;
  coursesOffered: string[];
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

const Organizations = () => {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isFetching } = useGetAllOrganizationQuery({
    keyword: searchQuery,
    status,
  });

  const [organizationId, setOrganizationId] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const { data: singleOrganizationData } =
    useGetSingleOrganizationQuery(organizationId);

    console.log(data);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Organizations"
        buttonText="Add Organization"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
      />

      {/* Filters and Search */}
      <OrganizationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setStatus={setStatus}
      />

      {/* Organization List */}
      {isLoading || isFetching ? (
        <Loader size="size-10" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((org: TOrganization) => (
            <OrganizationCard
              key={org._id}
              org={org}
              setOrganizationId={setOrganizationId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddOrganizationForm
          setShowForm={setShowForm}
          defaultValues={singleOrganizationData?.data}
          mode={mode}
        />
      )}
    </div>
  );
};

export default Organizations;
