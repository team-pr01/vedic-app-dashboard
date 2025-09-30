import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useAddVastuTipsMutation,
  useUpdateVastuTipsMutation,
} from "../../../../redux/Features/Vastu/vastuTipsApi";
import Loader from "../../../Shared/Loader/Loader";
import TextInput from "../../../Reusable/TextInput/TextInput";
import SubmitButton from "../../../Reusable/SubmitButton/SubmitButton";

type TManageVastuTipsFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  defaultValues?: any;
  isSingleDataLoading?: boolean;
  isLoading: boolean;
};

type TFormValues = {
  title: string;
  tips: string[];
  file: FileList;
};

const ManageVastuTipsForm = ({
  setShowForm,
  mode = "add",
  setMode,
  defaultValues,
  isSingleDataLoading,
  isLoading: isLoadingData,
}: TManageVastuTipsFormProps) => {
  console.log(isLoadingData);
  const [tips, setTips] = useState<string[]>([]);
  const [tipInput, setTipInput] = useState("");
  const [addVastuTips, { isLoading }] = useAddVastuTipsMutation();
  const [updateVastuTips, { isLoading: isUpdating }] =
    useUpdateVastuTipsMutation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tipInput.trim();
      if (trimmed && !tips.includes(trimmed)) setTips([...tips, trimmed]);
      setTipInput("");
    }
  };

  const removeTip = (tipToRemove: string) => {
    setTips(tips.filter((tip) => tip !== tipToRemove));
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields = ["title", "tips"] as (keyof TFormValues)[];
      fields.forEach((field) => setValue(field, defaultValues[field]));
      setTips(defaultValues?.tips || []);
    }
  }, [defaultValues, mode, setValue]);

  const onSubmit = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file" && value instanceof FileList && value.length > 0) {
          formData.append("file", value[0]);
        } else if (key !== "tips") {
          formData.append(key, value as string);
        }
      });
      tips.forEach((tip) => {
        formData.append("tips[]", tip);
      });

      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateVastuTips({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Tips updated");
      } else {
        response = await addVastuTips(formData).unwrap();
        toast.success(response?.message || "Tips added");
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {mode === "edit" ? "Update" : "Add"} Vastu Tips
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                  setMode("add");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {isLoadingData ? (
              <div className="py-10">
                <Loader size="size-10" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <TextInput
                  label="Title"
                  placeholder="Enter title"
                  {...register("title", { required: "Title is required" })}
                  error={errors.title}
                />

                <div>
                  <TextInput
                    label="Tips"
                    name="tips"
                    placeholder="Enter tip. Press enter to add another tip"
                    value={tipInput}
                    onChange={(e) => setTipInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    error={
                      Array.isArray(errors.tips) ? errors.tips[0] : errors.tips
                    }
                    isRequired={false}
                  />
                  {/* Display tags below the input */}
                  <div className="flex flex-col gap-2 mt-2">
                    {tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{tip}</span>
                        <button
                          type="button"
                          onClick={() => removeTip(tip)}
                          className="ml-1 text-blue-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File upload */}
                <TextInput
                  label="Icon"
                  type="file"
                  {...register("file")}
                  error={errors.file as any}
                  isRequired={mode === "add"}
                />
              </div>
            )}

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

export default ManageVastuTipsForm;
