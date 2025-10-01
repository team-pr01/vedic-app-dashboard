import { Send } from "lucide-react";
import { useRef, useState } from "react";
import TextInput from "../../components/Reusable/TextInput/TextInput";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import Textarea from "../../components/Reusable/TextArea/TextArea";
import {
  useSendBulkEmailMutation,
  useSendBulkSmsMutation,
} from "../../redux/Features/BulkSms/bulkSmsApi";
import toast from "react-hot-toast";

type FormValues = {
  subject: string;
  message: string;
};

const BulkSms = () => {
  const [sendBulkEmail, { isLoading: isEmailSending }] =
    useSendBulkEmailMutation();
  const [sendBulkSms, { isLoading: isSmsSending }] = useSendBulkSmsMutation();
  const tabButtons = ["Email", "SMS"];
  const [activeTab, setActiveTab] = useState("Email");
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [audienceTarget, setAudienceTarget] = useState<any>("all");
  const AUDIENCE_OPTIONS: { key: any; label: string }[] = [
    { key: "all", label: "All Users" },
    { key: "active", label: "Active Users (30d)" },
    { key: "inactive", label: "Inactive Users" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const handleSendBulkEmail = async (data: FormValues) => {
    try {
      const payload = {
        subject: data.subject,
        message: content,
        targetedAudience: audienceTarget,
      };
      const response = await sendBulkEmail(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Email sent successfully");
        reset();
        setAudienceTarget("all");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendBulkSms = async (data: FormValues) => {
    try {
      const payload = {
        message: data?.message,
        targetedAudience: audienceTarget,
      };
      const response = await sendBulkSms(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "SMS sent successfully");
        reset();
        setAudienceTarget("all");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-128px)]">
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Compose Message
        </h2>

        <div className="flex border-b border-gray-300">
          {tabButtons?.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`flex-1 py-2 text-center border-b-2 transition-colors
        ${
          activeTab === item
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-700"
        }`}
            >
              {item}
            </button>
          ))}
        </div>

        {activeTab === "Email" && (
          <form
            onSubmit={handleSubmit(handleSendBulkEmail)}
            className="flex flex-col gap-4 mt-8"
          >
            <TextInput
              label="Subject"
              placeholder="Enter email subject"
              {...register("subject", { required: "Subject is required" })}
              error={errors.subject}
            />

            <div className="space-y-2">
              <label htmlFor="Description" className="text-neutral-65">
                Email Body
                <span className="text-red-600"> *</span>
              </label>
              <JoditEditor
                ref={editor}
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>

            <div className="flex justify-end">
              <button
              type="submit"
              disabled={isEmailSending || isSmsSending || !content}
              className="w-fit  flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEmailSending || isSmsSending ? (
                "Sending..."
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" /> Send Email
                </span>
              )}
            </button>
            </div>
          </form>
        )}

        {activeTab === "SMS" && (
          <form
            onSubmit={handleSubmit(handleSendBulkSms)}
            className="flex flex-col gap-4 mt-8"
          >
            <Textarea
              label="Message"
              placeholder="Enter message"
              {...register("message", { required: "Message is required" })}
              error={errors.message}
            />
            <div className="flex justify-end">
              <button
              type="submit"
              disabled={isEmailSending || isSmsSending || !content}
              className="w-fit  flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEmailSending || isSmsSending ? (
                "Sending..."
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" /> Send SMS
                </span>
              )}
            </button>
            </div>
          </form>
        )}
      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Select Audience
          </h3>
          <div className="space-y-2">
            {AUDIENCE_OPTIONS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="audience"
                  value={key}
                  checked={audienceTarget === key}
                  onChange={(e) => setAudienceTarget(e.target.value as any)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-200">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkSms;
