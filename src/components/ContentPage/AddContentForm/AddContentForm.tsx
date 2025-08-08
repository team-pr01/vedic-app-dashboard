import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Loader from "../../Shared/Loader/Loader";
import {
  useAddContentMutation,
  useUpdateContentMutation,
} from "../../../redux/Features/Content/contentApi";
import toast from "react-hot-toast";
import { useEffect } from "react";

type TFormValues = {
  videoUrl?: string;
  file?: any;
};

const AddContentForm = ({
  showForm,
  setShowForm,
  mode = "add",
  setMode,
  defaultValues,
}: {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  setMode?: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  defaultValues?: any;
}) => {
  const [addContent, { isLoading }] = useAddContentMutation();
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields = ["videoUrl"] as (keyof TFormValues)[];
      fields.forEach((field) => setValue(field, defaultValues[field]));
    }
  }, [defaultValues, mode, setValue]);

  const handleSubmitContent = async (data: TFormValues) => {
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
        response = await updateContent({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Content updated");
      } else {
        response = await addContent(formData).unwrap();
        toast.success(response?.message || "Content added");
      }

      reset();
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSubmitContent)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === "add" ? "Add New" : "Update"} Content
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMode && setMode("add");
                  reset();
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <TextInput
                label="Video Url"
                placeholder="Enter video url"
                {...register("videoUrl")}
                error={errors.videoUrl}
                isRequired={false}
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
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading || isUpdating ? <Loader size="size-4" /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddContentForm;
