import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import { useAddTempleMutation } from "../../../redux/Features/Temple/templeApi";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../redux/Features/Auth/authSlice";

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
  phone: string;
  email: string;
  website?: string;
  file: any;
  mediaGallery: string[];
  videoUrl?: string;
};

const AddTempleForm = () => {
  const user = useSelector(useCurrentUser) as any;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  // const [mediaGallery, setMediaGallery] = useState<string[]>([]);
  // const [mediaGalleryInput, setMediaGalleryInput] = useState("");

  //   To enter image
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     const trimmed = mediaGalleryInput.trim();
  //     if (trimmed && !mediaGallery.includes(trimmed)) {
  //       const newTags = [...mediaGallery, trimmed];
  //       setMediaGallery(newTags);
  //     }
  //     setMediaGalleryInput("");
  //   }
  // };

  // const removeImage = (tagToRemove: string) => {
  //   const filtered = mediaGallery.filter((tag) => tag !== tagToRemove);
  //   setMediaGallery(filtered);
  // };

  const [addTemple, { isLoading }] = useAddTempleMutation();
  const handleAddTemple = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file" && value instanceof FileList && value.length > 0) {
          formData.append("file", value[0]);
        } else {
          formData.append(key, value as string);
        }
      });

      // Creator ID
      formData.append("createdBy", user?._id);

      const response = await addTemple(formData).unwrap();
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
          {...register("phone", {
            required: "Phone number is required",
          })}
          error={errors.phone}
        />

        <TextInput
          label="Email"
          type="email"
          placeholder="Enter email address"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email}
        />

        <TextInput
          label="Website"
          placeholder="https://example.com"
          {...register("website")}
          error={errors.website}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File upload */}
        <TextInput
          label="Image"
          type="file"
          {...register("file")}
          error={errors.file as any}
        />

        <TextInput
          label="Temple Video URL (optional)"
          type="text"
          placeholder="Enter video URL"
          {...register("videoUrl")}
          error={errors.videoUrl}
        />

        {/* <div>
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
        </div> */}
      </div>

      <div className="flex justify-end">
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default AddTempleForm;
