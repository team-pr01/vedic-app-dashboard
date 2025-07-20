import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { useCreateBookMutation } from "../../../redux/Features/Book/bookApi";
import toast from "react-hot-toast";

type TFormValues = {
  title: string;
  description?: string;
  file?: FileList;
};

const AddBookForm = ({
  showForm,
  setShowForm,
}: {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [createBook, { isLoading }] = useCreateBookMutation();

  const handleCreateBook = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      const response = await createBook(formData).unwrap();

      if (response?.success) {
        toast.success("Book created successfully");
        setShowForm(false);
        reset();
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

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto p-5">
          <form
            onSubmit={handleSubmit(handleCreateBook)}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Book
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

            <TextInput
              label="Book Title"
              placeholder="Enter Book Title"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
            />

            <Textarea
              label="Description"
              placeholder="Write Short Description here..."
              rows={6}
              error={errors.description}
              {...register("description")}
              isRequired={false}
            />

            <TextInput
              label="Book Image"
              type="file"
              {...register("file")}
              error={errors.file as any}
              isRequired={true}
            />

            <div className="flex justify-end space-x-3 mt-5">
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

export default AddBookForm;
