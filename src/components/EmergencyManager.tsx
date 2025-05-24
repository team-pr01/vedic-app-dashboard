import { useState } from "react";
import { useGetAllEmergenciesQuery } from "../redux/Features/Emergencies/emergencyApi";
import EmergencyPageHeader from "./EmergencyPage/EmergencyPageHeader/EmergencyPageHeader";
import EmergencyPageFilters from "./EmergencyPage/EmergencyPageFilters/EmergencyPageFilters";
import Loader from "./Shared/Loader/Loader";
import EmergencyPostCard from "./EmergencyPage/EmergencyPostCard/EmergencyPostCard";
import EmergencyPostForm from "./EmergencyPage/EmergencyPostForm/EmergencyPostForm";

export function EmergencyManager() {
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
}
