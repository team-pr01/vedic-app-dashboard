import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useState } from "react";

type TFormValues = {
  title: string;
  sanskritName?: string;
  description: string;
  category: string;
  direction: string;
  imageUrl?: string;
  importance?: string;
  recommendations?: string;
};

const DIRECTIONS = [
  "north",
  "south",
  "east",
  "west",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
  "center",
] as const;

const CATEGORIES = [
  "entrance",
  "kitchen",
  "bedroom",
  "bathroom",
  "living room",
  "study room",
  "pooja room",
  "balcony",
  "garden",
] as const;

type TAddAddYogaFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddVastuForm: React.FC<TAddAddYogaFormProps> = ({ setShowForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>();

  const [tagInput, setTagInput] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);

  //   To enter recommendations
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !recommendations.includes(trimmed)) {
        const newTags = [...recommendations, trimmed];
        setRecommendations(newTags);
      }
      setTagInput("");
    }
  };

  const removeRecommendation = (tagToRemove: string) => {
    const filtered = recommendations.filter((tag) => tag !== tagToRemove);
    setRecommendations(filtered);
  };

  const handleAddVastu = (data: TFormValues) => {
    console.log("Form Data:", data);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
        <form onSubmit={handleSubmit(handleAddVastu)} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Vastu Principle
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
              label="Title"
              placeholder="Enter title"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
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

            <SelectDropdown
              label="Category"
              {...register("category")}
              error={errors?.category}
              options={[...CATEGORIES]}
            />

            <SelectDropdown
              label="Direction"
              {...register("direction")}
              error={errors?.direction}
              options={[...DIRECTIONS]}
            />

            <TextInput
              label="Image Url"
              placeholder="Enter image URL"
              {...register("imageUrl", { required: "Image Url is required" })}
              error={errors.imageUrl}
            />

            <div>
              <TextInput
                label="Recommendations"
                name="recommendations"
                placeholder="Enter recommendation. Press enter to add another"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                error={
                  Array.isArray(errors.recommendations)
                    ? errors.recommendations[0]
                    : errors.recommendations
                }
              />
              {/* Display tags below the input */}
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendations.map(
                  (recommendation: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{recommendation}</span>
                      <button
                        type="button"
                        onClick={() => removeRecommendation(recommendation)}
                        className="ml-1 text-blue-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <SelectDropdown
              label="Importance"
              {...register("importance")}
              error={errors?.importance}
              options={["high", "medium", "low"]}
            />
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
  );
};

export default AddVastuForm;
