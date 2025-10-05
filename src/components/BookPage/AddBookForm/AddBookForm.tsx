import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import Loader from "../../Shared/Loader/Loader";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import { useCreateBookMutation, useUpdateBookMutation } from "../../../redux/Features/Book/bookApi";

export type TAddBookFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  name: string;
  type: "veda" | "purana" | "upanishad";
  structure:
    | "Chapter-Verse"
    | "Mandala-Sukta-Rik"
    | "Kanda-Sarga-Shloka"
    | "Custom";
  level1Name?: string;
  level2Name?: string;
  level3Name?: string;
  image?: FileList;
};

const AddBookForm: React.FC<TAddBookFormProps> = ({
  setShowForm,
  mode = "add",
  defaultValues,
  isSingleDataLoading,
}) => {
  const [createBook, { isLoading }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: defaultValues || {
      type: "veda",
      structure: "Chapter-Verse",
    },
  });

  const watchStructure = watch("structure");

  // Set default values on edit
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      const fields: (keyof TFormValues)[] = [
        "name",
        "type",
        "structure",
        "level1Name",
        "level2Name",
        "level3Name",
      ];
      fields.forEach((field) => setValue(field, defaultValues[field]));
    }
  }, [defaultValues, mode, setValue]);

  const onSubmit = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value instanceof FileList && value.length > 0) {
          formData.append("file", value[0]);
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });

      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateBook({ id: defaultValues._id, data: formData }).unwrap();
        toast.success(response?.message || "Book updated successfully");
      } else {
        response = await createBook(formData).unwrap();
        toast.success(response?.message || "Book added successfully");
      }

      reset();
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  if (isSingleDataLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Loader size="size-10" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              {mode === "edit" ? "Edit" : "Add"} Book
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <TextInput
              label="Book Name"
              placeholder="Enter book name"
              {...register("name", { required: "Name is required" })}
              error={errors.name}
            />

            <SelectDropdown
              label="Type"
              options={["veda", "purana", "upanishad"]}
              {...register("type", { required: "Type is required" })}
              error={errors.type}
            />

            <SelectDropdown
              label="Structure"
              options={["Chapter-Verse", "Mandala-Sukta-Rik", "Kanda-Sarga-Shloka", "Custom"]}
              {...register("structure", { required: "Structure is required" })}
              error={errors.structure}
            />

            {watchStructure === "Custom" && (
              <div className="flex flex-col gap-4">
                <TextInput
                  label="Level 1 Name (e.g., Adhyaya)"
                  placeholder="Enter level 1 name"
                  {...register("level1Name", { required: "Level 1 Name is required" })}
                  error={errors.level1Name}
                />
                <TextInput
                  label="Level 2 Name (e.g., Brahmana)"
                  placeholder="Enter level 2 name"
                  {...register("level2Name", { required: "Level 2 Name is required" })}
                  error={errors.level2Name}
                />
                <TextInput
                  label="Level 3 Name"
                  placeholder="Enter level 3 name"
                  {...register("level3Name", { required: "Level 3 Name is required" })}
                  error={errors.level3Name}
                />
              </div>
            )}

            <TextInput
              label="Cover Image"
              type="file"
              {...register("image")}
              error={errors.image as any}
              isRequired={mode === "add"}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <SubmitButton isLoading={isLoading || isUpdating} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
