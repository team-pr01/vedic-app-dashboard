import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useEffect } from "react";
import { TVastu } from "../../../pages/Vastu/Vastu";
import toast from "react-hot-toast";
import {
  useAddVastuMutation,
  useUpdateVastuMutation,
} from "../../../redux/Features/Vastu/vastuApi";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";

type TFormValues = {
  title: string;
  category: string;
  videoUrl: string;
};

type TAddAddYogaFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: TVastu;
};

const AddVastuForm: React.FC<TAddAddYogaFormProps> = ({
  setShowForm,
  mode,
  defaultValues,
}) => {
  const { data: categories } = useGetAllCategoriesQuery({});
  const [addVastu, { isLoading }] = useAddVastuMutation();
  const [updateVastu, { isLoading: isVastuUpdating }] =
    useUpdateVastuMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      setValue("title", defaultValues?.title);
      setValue("category", defaultValues?.category);
      setValue("videoUrl", defaultValues?.videoUrl);
    }
  }, [defaultValues, mode, setValue]);

  //   Function to add or edit vastu
  const handleSubmitVastu = async (data: TFormValues) => {
    try {
      const payload = {
        ...data,
      };

      let response;
      if (mode === "edit" && defaultValues?._id) {
        // Update API
        console.log(defaultValues?._id);
        response = await updateVastu({
          id: defaultValues?._id,
          data: payload,
        }).unwrap();
        if (response?.success) {
          toast.success(response?.message || "Vastu updated successfully");
        }
      } else {
        // Add API
        response = await addVastu(payload).unwrap();
        if (response?.success) {
          toast.success(response?.message || "Vastu added successfully");
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
    (category: any) => category.areaName === "vastu"
  );

  const allCategories = filteredCategory?.map(
    (category: any) => category.category
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
        <form
          onSubmit={handleSubmit(handleSubmitVastu)}
          className="p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Vastu Principle
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
              label="Title"
              placeholder="Enter title"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
            />

            <SelectDropdown
              label="Category"
              {...register("category")}
              error={errors?.category}
              options={allCategories}
            />

            <TextInput
              label="Video Url"
              placeholder="Enter Video URL"
              {...register("videoUrl", { required: "Video Url is required" })}
              error={errors.videoUrl}
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
            <SubmitButton isLoading={isLoading || isVastuUpdating} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVastuForm;
