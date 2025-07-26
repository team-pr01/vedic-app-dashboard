import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  useAddReelMutation,
  useUpdateReelMutation,
} from "../../../redux/Features/Reels/reelsApi";
import toast from "react-hot-toast";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { TReels } from "../../../pages/Reels/Reels";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";

type TFormValues = {
  title: string;
  description: string;
  videoSource: string;
  videoUrl: string;
  category: string;
  tags: string[];
};

type TAddReelFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: TReels;
};

const AddReelForm: React.FC<TAddReelFormProps> = ({
  showForm,
  setShowForm,
  mode,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const { data: categories } = useGetAllCategoriesQuery({});

  // Fetching default values
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
      setValue("videoSource", defaultValues.videoSource);
      setValue("videoUrl", defaultValues.videoUrl);
      setValue("category", defaultValues.category);
      setTags(defaultValues.tags || []);
    }
  }, [defaultValues, mode, setValue]);

  const [addReel, { isLoading }] = useAddReelMutation();
  const [updateReel, { isLoading: isReelUpdating }] = useUpdateReelMutation();

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  //   Function to add or edit reel
  const handleSubmitReel = async (data: TFormValues) => {
    try {
      const payload = {
        ...data,
        tags,
      };

      let response;
      if (mode === "edit" && defaultValues?._id) {
        // Update API
        response = await updateReel({
          id: defaultValues?._id,
          data: payload,
        }).unwrap();
        if (response?.success) {
          toast.success("Reel updated successfully");
        }
      } else {
        // Add API
        response = await addReel(payload).unwrap();
        if (response?.success) {
          toast.success("Reel added successfully");
        }
      }

      setShowForm(false);
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

  //   To enter tags
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        const newTags = [...tags, trimmed];
        setTags(newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const filtered = tags.filter((tag) => tag !== tagToRemove);
    setTags(filtered);
  };

  const allCategories = categories?.data?.map(
    (category: any) => category.category
  );

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSubmitReel)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Reel
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Title"
                placeholder="Enter video title"
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

              <TextInput
                label="Video Source"
                placeholder="Enter video source (e.g., youtube, vimeo)"
                {...register("videoSource", {
                  required: "Video source is required",
                })}
                error={errors.videoSource}
              />

              <TextInput
                label="Video Url"
                placeholder="Enter video URL"
                {...register("videoUrl", { required: "Video Url is required" })}
                error={errors.videoUrl}
              />

              <SelectDropdown
                label="Category"
                {...register("category")}
                error={errors?.category}
                options={allCategories}
              />

              <div>
                <TextInput
                  label="Tags"
                  name="tags"
                  placeholder="Enter tag. Press enter to add another tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  error={
                    Array.isArray(errors.tags) ? errors.tags[0] : errors.tags
                  }
                  isRequired={false}
                />
                {/* Display tags below the input */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-500 hover:text-red-500"
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
              <SubmitButton isLoading={isLoading || isReelUpdating} />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddReelForm;
