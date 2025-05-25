import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import OrganizationCard from "../../components/OrganizationPage/OrganizationCard/OrganizationCard";
import AddOrganizationForm from "../../components/OrganizationPage/AddOrganizationForm/AddOrganizationForm";
import OrganizationFilters from "../../components/OrganizationPage/OrganizationFilters/OrganizationFilters";

const Organizations = () => {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const organizations = [
    {
      id: "1",
      name: "Sanskriti Gurukul",
      type: "gurukul",
      description:
        "An ancient-style educational institution focusing on holistic Vedic education and lifestyle.",
      headTeacher: "Acharya Devadutt",
      studentCapacity: 120,
      courses_offered: [
        "Vedic Mathematics",
        "Sanskrit Grammar",
        "Yoga",
        "Meditation",
      ],
      image_url: "https://i.ibb.co/0G8F6ZM/cricket-ball-1.png",
      contact: {
        email: "info@sanskritigurukul.org",
        phone: "+91-9876543210",
        website: "https://sanskritigurukul.org",
      },
      address: {
        street: "123 Veda Marg",
        city: "Rishikesh",
        state: "Uttarakhand",
        postalCode: "249201",
        country: "India",
      },
    },
    {
      id: "2",
      name: "Ved Vijnan Ashram",
      type: "ashram",
      description:
        "A spiritual retreat and learning center offering traditional knowledge in a peaceful forest setting.",
      headTeacher: "Swami Raghavananda",
      studentCapacity: 80,
      courses_offered: ["Upanishads", "Ayurveda", "Sanskrit Chanting"],
      image_url: "https://i.ibb.co/dJCMHYr/cricket-bat-1.png",
      contact: {
        email: "contact@vedvijnanashram.in",
        phone: "+91-9123456789",
        website: "https://vedvijnanashram.in",
      },
      address: {
        street: "45 Tapovan Road",
        city: "Haridwar",
        state: "Uttarakhand",
        postalCode: "249410",
        country: "India",
      },
    },
    {
      id: "3",
      name: "Vedic Wisdom Institution",
      type: "vedic_institution",
      description:
        "A modern institution with a Vedic curriculum integrating ancient knowledge with current-day practices.",
      headTeacher: "Dr. Anupam Sharma",
      studentCapacity: 200,
      courses_offered: ["Vastu Shastra", "Jyotish", "Bhagavad Gita"],
      image_url: "https://i.ibb.co/Vj0NbwK/cricket-bat-4.png",
      contact: {
        email: "admissions@vedicwisdom.edu",
        phone: "+91-9988776655",
        website: "https://vedicwisdom.edu",
      },
      address: {
        street: "88 Shanti Nagar",
        city: "Varanasi",
        state: "Uttar Pradesh",
        postalCode: "221002",
        country: "India",
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Organizations"
        buttonText="Add Organization"
        icon={<Plus className="h-4 w-4" />}
        onClick={() => {
          setShowForm(true);
        }}
      />

      {/* Filters and Search */}
      <OrganizationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setStatus={setStatus}
      />

      {/* Organization List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && <AddOrganizationForm setShowForm={setShowForm} />}
    </div>
  );
};

export default Organizations;
