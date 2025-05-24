import { useState } from "react";
import { useGetAllEmergenciesQuery } from "../../redux/Features/Emergencies/emergencyApi";
import EmergencyPageHeader from "../../components/EmergencyPage/EmergencyPageHeader/EmergencyPageHeader";
import EmergencyPageFilters from "../../components/EmergencyPage/EmergencyPageFilters/EmergencyPageFilters";
import Loader from "../../components/Shared/Loader/Loader";
import EmergencyPostCard from "../../components/EmergencyPage/EmergencyPostCard/EmergencyPostCard";
import EmergencyPostForm from "../../components/EmergencyPage/EmergencyPostForm/EmergencyPostForm";

const Emergency = () => {
  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isFetching } = useGetAllEmergenciesQuery({
    keyword: searchQuery,
    status,
  });
  return (
    <div className="space-y-6">
      <EmergencyPageHeader setShowForm={setShowForm} />

      {/* Filters and Search */}
      <EmergencyPageFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setStatus={setStatus}
      />

      {/* Messages Cards */}
      <div className="flex flex-col gap-4">
        {isLoading || isFetching ? (
          <Loader />
        ) : (
          data?.data?.map((post: any) => (
            <EmergencyPostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* New Message Form Modal */}
      <EmergencyPostForm showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
};

export default Emergency;
