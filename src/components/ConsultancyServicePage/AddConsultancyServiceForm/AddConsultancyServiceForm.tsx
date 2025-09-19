import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import {
  useAddConsultancyServiceMutation,
  useUpdateConsultancyServiceMutation,
} from "../../../redux/Features/ConsultancyService/consultancyServiceApi";
import Loader from "../../Shared/Loader/Loader";
import { useGetAllCategoriesQuery } from "../../../redux/Features/Categories/ReelCategory/categoriesApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";

type TConsultancyServiceFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  name: string;
  phoneNumber: string;
  email?: string;
  specialty: string;
  experience: string;
  category: string;
  availableTime: string;
  fees: string;
  rating: string;
  file?: FileList;
};

const AddConsultancyServiceForm = ({
  setShowForm,
  mode = "add",
  defaultValues,
  isSingleDataLoading,
}: TConsultancyServiceFormProps) => {
  const { data: categories } = useGetAllCategoriesQuery({});
  const [addConsultancyService, { isLoading }] =
    useAddConsultancyServiceMutation();
  const [updateConsultancyService, { isLoading: isUpdating }] =
    useUpdateConsultancyServiceMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [availabilityInput, setAvailabilityInput] = useState("");
  const [availabilityType, setAvailabilityType] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields = [
        "name",
        "specialty",
        "experience",
        "category",
        "availableTime",
        "fees",
        "rating",
      ] as (keyof TFormValues)[];
      fields.forEach((field) => setValue(field, defaultValues[field]));
      setAvailabilityType(defaultValues.availabilityType || []);
    }
  }, [defaultValues, mode, setValue]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = availabilityInput.trim();
      if (trimmed && !availabilityType.includes(trimmed)) {
        setAvailabilityType([...availabilityType, trimmed]);
      }
      setAvailabilityInput("");
    }
  };

  const removeAvailability = (tag: string) => {
    setAvailabilityType(availabilityType.filter((t) => t !== tag));
  };

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
      availabilityType.forEach((type) =>
        formData.append("availabilityType", type)
      );

      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateConsultancyService({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Service updated");
      } else {
        response = await addConsultancyService(formData).unwrap();
        toast.success(response?.message || "Service added");
      }

      reset();
      setAvailabilityType([]);
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  const filteredCategory = categories?.data?.filter(
    (category: any) => category.areaName === "consultancyService"
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
                label="Phone Number"
                type="number"
                placeholder="Enter phone number"
                {...register("phoneNumber", { required: "Phone number is required" })}
                error={errors.phoneNumber}
              />
              <TextInput
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                error={errors.email}
                isRequired={false}
              />
              <TextInput
                label="Specialty"
                placeholder="Enter specialty"
                {...register("specialty", {
                  required: "Specialty is required",
                })}
                error={errors.specialty}
              />
              <TextInput
                label="Experience"
                placeholder="e.g., 5 years"
                {...register("experience", {
                  required: "Experience is required",
                })}
                error={errors.experience}
              />
              <SelectDropdown
                label="Category"
                {...register("category")}
                error={errors?.category}
                options={allCategories}
              />
              <TextInput
                label="Available Time"
                placeholder="e.g., 3:00 PM"
                {...register("availableTime", {
                  required: "Available time is required",
                })}
                error={errors.availableTime}
              />
              <TextInput
                label="Fees"
                placeholder="Enter fees"
                {...register("fees", { required: "Fees is required" })}
                error={errors.fees}
              />
              <TextInput
                label="Rating"
                placeholder="Enter rating"
                {...register("rating", { required: "Rating is required" })}
                error={errors.rating}
              />

              {/* Availability Type (tags) */}
              <div>
                <TextInput
                  label="Availability Type"
                  name="availability"
                  placeholder="Type & press enter (e.g., Video)"
                  value={availabilityInput}
                  onChange={(e) => setAvailabilityInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  isRequired={false}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {availabilityType.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-blue-500 hover:text-red-500"
                        onClick={() => removeAvailability(tag)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

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

export default AddConsultancyServiceForm;
