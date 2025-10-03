import { Plus, Search } from "lucide-react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { useState } from "react";
import {
  useGetAllDailyHoroscopesQuery,
  useGetSingleDailyHoroscopeQuery,
} from "../../redux/Features/DailyHoroscope/dailyHoroscopeApi";
import Loader from "../../components/Shared/Loader/Loader";
import DailyHoroscopeCard from "../../components/DailyHoroscopePage/DailyHoroscopeCard/DailyHoroscopeCard";
import AddDailyHoroscopeForm from "../../components/DailyHoroscopePage/AddDailyHoroscopeForm/AddDailyHoroscopeForm";

export type TDailyHoroscope = {
  _id: string;
  name: string;
  description: string;
  color: string;
  number: string;
  direction: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const DailyHoroscope = () => {
  const [dailyHoroscopeId, setDailyHoroscopeId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching } = useGetAllDailyHoroscopesQuery({
    keyword: searchQuery,
  });

  const {
    data: singleData,
    isLoading: isSingleDataLoading,
    isFetching: isSingleDataFetching,
  } = useGetSingleDailyHoroscopeQuery(dailyHoroscopeId);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Horoscope"
        buttonText="Add New"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setMode && setMode("add");
          setShowForm(true);
        }}
        isCategoryButtonVisible={false}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={`Search daily horoscope...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary-500 transition duration-300"
        />
      </div>

      {/* Organization List */}
      {isLoading || isFetching ? (
        <Loader size="size-10" />
      ) : data?.data?.length < 1 ? (
        <h1 className="text-center text-xl font-semibold text-gray-600">
          No Data Found
        </h1>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((data: TDailyHoroscope) => (
            <DailyHoroscopeCard
              key={data?._id}
              data={data}
              setDailyHoroscopeId={setDailyHoroscopeId}
              setMode={setMode}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddDailyHoroscopeForm
          setShowForm={setShowForm}
          defaultValues={singleData?.data}
          mode={mode}
          isSingleDataLoading={isSingleDataLoading || isSingleDataFetching}
        />
      )}
    </div>
  );
};

export default DailyHoroscope;
