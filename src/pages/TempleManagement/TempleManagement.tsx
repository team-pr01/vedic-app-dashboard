import { useState } from "react";
import TempleCard from "../../components/TemplePage/TempleCard/TempleCard";
import AddTempleForm from "../../components/TemplePage/AddTempleForm/AddTempleForm";
import TempleDetails from "./TempleDetails/TempleDetails";
import { useGetAllTempleQuery, useGetSingleTempleQuery } from "../../redux/Features/Temple/templeApi";
import Loader from "../../components/Shared/Loader/Loader";

export type TTemple = {
  _id: string;
  name: string;
  mainDeity: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  establishedYear: number;
  visitingHours: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  imageUrl: string;
  videoUrl?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};
const TempleManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedTemple, setSelectedTemple] = useState(null);
  const {data, isLoading} = useGetAllTempleQuery({});
  const [templeId, setTempleId] = useState("");
  const { data: singleTempleuData } = useGetSingleTempleQuery(templeId);

  const tabButtons = [
    { key: "list", label: "Temple List" },
    { key: "add", label: "Add New Temple", resetSelection: true },
    { key: "details", label: "Temple Details", condition: selectedTemple },
  ];

  console.log(data);
  return (
    <div>
      <div className="flex space-x-4 mb-6">
        {tabButtons
          .filter((tab) => tab.condition === undefined || tab.condition)
          .map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.resetSelection) {
                  setSelectedTemple(null);
                }
              }}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {activeTab === "list" && (
        isLoading ?
        <Loader size="size-10" />
        :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((temple:TTemple) => (
            <TempleCard
              key={temple?._id}
              temple={temple}
              setActiveTab={setActiveTab}
              setTempleId={setTempleId}
            />
          ))}
        </div>
      )}

      {activeTab === "add" && <AddTempleForm />}

      {activeTab === "details" && (
        <TempleDetails templeDetails={singleTempleuData?.data} />
      )}
    </div>
  );
};

export default TempleManagement;
