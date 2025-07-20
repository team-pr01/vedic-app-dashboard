import { useForm } from "react-hook-form";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import { X } from "lucide-react";

type TFormValues = {
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  targetGroups: string[];
};

type EmergencyPostFormProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
};

const EmergencyPostForm: React.FC<EmergencyPostFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>();

  const handleSendEmergencyMessage = async (data: TFormValues) => {
    console.log("object", data);
  };

  // const categroy = [
  //   "reels"
  // vastu
  // news
  //
  // ]
  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
          <form
            onSubmit={handleSubmit(handleSendEmergencyMessage)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Emergency Message
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
                placeholder="Enter video title"
                {...register("title", { required: "Title is required" })}
                error={errors.title}
              />

              <Textarea
                label="Message"
                placeholder="Write message here..."
                rows={6}
                error={errors.message}
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 15,
                    message: "Message must be at least 15 characters",
                  },
                })}
              />

              <SelectDropdown
                label="Severity"
                {...register("severity")}
                error={errors?.severity}
                options={["Low", "Moderate", "High", "Critical"]}
                // onChange={(e: ChangeEvent<HTMLSelectElement>) => handleBankInfoChange(e, "accType")}
              />

              <SelectDropdown
                label="Target Groups"
                {...register("targetGroups")}
                error={
                  Array.isArray(errors?.targetGroups)
                    ? errors.targetGroups[0]
                    : errors?.targetGroups
                }
                options={["all", "staff", "volunteers", "members"]}
                // onChange={(e: ChangeEvent<HTMLSelectElement>) => handleBankInfoChange(e, "accType")}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Send Emergency Message
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EmergencyPostForm;
