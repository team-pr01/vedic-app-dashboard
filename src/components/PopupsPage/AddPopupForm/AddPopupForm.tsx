import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSendPopupMutation, useUpdatePopupMutation } from "../../../redux/Features/Popup/popupApi";
import Loader from "../../Shared/Loader/Loader";

type TFormValues = {
  title: string;
  content: string;
  imageUrl: string;
  btnText : string;
  btnLink : string;
  startDate: string;
  endDate: string;
  displayFrequency: string;
};

type TAddPopupFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: any;
};

const AddPopupForm: React.FC<TAddPopupFormProps> = ({
  showForm,
  setShowForm,
  mode,
  defaultValues,
}) => {

  const [sendPopup, {isLoading:isSending}] = useSendPopupMutation();
  const [updatePopup, {isLoading:isUpdating}] = useUpdatePopupMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

 useEffect(() => {
  if (mode === "edit" && defaultValues) {
    setValue("title", defaultValues.title);
    setValue("content", defaultValues.content || "");
    setValue("imageUrl", defaultValues.imageUrl);
    setValue("btnText", defaultValues.btnText);
    setValue("btnLink", defaultValues.btnLink);
    setValue("startDate", defaultValues.startDate);
    setValue("endDate", defaultValues.endDate);
    setValue("displayFrequency", defaultValues.displayFrequency);
  }
}, [mode, defaultValues, setValue]);



  //   Function to add or edit vastu
  const handleSubmitPopup = async (data: TFormValues) => {
  try {
    const payload = {
      ...data,
    };

    let response;
    if (mode === "edit" && defaultValues?._id) {
      response = await updatePopup({ id: defaultValues._id, data: payload }).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Popup updated successfully");
      }
    } else {
      response = await sendPopup(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Popup added successfully");
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
  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[800px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSubmitPopup)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === "edit" ? "Edit Popup" : "Add New Popup"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Title"
                placeholder="Enter Title"
                {...register("title", {
                  required: "Title is required",
                })}
                error={errors.title}
              />

              <Textarea
                label="Content"
                placeholder="Write Content here..."
                rows={6}
                error={errors.content}
                {...register("content", {
                  required: "Content is required",
                })}
              />

              <TextInput
                label="Image URL"
                placeholder="Enter Image URL"
                {...register("imageUrl", {
                  required: "Image URL is required",
                })}
                error={errors.imageUrl}
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Button Text"
                  placeholder="Enter Button Text"
                  {...register("btnText", {
                    required: "Button Text is required",
                  })}
                  error={errors.btnText}
                />

                <TextInput
                  label="Button Link"
                  placeholder="Enter Button Link"
                  {...register("btnLink", {
                    required: "Button Link is required",
                  })}
                  error={errors.btnLink}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <TextInput
                  label="Start Date"
                  type="date"
                  placeholder="Enter Start Date"
                  {...register("startDate", {
                    required: "Start Date is required",
                  })}
                  error={errors.startDate}
                />
                 <TextInput
                  label="End Date"
                  type="date"
                  placeholder="Enter End Date"
                  {...register("endDate", {
                    required: "End Date is required",
                  })}
                  error={errors.endDate}
                />
              </div>

              <SelectDropdown
                label="Display Frequency"
                {...register("displayFrequency")}
                error={errors?.displayFrequency}
                options={["Once", "Every Visit", "Daily", "Weekly"]}
              />

              {/* <SelectDropdown
                label="Targeted Audience"
                {...register("targetedAuidence")}
                error={errors?.targetedAuidence}
                options={["All Users", "Every Visit", "Daily", "Weekly"]}
              /> */}

              

              
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
                {isSending || isUpdating ? <Loader size="size-4" /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddPopupForm;
