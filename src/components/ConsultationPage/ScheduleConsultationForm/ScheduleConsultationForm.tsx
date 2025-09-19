import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { useScheduleConsultationMutation } from "../../../redux/Features/Consultation/consultationApi";
type TScheduleConsultationFormProps = {
  consultationId: string;
  onClose: () => void;
};

type TFormValues = {
  scheduledAt: string;
};

const ScheduleConsultationForm = ({
  consultationId,
  onClose,
}: TScheduleConsultationFormProps) => {
  const [scheduleConsultation, { isLoading }] =
    useScheduleConsultationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const onSubmit = async (data: TFormValues) => {
    try {
      const payload = {
        scheduledAt: data.scheduledAt,
      };
      const response = await scheduleConsultation({
        data: payload,
        id: consultationId,
      }).unwrap();
      toast.success(
        response?.message || "Consultation scheduled successfully."
      );

      reset();
      onClose();
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
              Schedule Consultation
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <TextInput
            label="Date and Time"
            placeholder="Enter Date and Time"
            type="datetime-local"
            {...register("scheduledAt", {
              required: "Date and Time is required",
            })}
            error={errors.scheduledAt}
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
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

export default ScheduleConsultationForm;
