import { useForm } from "react-hook-form";
import { useAddProductBannerMutation } from "../../../redux/Features/ProductBanner/productBannerApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";

type TFormValues = {
  title: string;
  description: string;
  link: string;
  file?: FileList;
};

const AddProductBannerForm = ({ setShowForm }: any) => {
  const [addProductBanner, { isLoading }] = useAddProductBannerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

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

      const response = await addProductBanner(formData).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Product banner added.");
      }

      reset();
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Add Product Banner
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
              label="Title"
              placeholder="Enter banner title"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
            />

            <TextInput
              label="Link"
              placeholder="Add banner link"
              {...register("link", {
                required: "Link is required",
              })}
              error={errors.link}
            />

            <Textarea
              label="Description"
              placeholder="Enter banner description"
              {...register("description", {
                required: "Description is required",
              })}
              error={errors.description}
              rows={4}
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
            <SubmitButton isLoading={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductBannerForm;
