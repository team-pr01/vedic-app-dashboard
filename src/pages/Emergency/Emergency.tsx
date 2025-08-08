import { useState } from "react";
import { useGetAllEmergenciesQuery } from "../../redux/Features/Emergencies/emergencyApi";
import EmergencyPageFilters from "../../components/EmergencyPage/EmergencyPageFilters/EmergencyPageFilters";
import Loader from "../../components/Shared/Loader/Loader";
import EmergencyPostCard from "../../components/EmergencyPage/EmergencyPostCard/EmergencyPostCard";
import { CheckCircle, RefreshCw, Clock, AlertTriangle } from "lucide-react";

const Emergency = () => {
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isFetching } = useGetAllEmergenciesQuery({
    keyword: searchQuery,
    status,
  });

  const resolvedCount = data?.data?.filter(
    (post: any) => post.status === "resolved"
  ).length;
  const pendingCount = data?.data?.filter(
    (post: any) => post.status === "pending"
  ).length;
  const processingCount = data?.data?.filter(
    (post: any) => post.status === "processing"
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-5">
        {/* Processing */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-center items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500" />
          <h2 className="text-gray-700 font-medium">Processing</h2>
          <h2 className="text-2xl font-semibold text-gray-900">
            {processingCount || 0}
          </h2>
        </div>

        {/* Pending */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-center items-center gap-3">
          <Clock className="w-8 h-8 text-yellow-500" />
          <h2 className="text-gray-700 font-medium">Pending</h2>
          <h2 className="text-2xl font-semibold text-gray-900">
            {pendingCount || 0}
          </h2>
        </div>

        {/* Resolved */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-center items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <h2 className="text-gray-700 font-medium">Resolved</h2>
          <h2 className="text-2xl font-semibold text-gray-900">
            {resolvedCount || 0}
          </h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
        Emergency Messages
      </h2>

      {/* Filters and Search */}
      <EmergencyPageFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setStatus={setStatus}
      />

      {/* Messages Cards */}
      <div className="flex flex-col gap-4">
        {isLoading || isFetching ? (
          <Loader size="size-10" />
        ) : (
          [...(data?.data || [])]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((post: any) => (
              <EmergencyPostCard key={post?._id} post={post} />
            ))
        )}
      </div>
    </div>
  );
};

export default Emergency;
