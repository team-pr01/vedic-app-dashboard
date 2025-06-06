import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";

type TFormValues = {
  title: string;
  message: string;
  targetedAudience: string;
};

type TSendNotificationFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const SendNotificationForm: React.FC<TSendNotificationFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const handleSendNotification = async (data: TFormValues) => {
    console.log(data);
  };

  const isLoading = false;
  const isUpdating = false;
  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
          <form
            onSubmit={handleSubmit(handleSendNotification)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Send New Notification
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
                label="Message"
                placeholder="Write Message here..."
                rows={6}
                error={errors.message}
                {...register("message", {
                  required: "Message is required",
                })}
              />

              <SelectDropdown
                label="Targeted Audience"
                {...register("targetedAudience", {
                  required: "Targeted Audience is required",
                })}
                error={errors?.targetedAudience}
                options={["All Users", "Moderator", "Admin"]}
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
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Notification
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default SendNotificationForm;
