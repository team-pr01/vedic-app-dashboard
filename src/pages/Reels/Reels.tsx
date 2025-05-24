import { useState } from "react";
import ReelsPageHeader from "../../components/ReelsPage/ReelsPageHeader/ReelsPageHeader";
import ReelCard from "../../components/ReelsPage/ReelCard/ReelCard";
import AddReelForm from "../../components/ReelsPage/AddReelForm/AddReelForm";

const Reels = () => {
  const [showForm, setShowForm] = useState(false);
  const reels: any[] = [
    {
      _id: "1",
      title: "Introduction to Vedic Meditation",
      description:
        "Learn the basics of Vedic meditation techniques and their benefits.",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      source: "youtube",
      category: "meditation",
      tags: ["meditation", "beginners", "vedic"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Understanding Vedic Rituals",
      description:
        "A comprehensive guide to common Vedic rituals and their significance.",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      source: "youtube",
      category: "rituals",
      tags: ["rituals", "traditions", "vedic"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  return (
    <div className="space-y-6">
      <ReelsPageHeader setShowForm={setShowForm} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reels.map((reel) => (
          <ReelCard key={reel._id} reel={reel} setShowForm={setShowForm} />
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      <AddReelForm showForm={showForm} setShowForm={setShowForm} />
    </div>
  );
};

export default Reels;
