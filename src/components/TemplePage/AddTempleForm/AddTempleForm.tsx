import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAddTempleMutation } from "../../../redux/Features/Temple/templeApi";
import { useState } from "react";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";

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
  mediaGallery: string[];
  videoUrl?: string;
};

const AddTempleForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [mediaGallery, setMediaGallery] = useState<string[]>([]);
  const [mediaGalleryInput, setMediaGalleryInput] = useState("");

  //   To enter image
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = mediaGalleryInput.trim();
      if (trimmed && !mediaGallery.includes(trimmed)) {
        const newTags = [...mediaGallery, trimmed];
        setMediaGallery(newTags);
      }
      setMediaGalleryInput("");
    }
  };

  const removeImage = (tagToRemove: string) => {
    const filtered = mediaGallery.filter((tag) => tag !== tagToRemove);
    setMediaGallery(filtered);
  };

  const [addTemple, { isLoading }] = useAddTempleMutation();
  const handleAddTemple = async (data: TFormValues) => {
    try {
      const payload = {
        ...data,
        contactInfo : {
          phone: data.contactInfo.phone,
          email: data.contactInfo.email,
          website: data.contactInfo.website
        },
        mediaGallery,
      };

      const response = await addTemple(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Temple added successfully");
        window.location.reload();
      }
      reset();
    } catch (error) {
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data?.message === "string"
          ? (error as any).data.message
          : "Something went wrong";
      toast.error(errMsg);
    }
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

        <div>
          <TextInput
            label="Media Gallery (Image URLs) "
            name="mediaGallery"
            placeholder="Enter image url. Press enter to add another url"
            value={mediaGalleryInput}
            onChange={(e) => setMediaGalleryInput(e.target.value)}
            onKeyDown={handleKeyDown}
            error={Array.isArray(errors.mediaGallery) ? errors.mediaGallery[0] : errors.mediaGallery}
            isRequired={false}
          />
          {/* Display tags below the input */}
          <div className="flex flex-wrap gap-2 mt-2">
            {mediaGallery.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeImage(tag)}
                  className="ml-1 text-blue-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
       <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default AddTempleForm;
