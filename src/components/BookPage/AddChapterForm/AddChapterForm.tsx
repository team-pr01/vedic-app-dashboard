import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import toast from "react-hot-toast";
import { useAddChapterMutation } from "../../../redux/Features/Book/bookApi";
import { useState } from "react";
import { Trash } from "lucide-react";

type TFormValues = {
  title: string;
  order: string;
};

const AddChapterForm = ({
  showForm,
  setShowForm,
  bookId,
}: {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  bookId: string;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [typeFields, setTypeFields] = useState([{ type: "" }]);

  const [addChapter, { isLoading }] = useAddChapterMutation();

  const handleAddTypeField = () => {
    setTypeFields([...typeFields, { type: "" }]);
  };

  const handleRemoveTypeField = (index: number) => {
    if (typeFields.length === 1) return; // ensure at least one
    const updated = [...typeFields];
    updated.splice(index, 1);
    setTypeFields(updated);
  };

  const handleTypeFieldChange = (index: number, value: string) => {
    const updated = [...typeFields];
    updated[index].type = value;
    setTypeFields(updated);
  };

  const handleAddChapter = async (data: TFormValues) => {
    try {
      const payload = {
        bookId: bookId,
        title: data.title,
        order: Number(data.order),
        type: typeFields,
      };

      const response = await addChapter(payload).unwrap();

      if (response?.success) {
        toast.success("Chapter created successfully");
        setShowForm(false);
        reset();
        setTypeFields([{ type: "" }]); // reset types
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
            onSubmit={handleSubmit(handleAddChapter)}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Chapter
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
              label="Chapter Title"
              placeholder="Enter Chapter Title"
              {...register("title", { required: "Title is required" })}
              error={errors.title}
            />

            <TextInput
              label="Order"
              placeholder="Enter Order"
              type="number"
              {...register("order", { required: "Order is required" })}
              error={errors.order}
            />

            {/* Dynamic Type Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type(s)
              </label>
              {typeFields.map((field, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={field.type}
                    onChange={(e) =>
                      handleTypeFieldChange(index, e.target.value)
                    }
                    placeholder={`Type ${index + 1}`}
                    className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {typeFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTypeField(index)}
                      className="text-red-600"
                      title="Delete type"
                    >
                      <Trash />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddTypeField}
                className="text-sm text-blue-600 underline mt-2"
              >
                + Add Another Type
              </button>
            </div>

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

export default AddChapterForm;
