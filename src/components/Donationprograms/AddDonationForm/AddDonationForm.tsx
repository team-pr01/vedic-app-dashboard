import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import Loader from "../../Shared/Loader/Loader";
import {
  useCreateDonationProgramMutation,
  useUpdateDonationProgramMutation,
} from "../../../redux/Features/DonationPrograms/donationProgramApi";

type TAddDonationFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  title: string;
  description: string;
  amountNeeded: number;
  amountRaised?: string;
  currency?: string;
  file?: FileList;
};

const AddDonationForm = ({
  setShowForm,
  mode = "add",
  defaultValues,
  isSingleDataLoading,
}: TAddDonationFormProps) => {
  const [createDonationProgram, { isLoading }] =
    useCreateDonationProgramMutation();
  const [updateDonationProgram, { isLoading: isUpdating }] =
    useUpdateDonationProgramMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields = [
        "title",
        "description",
        "amountNeeded",
        "currency",
      ] as (keyof TFormValues)[];
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
        response = await updateDonationProgram({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Service updated");
      } else {
        response = await createDonationProgram(formData).unwrap();
        toast.success(response?.message || "Service added");
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
        {mode === "edit" && isSingleDataLoading ? (
          <div className="flex items-center justify-center h-full min-h-[90vh]">
            <Loader size="size-10" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {mode === "edit" ? "Edit" : "Add"} Donation Program
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
                placeholder="Enter title"
                {...register("title", { required: "Title is required" })}
                error={errors.title}
              />
              <TextInput
                label="Description"
                placeholder="Enter description"
                {...register("description", {
                  required: "description is required",
                })}
                error={errors.description}
              />
              <TextInput
                label="Amount Needed"
                placeholder="e.g., 1000"
                {...register("amountNeeded", {
                  required: "Amount Needed is required",
                })}
                error={errors.amountNeeded}
              />
              <TextInput
                label="Currency"
                placeholder="e.g., $, USD, BDT etc"
                {...register("currency", {
                  required: "Currency is required",
                })}
                error={errors.currency}
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

export default AddDonationForm;
