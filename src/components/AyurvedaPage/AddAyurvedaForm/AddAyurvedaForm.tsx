import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import Loader from "../../Shared/Loader/Loader";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import {
  useAddAyurvedaMutation,
  useUpdateAyurvedaMutation,
} from "../../../redux/Features/Ayurveda/ayurvedaApi";
import Textarea from "../../Reusable/TextArea/TextArea";

type TAddAyurvedaFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  expertName: string;
  category: string;
  duration: string;
  content: string;
  videoUrl?: string;
  file?: FileList;
};

const AddAyurvedaForm = ({
  setShowForm,
  mode = "add",
  defaultValues,
  isSingleDataLoading,
}: TAddAyurvedaFormProps) => {
  const { data: categories } = useGetAllCategoriesQuery({});
  const [addAyurveda, { isLoading }] = useAddAyurvedaMutation();
  const [updateAyurveda, { isLoading: isUpdating }] = useUpdateAyurvedaMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  // Set default values when editing
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields = ["expertName", "category", "duration", "content", "videoUrl"] as (keyof TFormValues)[];
      fields.forEach((field) => {
        if (defaultValues[field]) {
          setValue(field, defaultValues[field]);
        }
      });
    }
  }, [defaultValues, mode, setValue]);

  const onSubmit = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file" && value instanceof FileList && value.length > 0) {
          formData.append("file", value[0]);
        } else if (value) {
          formData.append(key, value as string);
        }
      });

      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateAyurveda({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Ayurveda updated");
      } else {
        response = await addAyurveda(formData).unwrap();
        toast.success(response?.message || "Ayurveda added");
      }

      reset();
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  const filteredCategory = categories?.data?.filter(
    (category: any) => category.areaName === "ayurveda"
  );

  const allCategories = filteredCategory?.map((category: any) => category.category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {mode === "edit" && isSingleDataLoading ? (
          <div className="flex items-center justify-center h-full min-h-[90vh]">
            <Loader size="size-10" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {mode === "edit" ? "Edit Ayurveda" : "Add Ayurveda"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <TextInput
                label="Expert Name"
                placeholder="Enter expert name"
                {...register("expertName", { required: "Expert name is required" })}
                error={errors.expertName}
              />
              <TextInput
                label="Duration"
                placeholder="Enter duration (ex : 10mins)"
                {...register("duration", { required: "Duration is required" })}
                error={errors.duration}
              />
              <Textarea
                label="Content"
                placeholder="Enter content"
                {...register("content", { required: "Content is required" })}
                error={errors.content}
              />
              <TextInput
                label="Video URL"
                placeholder="Add video URL"
                {...register("videoUrl")}
                error={errors.videoUrl as any}
              />
              <SelectDropdown
                label="Category"
                {...register("category", { required: "Category is required" })}
                error={errors?.category}
                options={allCategories}
              />

              {/* File upload */}
              <TextInput
                label="Image"
                type="file"
                {...register("file")}
                error={errors.file as any}
                isRequired={false}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <SubmitButton isLoading={isLoading || isUpdating} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAyurvedaForm;
