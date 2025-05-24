import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useState } from "react";

type TFormValues = {
  name: string;
  sanskritName?: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // in seconds
  benefits: string[];
  contraindications: string[];
  categories: string[];
  createdBy: string;
};

type TAddAddYogaFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddYogaForm: React.FC<TAddAddYogaFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>();

  const [tagInputs, setTagInputs] = useState({
    benefits: "",
    contraindications: "",
    categories: "",
  });

  const [allTags, setAllTags] = useState<{
    benefits: string[];
    contraindications: string[];
    categories: string[];
  }>({
    benefits: [],
    contraindications: [],
    categories: [],
  });

  const handleTagInputChange = (
    field: keyof typeof tagInputs,
    value: string
  ) => {
    setTagInputs((prev) => ({ ...prev, [field]: value }));
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof typeof allTags
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInputs[field].trim();
      if (trimmed && !allTags[field].includes(trimmed)) {
        setAllTags((prev: any) => ({
          ...prev,
          [field]: [...prev[field], trimmed],
        }));
      }
      setTagInputs((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const removeTag = (field: keyof typeof allTags, tagToRemove: string) => {
    setAllTags((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((tag: string) => tag !== tagToRemove),
    }));
  };

  const handleAddYoga = (data: TFormValues) => {
    console.log("Yoga data submitted:", data);
  };

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleAddYoga)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Yoga
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Name"
                placeholder="Enter yoga name"
                {...register("name", { required: "Name is required" })}
                error={errors.name}
              />

              <TextInput
                label="Sanskrit Name"
                placeholder="Enter Sanskrit Name"
                {...register("sanskritName", {
                  required: "Sanskrit Name is required",
                })}
                error={errors.sanskritName}
              />

              <Textarea
                label="Description"
                placeholder="Write description here..."
                rows={6}
                error={errors.description}
                {...register("description", {
                  required: "Description is required",
                })}
              />

              <TextInput
                label="Image Url"
                placeholder="Enter image URL"
                {...register("imageUrl", { required: "Image Url is required" })}
                error={errors.imageUrl}
              />

              <TextInput
                label="Video Url"
                placeholder="Enter video URL"
                {...register("videoUrl", { required: "Video Url is required" })}
                error={errors.videoUrl}
              />

              <SelectDropdown
                label="Difficulty"
                {...register("difficulty")}
                error={errors?.difficulty}
                options={["Beginner", "Intermediate", "Advanced"]}
              />

              <TextInput
                label="Duration (seconds)"
                placeholder="Enter yoga duration in seconds"
                {...register("duration", { required: "Duration is required" })}
                error={errors.duration}
              />

              {/* Benefits */}
              <div>
                <TextInput
                  label="Benefits"
                  name="benefits"
                  placeholder="Enter benefit. Press enter to add"
                  value={tagInputs.benefits}
                  onChange={(e) =>
                    handleTagInputChange("benefits", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "benefits")}
                  error={
                    Array.isArray(errors.benefits)
                      ? errors.benefits[0]
                      : errors.benefits
                  }
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags.benefits.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag("benefits", tag)}
                        className="ml-1 text-blue-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contraindications */}
              <div className="mb-4">
                <TextInput
                  label="Contraindications"
                  name="contraindications"
                  placeholder="Enter contraindication. Press enter to add"
                  value={tagInputs.contraindications}
                  onChange={(e) =>
                    handleTagInputChange("contraindications", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "contraindications")}
                  error={
                    Array.isArray(errors.contraindications)
                      ? errors.contraindications[0]
                      : errors.contraindications
                  }
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags.contraindications.map(
                    (tag: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag("contraindications", tag)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <TextInput
                  label="Categories"
                  name="categories"
                  placeholder="Enter category. Press enter to add"
                  value={tagInputs.categories}
                  onChange={(e) =>
                    handleTagInputChange("categories", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "categories")}
                  error={
                    Array.isArray(errors.categories)
                      ? errors.categories[0]
                      : errors.categories
                  }
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags.categories.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag("categories", tag)}
                        className="ml-1 text-green-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddYogaForm;
