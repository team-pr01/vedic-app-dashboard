import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";
import Loader from "../../Shared/Loader/Loader";
import Textarea from "../../Reusable/TextArea/TextArea";
import { TBooks } from "../AllBooksTable/AllBooksTable";
import {
  useAddTextMutation,
  useUpdateTextMutation,
} from "../../../redux/Features/Book/textsApi";

export type TAddorEditBookTextFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  setMode: (mode: "add" | "edit") => void;
  defaultValues?: any;
  isSingleDataLoading?: boolean;
  bookNames: TBooks[];
};

type TFormValues = {
  bookId: any;
  location: {
    chapter: string;
    verse: string;
  };
  chapter: string;
  verse: string;
  originalText: string;
  primaryTranslation: string;
  tags: string[];
  idVerified: boolean;
};

const AddorEditBookTextForm: React.FC<TAddorEditBookTextFormProps> = ({
  setShowForm,
  mode = "add",
  setMode,
  defaultValues,
  isSingleDataLoading,
  bookNames,
}) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [addText, { isLoading }] = useAddTextMutation();
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: defaultValues || {
      type: "veda",
      structure: "Chapter-Verse",
    },
  });

  //   To enter tags
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        const newTags = [...tags, trimmed];
        setTags(newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const filtered = tags.filter((tag) => tag !== tagToRemove);
    setTags(filtered);
  };

  const allBookNames = bookNames?.map((item) => {
    return {
      _id: item._id,
      name: item.name,
    };
  });

  // Set default values on edit or add
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        bookId: defaultValues?.bookId?._id ?? "",
        chapter: defaultValues.location?.chapter ?? "",
        verse: defaultValues.location?.verse ?? "",
        originalText: defaultValues.originalText ?? "",
        primaryTranslation: defaultValues.primaryTranslation ?? "",
        tags: defaultValues.tags ?? [],
        idVerified: defaultValues.idVerified ?? false,
      });
      setIsVerified(defaultValues.idVerified);
      setTags(defaultValues.tags || []);
    } else if (mode === "add") {
      reset({
        bookId: "",
        location: { chapter: "", verse: "" },
        originalText: "",
        primaryTranslation: "",
        idVerified: false,
      });
      setTags([]);
    }
  }, [defaultValues, mode, reset]);

  const onSubmit = async (data: TFormValues) => {
    const payload = {
      bookId: data.bookId,
      originalText: data.originalText,
      primaryTranslation: data.primaryTranslation,
      tags: tags,
      idVerified: isVerified,
      location: {
        chapter: data.chapter,
        verse: data.verse,
      },
    };
    try {
      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateText({
          id: defaultValues._id,
          data: payload,
        }).unwrap();
        toast.success(response?.message || "Book text updated successfully");
      } else {
        response = await addText(payload).unwrap();
        toast.success(response?.message || "Book text added successfully");
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
              onClick={() => {
                reset();
                setShowForm(false);
                setMode("add");
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Books dropdown */}
            <div className="flex flex-col gap-2 font-Inter">
              <label className="text-neutral-65">
                Book
                <span className="text-red-600"> *</span>
              </label>
              <select
                className={`px-[18px] py-[14px] rounded-lg bg-neutral-70 border text-neutral-65 focus:outline-none focus:border-primary-10 transition duration-300 ${
                  errors.bookId ? "border-red-500" : "border-neutral-75"
                }`}
                {...register("bookId", { required: "Please select book" })}
              >
                <option value="" disabled className="capitalize">
                  Select Book
                </option>
                {allBookNames.map((option, index) => (
                  <option
                    key={index}
                    value={option?._id}
                    className="capitalize"
                  >
                    {option?.name}
                  </option>
                ))}
              </select>
              {errors.bookId && typeof errors.bookId.message === "string" && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.bookId.message}
                </p>
              )}
            </div>

            {/* Locations */}
            <div className="bg-gray-100 rounded-2xl p-3 flex items-center gap-3">
              <TextInput
                label="Chapter"
                placeholder="Enter Chapter"
                {...register("chapter", { required: "Chapter is required" })}
                error={errors.chapter}
              />
              <TextInput
                label="Verse"
                placeholder="Enter Verse"
                {...register("verse", { required: "Verse is required" })}
                error={errors.verse}
              />
            </div>

            <Textarea
              label="Text (Original)"
              placeholder="Enter original text"
              {...register("originalText", {
                required: "Original text is required",
              })}
              error={errors.originalText}
            />

            <Textarea
              label="Primary Translation (English)"
              placeholder="Enter primary English translation"
              {...register("primaryTranslation", {
                required: "Primary English translation is required",
              })}
              error={errors.primaryTranslation}
            />

            {/* Tags */}
            <div>
              <TextInput
                label="Tags"
                name="tags"
                placeholder="Enter tag. Press enter to add another tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                error={
                  Array.isArray(errors.tags) ? errors.tags[0] : errors.tags
                }
                isRequired={false}
              />
              {/* Display tags below the input */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-primary-10"
                />
                <span
                  className={`ml-2 font-medium ${
                    isVerified ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  Human Verified
                </span>
              </label>
            </div>
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

export default AddorEditBookTextForm;
