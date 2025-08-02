import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader/Loader";
import { useState } from "react";
import { useSendMessageToGroupsMutation } from "../../../redux/Features/Emergencies/emergencyApi";

type TFormValues = {
  emergencyMessageId: string;
  title: string;
  adminMessage: string;
};

type TSendNotificationFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmergencyPostForm: React.FC<TSendNotificationFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormValues>();

  const [sendMessageToGroups, { isLoading }] = useSendMessageToGroupsMutation();
  const [targetedAudience, setTargetedAudience] = useState<string[]>([]);

  const handleSendNotification = async (data: TFormValues) => {
    if (targetedAudience.length === 0) {
      toast.error("Please select at least one targeted audience");
      return;
    }

    try {
      const payload = {
        ...data,
        targetedAudience,
      };
      const response = await sendMessageToGroups(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Message forwarded successfully");
        setShowForm(false);
      }
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

  const audiences = ["Moderator", "Admin"];

  const toggleAudience = (audience: string) => {
    setTargetedAudience((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience]
    );
  };

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
                label="Emergency Message Id"
                placeholder="Enter Emergency Message Id"
                {...register("emergencyMessageId", {
                  required: "Emergency Message Id is required",
                })}
                error={errors.title}
              />
              <TextInput
                label="Title"
                placeholder="Enter Title"
                {...register("title", {
                  required: "Title is required",
                })}
                error={errors.title}
                isRequired={false}
              />

              <Textarea
                label="Admin Message"
                placeholder="Write Your Message here..."
                rows={6}
                error={errors.adminMessage}
                {...register("adminMessage", {
                  required: "Admin Message is required",
                })}
                isRequired={false}
              />

              <div>
                <p className="font-medium text-gray-700 dark:text-white mb-2">
                  Targeted Audience <span className="text-red-600"> *</span>
                </p>
                <div className="flex gap-4 flex-wrap">
                  {audiences.map((audience) => (
                    <button
                      key={audience}
                      type="button"
                      onClick={() => toggleAudience(audience)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium shadow-sm transition-all ${
                        targetedAudience.includes(audience)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                      }`}
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>
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
                {isLoading ? <Loader size="size-4" /> : "Forward Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EmergencyPostForm;
