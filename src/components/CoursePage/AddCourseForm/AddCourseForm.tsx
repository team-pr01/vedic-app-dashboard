import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import Loader from "../../Shared/Loader/Loader";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useAddCourseMutation, useUpdateCourseMutation } from "../../../redux/Features/Course/courseApi";

type TAddCourseFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  name: string;
  category: string;
  duration: string;
  url: string;
  file?: FileList;
};

const AddCourseForm = ({
  setShowForm,
  mode = "add",
  defaultValues,
  isSingleDataLoading,
}: TAddCourseFormProps) => {
  const { data: categories } = useGetAllCategoriesQuery({});
  const [addCourse, { isLoading }] =
    useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] =
    useUpdateCourseMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields = ["name", "category", "duration", "url"] as (keyof TFormValues)[];
      fields.forEach((field) => setValue(field, defaultValues[field]));
    }
  }, [defaultValues, mode, setValue]);

  const onSubmit = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file" && value instanceof FileList && value.length > 0) {
          formData.append("file", value[0]);
        } else {
          formData.append(key, value as string);
        }
      });

      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateCourse({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Course updated");
      } else {
        response = await addCourse(formData).unwrap();
        toast.success(response?.message || "Course added");
      }

      reset();
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  const filteredCategory = categories?.data?.filter(
    (category: any) => category.areaName === "course"
  );

  const allCategories = filteredCategory?.map(
    (category: any) => category.category
  );

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
                {mode === "edit" ? "Edit" : "Add"} Consultancy Service
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
                label="Name"
                placeholder="Enter name"
                {...register("name", { required: "Name is required" })}
                error={errors.name}
              />
              <TextInput
                label="Course Duration"
                placeholder="Enter course duration"
                {...register("duration", { required: "Duration is required" })}
                error={errors.duration}
              />
              <TextInput
                label="Course URL"
                placeholder="Add course url"
                {...register("url", { required: "URL is required" })}
                error={errors.url}
              />
              <SelectDropdown
                label="Category"
                {...register("category")}
                error={errors?.category}
                options={allCategories}
              />

              {/* File upload */}
              <TextInput
                label="Image"
                type="file"
                {...register("file")}
                error={errors.file as any}
                isRequired={mode === "add"}
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

export default AddCourseForm;
