import { useForm } from "react-hook-form";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useState } from "react";
import { X } from "lucide-react";
import SubmitButton from "../../Reusable/SubmitButton/SubmitButton";

type TFormValues = {
  originalSanskritText: string;
  devanagariText: string;
  tags: string[];
  transliteration: string;
  translations: string[];
  vedaType: string;
  mandalaNumber?: number;
  suktaNumber?: number;
  bookNumber?: number;
  chapterNumber?: number;
  verseNumber: number;
  notes: string;
};

type TAddReligiousTextFormProps = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  defaultValues?: any;
};
const AddReligiousTextForm: React.FC<TAddReligiousTextFormProps> = ({
  showForm,
  setShowForm,
  mode,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormValues>();

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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

  const handleAddReligiousText = async (data: TFormValues) => {
    console.log(data);
  };

  const isLoading = false
  const isUpdating = false

  return (
    showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[700px] overflow-y-auto p-5">
          <form onSubmit={handleSubmit(handleAddReligiousText)} className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Religious Text
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

            <Textarea
              label="Original Text (Sanskrit)"
              placeholder="Write Original Text (Sanskrit) here..."
              rows={6}
              error={errors.originalSanskritText}
              {...register("originalSanskritText", {
                required: "Original Text (Sanskrit) is required",
              })}
            />
            <Textarea
              label="Devanagari Text"
              placeholder="Write Devanagari Text here..."
              rows={6}
              error={errors.devanagariText}
              {...register("devanagariText", {
                required: "Devanagari Text is required",
              })}
            />
            <Textarea
              label="Transliteration"
              placeholder="Write Transliteration here..."
              rows={6}
              error={errors.transliteration}
              {...register("transliteration", {
                required: "Transliteration is required",
              })}
            />

            <TextInput
              label="Mandala Number"
              placeholder="Enter Mandala Number"
              type="number"
              {...register("mandalaNumber", {
                required: "Mandala Number is required",
              })}
              error={errors.mandalaNumber}
            />

            <TextInput
              label="Sukta Number"
              placeholder="Enter Sukta Number"
              type="number"
              {...register("suktaNumber", {
                required: "Sukta Number is required",
              })}
              error={errors.suktaNumber}
            />

            <TextInput
              label="Verse Number"
              placeholder="Enter Verse Number"
              type="number"
              {...register("verseNumber", {
                required: "Verse Number is required",
              })}
              error={errors.verseNumber}
            />

            <TextInput
              label="Book Number"
              placeholder="Enter Book Number"
              type="number"
              {...register("bookNumber", {
                required: "Book Number is required",
              })}
              error={errors.bookNumber}
            />

            <TextInput
              label="Chapter Number"
              placeholder="Enter Chapter Number"
              type="number"
              {...register("chapterNumber", {
                required: "Chapter Number is required",
              })}
              error={errors.chapterNumber}
            />

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

            <Textarea
              label="Notes"
              placeholder="Write notes here..."
              rows={6}
              error={errors.notes}
              {...register("notes", {
                required: "Note is required",
              })}
            />

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

export default AddReligiousTextForm;
