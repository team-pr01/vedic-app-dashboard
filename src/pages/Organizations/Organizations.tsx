import { useState } from "react";
import PageHeader from "../../components/Reusable/PageHeader/PageHeader";
import { Plus } from "lucide-react";
import OrganizationCard from "../../components/OrganizationPage/OrganizationCard/OrganizationCard";
import AddOrganizationForm from "../../components/OrganizationPage/AddOrganizationForm/AddOrganizationForm";

const defaultOrganization = [
    {
  name: "",
  type: "gurukul",
  description: "",
  established_year: new Date().getFullYear(),
  contact: {
    email: "",
    phone: "",
    website: "",
  },
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  },
  head_teacher: "",
  student_capacity: 0,
  courses_offered: [],
  facilities: [],
  is_active: true,
}
];

const Organizations = () => {
    const [showForm, setShowForm] = useState(false);
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
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search organizations..."
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          // value={filter}
          // onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Types</option>
          <option value="gurukul">Gurukul</option>
          <option value="vedic_institution">Vedic Institution</option>
          <option value="ashram">Ashram</option>
        </select>
      </div>

      {/* Organization List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultOrganization.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddOrganizationForm setShowForm={setShowForm} />
      )}
    </div>
    );
};

export default Organizations;