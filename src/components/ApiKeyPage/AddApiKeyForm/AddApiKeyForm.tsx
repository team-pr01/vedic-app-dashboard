import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import toast from "react-hot-toast";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useAddApiKeyMutation } from "../../../redux/Features/ApiKeys/apiKeyApi";

type TFormValues = {
  name: string;
  key: string;
};

type TAddApiKeyFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddApiKeyForm: React.FC<TAddApiKeyFormProps> = ({
  showForm,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [addApiKey, { isLoading }] = useAddApiKeyMutation();

  //   Function to add or edit reel
  const handleSubmitApiKey = async (data: TFormValues) => {
    try {
      const payload = {
        ...data,
      };

     const response = await addApiKey(payload).unwrap();
        if (response?.success) {
          toast.success("Api Key added successfully");
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

 const allApiLabels = [
  "Recipe",
  "AI Chat",
  "AI Quiz",
  "Language Translation"
];


  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto">
          <form
            onSubmit={handleSubmit(handleSubmitApiKey)}
            className="p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add API Key
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <SelectDropdown
                label="API Name"
                {...register("name")}
                error={errors?.name}
                options={allApiLabels}
              />

              <TextInput
                label="Key"
                placeholder="Enter api key"
                {...register("key", { required: "Api key is required" })}
                error={errors.key}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <SubmitButton isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddApiKeyForm;
