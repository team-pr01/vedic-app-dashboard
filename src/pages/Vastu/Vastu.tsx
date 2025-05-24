import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import VastuCard from "../../components/VastuPage/VastuCard/VastuCard";
import AddVastuForm from "../../components/VastuPage/AddVastuForm/AddVastuForm";

const samplePrinciples: any[] = [
  {
    _id: "1",
    title: "Main Entrance",
    description:
      "The main entrance is one of the most important elements in Vastu Shastra as it is the primary source of energy entering the house.",
    category: "entrance",
    direction: "north",
    recommendations: [
      "Should face North or East",
      "Avoid South-West entrance",
      "Keep entrance well-lit",
      "Ensure door opens clockwise",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1555443805-658637491dd4?auto=format&fit=crop&w=1000&q=80",
    importance: "high",
  },
  {
    _id: "2",
    title: "Kitchen Placement",
    description:
      "The kitchen is associated with the fire element and its placement affects the health and prosperity of the household.",
    category: "kitchen",
    direction: "southeast",
    recommendations: [
      "Southeast corner is ideal",
      "Cooking facing East",
      "Avoid North-East location",
      "Keep water sources away",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80",
    importance: "high",
  },
];

const Vastu = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Yoga Asanas Management"
        buttonText="Add New Principle"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePrinciples.map((vastu) => (
          <VastuCard key={vastu?._id} vastu={vastu} setShowForm={setShowForm} />
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && <AddVastuForm setShowForm={setShowForm} />}
    </div>
  );
};

export default Vastu;
