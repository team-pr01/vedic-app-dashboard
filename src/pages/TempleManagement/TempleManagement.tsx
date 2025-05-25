import { useState } from "react";
import TempleCard from "../../components/TemplePage/TempleCard/TempleCard";
import AddTempleForm from "../../components/TemplePage/AddTempleForm/AddTempleForm";
import TempleDetails from "./TempleDetails/TempleDetails";

const TempleManagement = () => {
  const temples = [
    {
      _id: "1",
      name: "Shree Krishna Temple",
      description: "A beautiful temple dedicated to Lord Krishna.",
      location: {
        address: "123 Temple Street",
        city: "Vrindavan",
        state: "Uttar Pradesh",
        country: "India",
      },
      images: ["https://example.com/image1.jpg"],
      deity: "Lord Krishna",
      establishedYear: 1985,
      contactInfo: {
        phone: "+91-1234567890",
        email: "hello",
      },
    },
  ];
  const [activeTab, setActiveTab] = useState("list");
  const [selectedTemple, setSelectedTemple] = useState(null);

  const tabButtons = [
    { key: "list", label: "Temple List" },
    { key: "add", label: "Add New Temple", resetSelection: true },
    { key: "details", label: "Temple Details", condition: selectedTemple },
  ];
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => (
            <TempleCard
              key={temple._id}
              temple={temple}
              setSelectedTemple={setSelectedTemple}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>
      )}

      {activeTab === "add" && <AddTempleForm />}

      {activeTab === "details" && selectedTemple && (
        <TempleDetails selectedTemple={selectedTemple} />
      )}
    </div>
  );
};

export default TempleManagement;
