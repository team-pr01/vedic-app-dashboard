import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import YogaCard from "../../components/YogaPage/YogaCard/YogaCard";
import AddYogaForm from "../../components/YogaPage/AddYogaForm/AddYogaForm";

interface YogaAsana {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  imageUrl: string;
  videoUrl: string;
  contraindications: string[];
  category: string[];
}

const yogas: YogaAsana[] = [
  {
    id: "1",
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    description:
      "A standing pose that forms the foundation for all standing poses.",
    benefits: [
      "Improves posture",
      "Strengthens thighs, knees, and ankles",
      "Firms abdomen and buttocks",
    ],
    difficulty: "beginner",
    duration: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80",
    videoUrl: "https://player.vimeo.com/video/252333618",
    category: ["standing", "foundation"],
    contraindications: ["High blood pressure", "Headache"],
  },
  {
    id: "2",
    name: "Tree Pose",
    sanskritName: "Vrksasana",
    description:
      "A standing balance pose that improves focus and concentration.",
    benefits: [
      "Improves balance",
      "Strengthens legs and core",
      "Increases focus",
    ],
    difficulty: "intermediate",
    duration: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1552286450-4a669f880062?auto=format&fit=crop&w=1000&q=80",
    videoUrl: "https://player.vimeo.com/video/252333987",
    category: ["standing", "balance"],
    contraindications: ["Knee injuries", "Ankle problems"],
  },
];

const Yoga = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Yoga Asanas Management"
        buttonText="Add New Asana"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yogas.map((yoga) => (
          <YogaCard key={yoga.id} yoga={yoga} setShowForm={setShowForm} />
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      <AddYogaForm showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
};

export default Yoga;
