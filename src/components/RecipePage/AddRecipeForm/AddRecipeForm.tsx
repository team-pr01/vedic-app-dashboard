import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useEffect } from "react";
import toast from "react-hot-toast";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { TRecipe } from "../../../pages/Recipe/Recipe";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";
import {
  useAddRecipeMutation,
  useUpdateRecipeMutation,
} from "../../../redux/Features/Recipe/recipeApi";

type TFormValues = {
  name: string;
  videoUrl: string;
  category: string;
  duration: string;
};

type TAddAddRecipeFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: TRecipe;
};

const AddRecipeForm: React.FC<TAddAddRecipeFormProps> = ({
  showForm,
  setShowForm,
  mode,
  defaultValues,
}) => {
  const { data: categories } = useGetAllCategoriesQuery({});
  const [addRecipe, { isLoading }] = useAddRecipeMutation();
  const [updateRecipe, { isLoading: isYogaUpdating }] =
    useUpdateRecipeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  // Fetching default values
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setValue("name", defaultValues.name);
      setValue("videoUrl", defaultValues.videoUrl);
      setValue("category", defaultValues.category);
      setValue("duration", defaultValues.duration);
    }
  }, [defaultValues, mode, setValue]);

  //   Function to add or edit yoga
  const handleSubmitRecipe = async (data: TFormValues) => {
    try {
      const payload = {
        ...data,
      };

      let response;
      if (mode === "edit" && defaultValues?._id) {
        // Update API
        console.log(defaultValues?._id);
        response = await updateRecipe({
          id: defaultValues?._id,
          data: payload,
        }).unwrap();
        if (response?.success) {
          toast.success("Reel updated successfully");
        }
      } else {
        // Add API
        response = await addRecipe(payload).unwrap();
        if (response?.success) {
          toast.success(response?.message || "Reel added successfully");
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

  const filteredCategory = categories?.data?.filter(
    (category: any) => category.areaName === "recipe"
  );

  const allCategories = filteredCategory?.map(
    (category: any) => category.category
  );

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSubmitRecipe)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Recipe
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
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
                label="Video URl"
                placeholder="Enter video url"
                {...register("videoUrl", { required: "Video url is required" })}
                error={errors.videoUrl}
              />

              <TextInput
                label="Duration"
                placeholder="Enter recipe duration"
                {...register("duration", {
                  required: "Duration is required",
                })}
                error={errors.duration}
              />

              <SelectDropdown
                label="Category"
                {...register("category")}
                error={errors?.category}
                options={allCategories}
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
              <SubmitButton isLoading={isLoading || isYogaUpdating} />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddRecipeForm;
