import { useState } from "react";
import { useGetAllDonationProgramsQuery, useGetSingleDonationProgramsQuery } from "../../redux/Features/DonationPrograms/donationProgramApi";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import Loader from "../../components/Shared/Loader/Loader";
import DonationCard from "../../components/Donationprograms/DonationCard/DonationCard";
import AddDonationForm from "../../components/Donationprograms/AddDonationForm/AddDonationForm";

export type TDonationPrograms = {
  _id: string;
  imageUrl?: string;
  title: string;
  description: string;
  amountNeeded: number;
  amountRaised?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const DonationPrograms = () => {
  const [donationId, setDonationId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  //   Get all Consultancy Services
  const { data, isLoading, isFetching } = useGetAllDonationProgramsQuery({});

  const {
    data: singleDonationData,
    isLoading: isSingleDataLoading,
    isFetching: isSingleDataFetching,
  } = useGetSingleDonationProgramsQuery(donationId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Programs"
        buttonText="Add New"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
        isCategoryButtonVisible={false}
      />

      {/* Organization List */}
      {isLoading || isFetching ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <h1 className="text-center text-xl font-semibold text-gray-600">
          No Data Found
        </h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((donation: TDonationPrograms) => (
            <DonationCard
              key={donation?._id}
              donation={donation}
              setDonationId={setDonationId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddDonationForm
          setShowForm={setShowForm}
          defaultValues={singleDonationData?.data}
          mode={mode}
          isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}
    </div>
  );
};

export default DonationPrograms;
