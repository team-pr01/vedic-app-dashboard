import { useFieldArray, useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import { useCreateBookMutation, useUpdateBookMutation } from "../../../redux/Features/Book/bookApi";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import SectionContentBlock from "./SectionContentBlock";
import { useEffect } from "react";

type TFormValues = {
  title: string;
  description?: string;
  category: string;
  subCategory?: string;
  sections?: any;
  file?: FileList;
};

const AddBookForm = ({
  showForm,
  setShowForm,
  defaultValues,
  id,
  formType
}: {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  defaultValues?: any;
  id?: string;
  formType?: "add" | "edit";
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TFormValues>();

  useEffect(() => {
  if (formType === "edit" && defaultValues?.data) {
    // Set top-level fields
    setValue("title", defaultValues?.data?.title);
    setValue("category", defaultValues?.data?.category);
    setValue("subCategory", defaultValues?.data?.subCategory || "");
    setValue("description", defaultValues?.data?.description || "");

    // Set sections and deeply nested contents
    if (defaultValues?.data?.sections) {
      setValue("sections", defaultValues?.data?.sections);
    }
  }
}, [formType, defaultValues, setValue]);

  console.log(defaultValues);

  const {
    fields: sectionFields,
    append: addSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const [createBook, { isLoading }] = useCreateBookMutation();
  const [updateBook, { isLoading:isUpdating }] = useUpdateBookMutation();

  const handleCreateBook = async (data: TFormValues) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category", data.category);
      if (data.subCategory) formData.append("subCategory", data.subCategory);
      if (data.description) formData.append("description", data.description);
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      // Append sections
      if (data.sections) {
        formData.append("sections", JSON.stringify(data.sections));
      }

      console.log(formData);

      if (formType === "edit") {
      const response = await updateBook({id, data:formData}).unwrap();
      if (response?.success) {
        toast.success("Book updated successfully");
        window.location.reload();
        setShowForm(false);
      }
    } else {
      const response = await createBook(formData).unwrap();
      if (response?.success) {
        toast.success("Book created successfully");
        setShowForm(false);
        reset();
      }
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
            <TextInput
              label="Book Category"
              placeholder="Ex: Veda, Ramayanm Geeta, etc"
              {...register("category", { required: "Category is required" })}
              error={errors.category}
            />
            <TextInput
              label="Book Sub Category"
              placeholder="Ex: Rigveda, Bala Kand, etc"
              {...register("subCategory")}
              error={errors.subCategory}
              isRequired={false}
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
              isRequired={formType === "add"}
            />

            <button
              type="button"
              onClick={() => addSection({ name: "", number: "", contents: [] })}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 w-fit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </button>

            {sectionFields.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="bg-gray-100 p-4 rounded-2xl flex flex-col gap-4 mt-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Section {sectionIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    × Remove Section
                  </button>
                </div>

                <TextInput
                  label="Name"
                  placeholder="Ex: Mandal, Chapter, etc"
                  {...register(`sections.${sectionIndex}.name`)}
                />
                <TextInput
                  label="Number"
                  placeholder="Ex: Mandal no, Chapter No etc"
                  {...register(`sections.${sectionIndex}.number`)}
                />

                {/* Nested Content Block */}
                <SectionContentBlock
                  control={control}
                  register={register}
                  sectionIndex={sectionIndex}
                />
              </div>
            ))}

            <div className="flex justify-end space-x-3 mt-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <SubmitButton isLoading={isLoading || isUpdating} />
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddBookForm;
