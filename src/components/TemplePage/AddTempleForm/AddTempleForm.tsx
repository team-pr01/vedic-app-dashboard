import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import { Upload } from "lucide-react";

export type TFormValues = {
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
};

const AddTempleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>();

  const handleAddTemple = async (data: TFormValues) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(handleAddTemple)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Add New Temple
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Name"
          placeholder="Enter temple name"
          {...register("name", { required: "Name is required" })}
          error={errors.name}
        />

        <TextInput
          label="Main Deity"
          placeholder="Enter deity name"
          {...register("mainDeity", { required: "Main Deity is required" })}
          error={errors.mainDeity}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Write description here..."
        rows={6}
        error={errors.description}
        {...register("description", {
          required: "Description is required",
        })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Address"
          placeholder="Enter your address"
          {...register("address", { required: "Address is required" })}
          error={errors.address}
        />

        <TextInput
          label="City"
          placeholder="Enter your city"
          {...register("city", { required: "City is required" })}
          error={errors.city}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="State/Province"
          placeholder="Enter your state"
          {...register("state", { required: "State/Province is required" })}
          error={errors.state}
        />

        <TextInput
          label="Country"
          placeholder="Enter your country name"
          {...register("country", { required: "Country is required" })}
          error={errors.country}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Established Year"
          type="number"
          placeholder="Enter the year"
          {...register("establishedYear", {
            required: "Established Year is required",
            valueAsNumber: true,
          })}
          error={errors.establishedYear}
        />

        <TextInput
          label="Visiting Hours"
          placeholder="e.g. 6:00 AM - 9:00 PM"
          {...register("visitingHours", {
            required: "Visiting Hours are required",
          })}
          error={errors.visitingHours}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TextInput
          label="Phone"
          type="text"
          placeholder="Enter phone number"
          {...register("contactInfo.phone", {
            required: "Phone number is required",
          })}
          error={errors.contactInfo?.phone}
        />

        <TextInput
          label="Email"
          type="email"
          placeholder="Enter email address"
          {...register("contactInfo.email", {
            required: "Email is required",
          })}
          error={errors.contactInfo?.email}
        />

        <TextInput
          label="Website"
          type="url"
          placeholder="https://example.com"
          {...register("contactInfo.website")}
          error={errors.contactInfo?.website}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Temple Image URL"
          type="text"
          placeholder="Enter image URL"
          {...register("imageUrl", {
            required: "Image URL is required",
          })}
          error={errors.imageUrl}
        />

        <TextInput
          label="Temple Video URL (optional)"
          type="text"
          placeholder="Enter video URL"
          {...register("videoUrl")}
          error={errors.videoUrl}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Add Temple
        </button>
      </div>
    </form>
  );
};

export default AddTempleForm;
