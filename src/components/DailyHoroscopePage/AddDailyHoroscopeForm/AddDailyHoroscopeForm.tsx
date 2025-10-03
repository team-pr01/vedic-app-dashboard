import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import Loader from "../../Shared/Loader/Loader";
import {
  useAddDailyHoroscopeMutation,
  useUpdateDailyHoroscopeMutation,
} from "../../../redux/Features/DailyHoroscope/dailyHoroscopeApi";

type TAddDailyHoroscopeFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  name: string;
  description: string;
  color: string;
  number: string;
  direction: string;
};

const AddDailyHoroscopeForm = ({
  setShowForm,
  mode = "add",
  defaultValues,
  isSingleDataLoading,
}: TAddDailyHoroscopeFormProps) => {
  const [addDailyHoroscope, { isLoading }] = useAddDailyHoroscopeMutation();
  const [updateDailyHoroscope, { isLoading: isUpdating }] =
    useUpdateDailyHoroscopeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields: (keyof TFormValues)[] = [
        "name",
        "description",
        "color",
        "number",
        "direction",
      ];
      fields.forEach((field) => setValue(field, defaultValues[field]));
    }
  }, [defaultValues, mode, setValue]);

  const onSubmit = async (data: TFormValues) => {
    try {
      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateDailyHoroscope({
          id: defaultValues._id,
          data,
        }).unwrap();
        toast.success(response?.message || "Daily horoscope updated");
      } else {
        response = await addDailyHoroscope(data).unwrap();
        toast.success(response?.message || "Daily horoscope added");
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
                {mode === "edit" ? "Edit" : "Add"} Daily Horoscope
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
                placeholder="Enter horoscope name"
                {...register("name", { required: "Name is required" })}
                error={errors.name}
              />
              <TextInput
                label="Description"
                placeholder="Enter description"
                {...register("description", {
                  required: "Description is required",
                })}
                error={errors.description}
              />
              <TextInput
                label="Color"
                placeholder="Enter color"
                {...register("color", { required: "Color is required" })}
                error={errors.color}
              />
              <TextInput
                label="Number"
                placeholder="Enter number"
                {...register("number", { required: "Number is required" })}
                error={errors.number}
              />
              <TextInput
                label="Direction"
                placeholder="Enter direction"
                {...register("direction", { required: "Direction is required" })}
                error={errors.direction}
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

export default AddDailyHoroscopeForm;
